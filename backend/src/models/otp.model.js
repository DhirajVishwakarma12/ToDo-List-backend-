import mongoose from "mongoose";

const otpSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: [true, "user is required"]
    },
    email: {
        type: String,
        required: [true, "email is required"]
    },
    otphash: {
        type: String,
        required: [true, "OTP hash is required"]
    },
    expiresAt: {
        type: Date,
        required: true,
    }
}, {
    timestamps: true,
    collection: "otps"
});

otpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const OtpModel = mongoose.model("otp", otpSchema);

export default OtpModel;
