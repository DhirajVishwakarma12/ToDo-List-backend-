import config from "../config/config.js";
import mongoose from "mongoose";
import OtpModel from "../models/otp.model.js";

async function connectDB() {
    try {
        await mongoose.connect(config.MONGO_URI);

        console.log("mongoDb connected successfully");

        await OtpModel.createCollection().catch((error) => {
            if (error.code !== 11000 && error.code !== 48) {
                console.error("OTP collection init error", error.message);
            }
        });
    } catch (error) {
        console.error("MongoDB connection Error", error.message);
    }
}

export default connectDB;