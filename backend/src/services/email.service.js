import nodemailer from "nodemailer"
import config from "../config/config.js"


const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        type: "oauth2",
        user: config.GOOGEL_USER,
        clientId: config.GOOGLE_CLIENT_ID,
        clientSecret: config.GOOGLE_CLIENT_SECRET,
        refreshToken: config.GOOGLE_REFRESH_TOKEN
    }
})

//verify the connection configuration
transporter.verify((error, info) => {
    if (error) {
        console.error("Error connecting to mail server:", error);
    } else {
        console.log("Email server is ready to send messages:", info);
    }
})

//function to send email
export const sendemail = async (to, subject, text, html) => {
    try {
        const info = await transporter.sendMail({
            from: `"To Do List" <${config.GOOGEL_USER}>`,
            to,
            subject,
            text,
            html,
        });

        console.log("Message sent: %s", info.messageId);
        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
        return info;
    } catch (error) {
        console.error("Error sending the message:", error);
        throw error;
    }
}