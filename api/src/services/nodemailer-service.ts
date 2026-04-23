import dotenv from 'dotenv';
dotenv.config();

import nodemailer from "nodemailer";
import { Mail } from '../utils/utils';

const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: Number(process.env.MAIL_PORT),
    //secure: false, // Start unencrypted, upgrade via STARTTLS
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
    },
});

const sendMail = async (mail: Mail) => {
    const sentMessage = await transporter.sendMail({
        from: mail.from,
        to: mail.to,
        subject: mail.subject,
        text: mail.text,
        html: mail.html
    });
    return sentMessage;
}

export default { sendMail }