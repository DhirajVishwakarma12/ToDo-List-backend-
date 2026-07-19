import crypto from "crypto";

export function generateotp() {
   return Math.floor(100000 + Math.random() * 900000).toString();
}

export function getotphtml(otp, title = "Your OTP Code", message = "Use the following one-time password to complete your verification:") {
    return `
        <div style="font-family: Arial, sans-serif; color: #333; padding: 20px;">
            <h2 style="color: #1a73e8;">${title}</h2>
            <p>${message}</p>
            <div style="margin: 20px 0; display: inline-block; padding: 20px; border: 2px dashed #1a73e8; border-radius: 12px; background: #f4f8ff; font-size: 28px; letter-spacing: 6px; text-align: center; font-weight: 700;">
                ${otp}
            </div>
            <p style="font-size: 14px; color: #666;">This code expires shortly. Do not share it with anyone.</p>
        </div>
    `;
}
