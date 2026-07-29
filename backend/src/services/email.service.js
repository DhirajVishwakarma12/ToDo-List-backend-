import nodemailer from "nodemailer";
import config from "../config/config.js";

const transporter = nodemailer.createTransport({
    // FIX: Hardcode Gmail's standard IPv4 SMTP address to bypass DNS lookups
    host: "142.250.190.109", 
    port: 587,
    secure: false, 
    auth: {
        type: "OAuth2",
        user: config.GOOGLE_USER,
        clientId: config.GOOGLE_CLIENT_ID,
        clientSecret: config.GOOGLE_CLIENT_SECRET,
        refreshToken: config.GOOGLE_REFRESH_TOKEN,
    },
    // Keep this just in case, though it's less critical when using an explicit IP
    family: 4, 
    
    // CRITICAL: Because we are using an IP address instead of "smtp.gmail.com", 
    // we must tell Nodemailer not to reject the connection due to a hostname mismatch
    // on the TLS certificate.
    tls: {
        rejectUnauthorized: false
    }
});

try {
    await transporter.verify();
    console.log('Email server is ready to send the message');
} catch (error) {
    console.log('Error connecting to email server:', error);
}

export const sendemail = async (to, subject, text, html) => {
    try {
        const info = await transporter.sendMail({
            from: `"To Do List" <${config.GOOGLE_USER}>`,
            to,
            subject,
            text,
            html,
        });

        console.log("message sent: %s", info.messageId);
        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));

    } catch (error) {
        console.log("Error sending email: %s", error);
    }
}
