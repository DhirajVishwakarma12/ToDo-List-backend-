import dns from "dns";
dns.setDefaultResultOrder("ipv4first");
import nodemailer from "nodemailer";
import config from "../config/config.js";

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        type: "OAuth2",
        user: config.GOOGLE_USER,
        clientId: config.GOOGLE_CLIENT_ID,
        clientSecret: config.GOOGLE_CLIENT_SECRET,
        refreshToken: config.GOOGLE_REFRESH_TOKEN,
    },
    family: 4,      
});

await transporter.verify((error, success) => {
    if (error) {
        console.log('Error connecting to email server:', error)
    } else {
        console.log('Email server is ready to send the message')

    }
})
export const sendemail = async (to, subject, text, html) => {
    try {
        const info = await transporter.sendMail({
            from: `"To Do List" <${config.GOOGLE_USER}>`,
            to,
            subject,
            text,
            html,
        });

        console.log("message send :%s", info.messageId)
        console.log("Preview URL :%s", nodemailer.getTestMessageUrl(info))


    } catch (error) {
        console.log("Error sending email :%s", error)

    }
}


