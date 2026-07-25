import dns from "dns";
dns.setDefaultResultOrder("ipv4first");

import nodemailer from "nodemailer";
import { google } from "googleapis";
import config from "../config/config.js";

const oAuth2Client = new google.auth.OAuth2(
    config.GOOGLE_CLIENT_ID,
    config.GOOGLE_CLIENT_SECRET
);

oAuth2Client.setCredentials({
    refresh_token: config.GOOGLE_REFRESH_TOKEN,
});


export const sendemail = async (to, subject, text, html) => {
    try {
        const accessToken = await oAuth2Client.getAccessToken();
        console.log(accessToken);
        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 465,
            secure: true,
             requireTLS: true,
            auth: {
                type: "OAuth2",
                user: config.GOOGLE_USER,
                clientId: config.GOOGLE_CLIENT_ID,
                clientSecret: config.GOOGLE_CLIENT_SECRET,
                refreshToken: config.GOOGLE_REFRESH_TOKEN,
                accessToken: accessToken.token,
            },
        });
            // check the transporter
console.log("GOOGLE_USER:", config.GOOGLE_USER);

try {
    await transporter.verify();
    console.log("SMTP Connected");
} catch (err) {
    console.error("VERIFY ERROR:", err);
    throw err;
}

        await transporter.sendMail({
            from: config.GOOGLE_USER,
            to,
            subject,
            text,
            html,
        });

        console.log("Email sent successfully");
    } catch (err) {
        console.error(err);
        console.error("Message:", err.message);
        console.error("Code:", err.code);
        console.error("Stack:", err.stack);
        console.error("Response:", err.response);
        console.error("ResponseCode:", err.responseCode);
    }
};
