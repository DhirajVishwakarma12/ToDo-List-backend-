import { google } from "googleapis";
import config from "../config/config.js";

// OAuth2 Client setup karein
const OAuth2 = google.auth.OAuth2;
const oauth2Client = new OAuth2(
    config.GOOGLE_CLIENT_ID,
    config.GOOGLE_CLIENT_SECRET,
    "https://developers.google.com/oauthplayground" // Standard redirect URI
);

// Apna refresh token set karein
oauth2Client.setCredentials({
    refresh_token: config.GOOGLE_REFRESH_TOKEN,
});

// Gmail API initialize karein
const gmail = google.gmail({ version: "v1", auth: oauth2Client });

export const sendemail = async (to, subject, text, html) => {
    try {
        // Raw email format banayein
        const emailLines = [
            `From: "To Do List" <${config.GOOGLE_USER}>`,
            `To: ${to}`,
            `Subject: ${subject}`,
            `Content-Type: text/html; charset="UTF-8"`,
            `MIME-Version: 1.0`,
            ``, // Header aur body ke beech khali line zaroori hai
            html || text,
        ];

        const email = emailLines.join("\r\n");

        // Gmail API ko base64 (URL safe) format mein data chahiye hota hai
        const base64EncodedEmail = Buffer.from(email)
            .toString("base64")
            .replace(/\+/g, "-")
            .replace(/\//g, "_")
            .replace(/=+$/, "");

        // API ke through email send karein (Bypasses SMTP completely)
        const response = await gmail.users.messages.send({
            userId: "me",
            requestBody: {
                raw: base64EncodedEmail,
            },
        });

        console.log("Message sent successfully via Gmail API! ID: %s", response.data.id);

    } catch (error) {
        console.log("Error sending email via API:", error.message);
    }
};
