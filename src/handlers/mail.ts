import htmlToText from "html-to-text";
import juice from "juice";
import nodemailer from "nodemailer";
import path from "path";
import pug from "pug";
import { publicDirectory, viewDirectory } from "../app";
import { IUserModel } from "../models/User";

// does not appear to be working, not sure why?
const transport = nodemailer.createTransport({
    auth: {
        pass: process.env.MAIL_PASS,
        user: process.env.MAIL_USER
    },
    debug: true,
    host: process.env.MAIL_HOST,
    port: 2525
});

const generateHTML = (filename: string, options = {}) => {
    const html = pug.renderFile(
        path.join(viewDirectory, "email", `${filename}.pug`),
        options
    );
    return juice(html);
};

export const sendEmail = async ({
    user,
    subject,
    resetURL,
    filename
}: {
    user: IUserModel;
    subject: string;
    resetURL: string;
    filename: string;
}) => {
    const html = generateHTML(filename, { user, subject, resetURL, filename });
    const text = htmlToText.fromString(html);
    const mailOptions = {
        from: `Wes Bos <noreply@wesbos.com>`,
        html,
        subject,
        text,
        to: user.email
    };
    await transport.sendMail(mailOptions);
};
