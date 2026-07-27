import dns from "dns";

dns.setDefaultResultOrder("ipv4first");
import nodemailer from "nodemailer"
import config from "../config/config.js"

console.log(process.version);

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    requireTLS: true,

    auth: {
        type: "OAuth2",
        user: config.GOOGEL_USER,
        clientId: config.GOOGLE_CLIENT_ID,
        clientSecret: config.GOOGLE_CLIENT_SECRET,
        refreshToken: config.GOOGLE_REFRESH_TOKEN,
    },

    connectionTimeout: 30000,
    greetingTimeout: 30000,
    socketTimeout: 30000,
});
dns.lookup("smtp.gmail.com", { all: true }, (err, addresses) => {
    console.log(err);
    console.log(addresses);
});
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
    }
}
