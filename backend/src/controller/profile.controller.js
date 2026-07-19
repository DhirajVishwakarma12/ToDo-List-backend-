import UserModel from "../models/user.model.js";
import crypto from "crypto";

export async function viewProfile(req, res) {
    const userId = req.user?.id;

    if (!userId) {
        return res.status(401).json({ message: "Authentication required" });
    }

    const user = await UserModel.findById(userId).select("-password");

    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }

    const userResponse = user.toObject();
    const privatePasswordSet = Boolean(userResponse.privatePassword);
    delete userResponse.privatePassword;

    res.status(200).json({
        message: "User retrieved successfully",
        user: [userResponse],
        privatePasswordSet,
    });
}

export async function setPrivatePassword(req, res) {
    const userId = req.user?.id;
    const { currentPassword, newPassword, confirmPassword } = req.body;

    if (!userId) {
        return res.status(401).json({ message: "Authentication required" });
    }

    if (!newPassword || !confirmPassword) {
        return res.status(400).json({ message: "New password and confirmation are required" });
    }

    if (newPassword !== confirmPassword) {
        return res.status(400).json({ message: "New password and confirmation do not match" });
    }

    const user = await UserModel.findById(userId);

    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }

    if (user.privatePassword) {
        if (!currentPassword) {
            return res.status(400).json({ message: "Current private password is required" });
        }

        const currentHash = crypto.createHash("sha256").update(currentPassword).digest("hex");

        if (currentHash !== user.privatePassword) {
            return res.status(401).json({ message: "Current private password is incorrect" });
        }
    }

    user.privatePassword = crypto.createHash("sha256").update(newPassword).digest("hex");
    await user.save();

    res.status(200).json({
        message: user.privatePassword
            ? "Private password saved successfully"
            : "Private password created successfully",
    });
}

export async function verifyPrivatePassword(req, res) {
    const userId = req.user?.id;
    const { password } = req.body;

    if (!userId) {
        return res.status(401).json({ message: "Authentication required" });
    }

    if (!password) {
        return res.status(400).json({ message: "Password is required" });
    }

    const user = await UserModel.findById(userId);

    if (!user || !user.privatePassword) {
        return res.status(400).json({ message: "Private task password is not set" });
    }

    const passwordHash = crypto.createHash("sha256").update(password).digest("hex");

    if (passwordHash !== user.privatePassword) {
        return res.status(401).json({ message: "Incorrect private task password" });
    }

    res.status(200).json({ message: "Private password verified successfully" });
}
