import UserModel from "../models/user.model.js";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import config from "../config/config.js";
import SessionModel from "../models/session.model.js";
import { sendemail } from "../services/email.service.js";
import OtpModel from "../models/otp.model.js";
import { generateotp, getotphtml } from "../utils/otp.utils.js";

//register user
export async function registerUser(req, res) {
  const { username, email, password } = req.body;

  const existingUser = await UserModel.findOne({
    $or: [{ username }, { email }],
  });

  if (existingUser) {
    return res.status(400).json({
      message: "User already exists",
    });
  }

  const hashpassword = crypto
    .createHash("sha256")
    .update(password)
    .digest("hex");

  const newUser = await UserModel.create({
    username,
    email,
    password: hashpassword,
    verified: false,
  });

  // Generate OTP
  const otp = generateotp();
  const html = getotphtml(otp);
  const otphash = crypto.createHash("sha256").update(otp).digest("hex");

  const otpRecord = await OtpModel.create({
    user: newUser._id,
    email,
    otphash,
    expiresAt: new Date(Date.now() + 10 * 60 * 1000),
  });

  // Send response immediately
  res.status(201).json({
    message: `OTP is being sent to ${email}`,
    verified: newUser.verified,
  });

  // Send email in background
  sendemail(email, "OTP VERIFICATION", `Your OTP is ${otp}`, html)
    .then(() => {
      console.log("OTP email sent successfully");
    })
    .catch(async (error) => {
      console.error("Failed to send OTP:", error);

      // Delete OTP record
      await OtpModel.deleteOne({ _id: otpRecord._id });

      // Optional: delete user if registration should only succeed when email is sent
      // await UserModel.deleteOne({ _id: newUser._id });
    });
}

