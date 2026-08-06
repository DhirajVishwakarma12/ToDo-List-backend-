import { google } from "googleapis";
import config from "../config/config.js";

const OAuth2 = google.auth.OAuth2;

export const sendemail = async (to, subject, text, html) => {
    try {
        const oauth2Client = new OAuth2(
            config.GOOGLE_CLIENT_ID,
            config.GOOGLE_CLIENT_SECRET,
            "https://developers.google.com/oauthplayground"
        );

        oauth2Client.setCredentials({
            refresh_token: config.GOOGLE_REFRESH_TOKEN,
        });

        // Get access token explicitly to catch auth failures before making Gmail calls
        const { token } = await oauth2Client.getAccessToken();
        if (!token) {
            throw new Error("Could not retrieve access token from Google.");
        }

        const gmail = google.gmail({ version: "v1", auth: oauth2Client });

        const emailLines = [
            `From: "To Do List" <${config.GOOGLE_USER}>`,
            `To: ${to}`,
            `Subject: ${subject}`,
            `Content-Type: text/html; charset="UTF-8"`,
            `MIME-Version: 1.0`,
            ``,
            html || text,
        ];

        const email = emailLines.join("\r\n");

        const base64EncodedEmail = Buffer.from(email)
            .toString("base64")
            .replace(/\+/g, "-")
            .replace(/\//g, "_")
            .replace(/=+$/, "");

        const response = await gmail.users.messages.send({
            userId: "me",
            requestBody: {
                raw: base64EncodedEmail,
            },
        });

        console.log("Message sent successfully via Gmail API! ID: %s", response.data.id);
        return response.data;

    } catch (error) {
        // Detailed error logging for debugging
        const googleError = error.response?.data?.error_description || error.message;
        console.error("Error sending email via API:", googleError);
        throw new Error(`Email sending failed: ${googleError}`);
    }
};
