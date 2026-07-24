import nodemailer from "nodemailer";
import { google } from "googleapis";
import config from "../config/config.js";

const oAuth2Client = new google.auth.OAuth2(
    config.GOOGLE_CLIENT_ID,
    config.GOOGLE_CLIENT_SECRET
);

oAuth2Client.setCredentials({
    refresh_token: config.GOOGLE_REFRESH_TOKEN
});

export const sendemail = async (to, subject, text, html) => {
    try {
        const accessToken = await oAuth2Client.getAccessToken();

        const transporter = nodemailer.createTransport({
            host: "gmail",
            secure: true,
            auth: {
                type: "OAuth2",
                user: config.GOOGLE_USER,
                clientId: config.GOOGLE_CLIENT_ID,
                clientSecret: config.GOOGLE_CLIENT_SECRET,
                refreshToken: config.GOOGLE_REFRESH_TOKEN,
                accessToken: accessToken.token,
            },
        });

        await transporter.verify();
        console.log("✅ SMTP Connected");

        const info = await transporter.sendMail({
            from: `"To Do List" <${config.GOOGLE_USER}>`,
            to,
            subject,
            text,
            html,
        });

        console.log("✅ Email Sent:", info.messageId);

        return info;
    } catch (error) {
        console.error("========== MAIL ERROR ==========");
        console.error(error);
        console.error("Message:", error.message);
        console.error("Code:", error.code);
        console.error("Response:", error.response);
        console.error("===============================");

        throw error;
    }
};
