// lib/mailer.ts
import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  service: "gmail", // or "Outlook", "Yahoo", or custom SMTP
  auth: {
    user: process.env.SMTP_USER, // your email
    pass: process.env.SMTP_PASS, // app password (not raw email password)
  },
});
