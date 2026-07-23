import nodemailer from "nodemailer"
import config from "../config/config.js"


const transporter = nodemailer.createTransport({
    service: "smtp.gmail.com",
    connectionTimeout: 60000,
    greetingTimeout: 30000,
    socketTimeout: 60000,
    auth: {
        type: "OAuth2",
        user: config.GOOGLE_USER,
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
            from: `"To Do List" <${config.GOOGLE_USER}>`,
            to,
            subject,
            text,
            html,
        });

        console.log("Message sent: %s", info.messageId);
        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
        return info;
    } catch (error) {
    console.error("========== MAIL ERROR ==========");
    console.error(error);
    console.error("Message:", error.message);
    console.error("Code:", error.code);
    console.error("Command:", error.command);
    console.error("Response:", error.response);
    console.error("Stack:", error.stack);
    console.error("===============================");

    throw error;
}
    }
