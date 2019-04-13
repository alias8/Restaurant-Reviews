import htmlToText from "html-to-text";
import juice from "juice";
import nodemailer from "nodemailer";
import * as path from "path";
import pug from "pug";
import { publicDirectory, viewDirectory } from "../app";
import { IUserModel } from "../models/User";

const transport = nodemailer.createTransport({
    auth: {
        pass: process.env.MAIL_PASS,
        user: process.env.MAIL_USER
    },
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT
        ? parseInt(process.env.MAIL_PORT, 10)
        : undefined
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
