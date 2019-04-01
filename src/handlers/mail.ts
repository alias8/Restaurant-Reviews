import htmlToText from "html-to-text";
import juice from "juice";
import nodemailer from "nodemailer";
import pug from "pug";
import { IUserModel } from "../models/User";

const transport = nodemailer.createTransport({
  auth: {
    pass: process.env.MAIL_PASS,
    user: process.env.MAIL_USER
  },
  host: process.env.MAIL_HOST,
  port: process.env.MAIL_PORT ? parseInt(process.env.MAIL_PORT, 10) : undefined
});

const generateHTML = (filename: string, options = {}) => {
  const html = pug.renderFile(
    `${__dirname}/../views/email/${filename}.pug`,
    options
  );
  return juice(html);
};

export const send = async ({
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
