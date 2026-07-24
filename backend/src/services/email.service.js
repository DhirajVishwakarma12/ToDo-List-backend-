import { google } from "googleapis";
import nodemailer from "nodemailer";
import config from "../config/config.js";
    
const oAuth2Client = new google.auth.OAuth2(
    config.GOOGLE_CLIENT_ID,
    config.GOOGLE_CLIENT_SECRET
);

oAuth2Client.setCredentials({
    refresh_token: config.GOOGLE_REFRESH_TOKEN
});

const accessToken = await oAuth2Client.getAccessToken();


const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
    type: "OAuth2",
    user: config.GOOGLE_USER,
    clientId: config.GOOGLE_CLIENT_ID,
    clientSecret: config.GOOGLE_CLIENT_SECRET,
    refreshToken: config.GOOGLE_REFRESH_TOKEN,
    accessToken: accessToken.token,
}
});

await transporter.verify();
console.log("SMTP Ready");

await transporter.sendMail({
    from: process.env.GOOGLE_USER,
    to,
    subject,
    text,
    html,
});
