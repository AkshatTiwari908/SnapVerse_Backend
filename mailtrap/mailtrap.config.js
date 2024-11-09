import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config({path: "./.env"});

export const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    }
});
console.log(transporter);