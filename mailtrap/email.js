
import {
    PASSWORD_RESET_REQUEST_TEMPLATE,
    PASSWORD_RESET_SUCCESS_TEMPLATE,
    VERIFICATION_EMAIL_TEMPLATE,
} from "./emailTemplates.js";
import { transporter } from "./mailtrap.config.js";

export const sendVerificationEmail = async (email, verificationToken) => {
    try {
        const mailOptions = {
            from: `"shivam" <sgg86953@gmail.com>`, 
            to: email,
            subject: "Verify your email",
            html: VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}", verificationToken),
        };

        const response = await transporter.sendMail(mailOptions);
        console.log("Email sent successfully", response);
    } catch (error) {
        console.error(`Error sending verification`, error);
        throw new Error(`Error sending verification email: ${error}`);
    }
};
export const sendWelcomeEmail = async (email, name) => {
    try {
        const mailOptions = {
            from: `"shivam" <sgg86953@gmail.com>`, 
            to: email,
            subject: "Welcome to Our Service",
            html: `<h1>Welcome, ${name}!</h1><p>Thank you for joining us.</p>`, 
        };

        const response = await transporter.sendMail(mailOptions);
        console.log("Welcome email sent successfully", response);
    } catch (error) {
        console.error("Error sending welcome email", error);
        throw new Error(`Error sending welcome email: ${error}`);
    }
};
export const sendPasswordResetEmail = async (email, resetURL) => {
    try {
        const mailOptions = {
            from: `"shivam" <sgg86953@gmail.com>`, 
            
            to: email,
            subject: "Reset your password",
            html: PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}", resetURL),
        };

        const response = await transporter.sendMail(mailOptions);
        console.log("Password reset email sent successfully", response);
    } catch (error) {
        console.error("Error sending password reset email", error);
        throw new Error(`Error sending password reset email: ${error}`);
    }
};
export const sendResetSuccessEmail = async (email) => {
    try {
        const mailOptions = {
            from: `"shivam" <sgg86953@gmail.com>`, 
       
            to: email,
            subject: "Password Reset Successful",
            html: PASSWORD_RESET_SUCCESS_TEMPLATE,
        };

        const response = await transporter.sendMail(mailOptions);
        console.log("Password reset success email sent successfully", response);
    } catch (error) {
        console.error("Error sending password reset success email", error);
        throw new Error(`Error sending password reset success email: ${error}`);
    }
};