//login user
export async function loginUser(req, res) {
  const { password, username } = req.body;

  const user = await UserModel.findOne({
    $or: [{ username }, { email: username }],
  });

  if (!user) {
    return res.status(404).json({
      message: "Invalid username and password",
    });
  }

  if (!user.verified) {
    return res.status(401).json({
      message: "not verified user",
    });
  }

  //check password from user
  const hashPassword = crypto
    .createHash("sha256")
    .update(password)
    .digest("hex");

  //verify the password
  if (user.password != hashPassword) {
    return res.status(401).json({
      message: "Invalid password",
    });
  }

  const refreshtoken = jwt.sign(
    {
      id: user._id,
    },
    config.JWT_SECRET,
    {
       expiresIn: "7d" 
    },
  );

  const refreshTokenHash = crypto
    .createHash("sha256")
    .update(refreshtoken)
    .digest("hex");

  const session = await SessionModel.create({
    user: user._id,
    refreshTokenHash,
    ipAddress: req.ip,
    userAgent: req.headers["user-agent"],
  });

  const accessToken = jwt.sign(
    {
      id: user._id,
      sessionId: session._id,
    },
    config.JWT_SECRET,
    { expiresIn: "15m" },
  );

  res.cookie("refreshtoken", refreshtoken, {
    httpOnly: true,
    secure: true,
    sameSite: "None",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.status(200).json({
    message: "User logged in successfully",
    accessToken,
    refreshtoken,
  });
}

//refresh token generate new access token
export async function refreshToken(req, res) {
  const refreshToken = req.cookies.refreshtoken;

  if (!refreshToken) {
    return res.status(401).json({
      message: "Refresh token not found",
    });
  }

  const refreshTokenHash = crypto
    .createHash("sha256")
    .update(refreshToken)
    .digest("hex");

  const session = await SessionModel.findOne({
    refreshTokenHash,
    revoked: false,
  });

  if (!session) {
    return res.status(401).json({
      message: "Invalid refresh token",
    });
  }

  try {
    const decoded = jwt.verify(refreshToken, config.JWT_SECRET);

    const accessToken = jwt.sign(
      {
        id: decoded.id,
      },
      config.JWT_SECRET,
      { expiresIn: "15m" },
    );

    const newRefreshToken = jwt.sign(
      {
        id: decoded.id,
      },
      config.JWT_SECRET,
      { expiresIn: "7d" },
    );

    const newRefreshTokenHash = crypto
      .createHash("sha256")
      .update(newRefreshToken)
      .digest("hex");

    session.refreshTokenHash = newRefreshTokenHash;
    await session.save();

    res.cookie("refreshtoken", newRefreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      message: "Access token refreshed successfully",
      accessToken,
      refreshtoken: newRefreshToken,
    });
  } catch (error) {
    return res.status(403).json({
      message: "Invalid refresh token",
    });
  }
}

//logout user
export async function logoutUser(req, res) {
  const refreshToken = req.cookies.refreshtoken;

  if (!refreshToken) {
    return res.status(401).json({
      message: "Refresh token not found",
    });
  }

  const refreshTokenHash = crypto
    .createHash("sha256")
    .update(refreshToken)
    .digest("hex");

  const session = await SessionModel.findOne({
    refreshTokenHash,
    revoked: false,
  });

  if (!session) {
    return res.status(401).json({
      message: "Invalid refresh token",
    });
  }

  session.revoked = true;
  await session.save();

  res.clearCookie("refreshtoken");

  res.status(200).json({
    message: "User logged out successfully",
  });
}

//logout from all
export async function logoutAll(req, res) {

  try {
    const refreshToken = req.cookies.refreshtoken;


    if (!refreshToken) {
      return res.status(401).json({
        message: "refreshtoken not found.",
      });
    }

    const decoded = jwt.verify(refreshToken, config.JWT_SECRET);

    await SessionModel.updateMany(
      {
        user: decoded.id,
        revoked: false,
      },
      {
        revoked: true,
      },
    );

    res.clearCookie("refreshtoken");

    return res.status(200).json({
      message: "logout from all devices successfully..",
    });
  }catch(error) {
      console.error(error);
  
      return res.status(401).json({
        success: false,
        message: "Invalid or expired refresh token.",
      });
    }
  }


export async function verifyOtp(req, res) {
  const { otp } = req.body;

  const otphash = crypto.createHash("sha256").update(otp).digest("hex");

  const optverify = await OtpModel.findOne({
    otphash,
  });

  if (!optverify) {
    return res.status(400).json({
      message: "otp invalid",
    });
  }

  const user = await UserModel.findByIdAndUpdate(optverify.user, {
    verified: true,
  });

  await OtpModel.deleteMany({
    user: optverify.user,
  });

  return res.status(200).json({
    message: "OTP verified successfully",
    user,
  });
}

export async function resendOtp(req, res) {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({
      message: "Email is required",
    });
  }

  const user = await UserModel.findOne({ email });

  if (!user) {
    return res.status(404).json({
      message: "User not found",
    });
  }

  await OtpModel.deleteMany({ user: user._id });

  const otp = generateotp();
  const html = getotphtml(otp);
  const otphash = crypto.createHash("sha256").update(otp).digest("hex");

  const otpRecord = await OtpModel.create({
    user: user._id,
    email,
    otphash,
    expiresAt: new Date(Date.now() + 10 * 60 * 1000),
  });

  // Send response immediately
  res.status(201).json({
    message: `OTP is being sent to ${email}`,
    verified: user.verified,
  });

  // Send email in background
  sendemail(email, "OTP VERIFICATION", `Your OTP is ${otp}`, html)
    .then(() => {
      console.log("OTP email sent");
    })
    .catch(async (error) => {
      console.error(error);
      await OtpModel.deleteOne({ _id: otpRecord._id });
    });
}


export async function getMe(req,res) {
  
  const accesstoken = req.headers.authorization?.split(" ")[1];

  if(!accesstoken){
    return res.status(401).json({
      message:"invalid User"
    })
  }

  try {
  const decoded = jwt.verify(accesstoken , config.JWT_SECRET);
    
    const user = await UserModel.findById(decoded.id)

    return res.status(200).json({
      message:"user fetched successfully",
      user :{
        username: user.username,
        email:user.email
      }
    })

  } catch (error) {
    return res.status(200).json({
      message:"user not found"
    })
  }

}
