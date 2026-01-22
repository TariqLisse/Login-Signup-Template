import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import nodemailer from "nodemailer";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // Check if user exists
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return NextResponse.json({ error: "No account found with this email" }, { status: 404 });
    }

    if (user.verified) {
      return NextResponse.json({ error: "Email is already verified" }, { status: 400 });
    }

    // Generate token
    const token = crypto.randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + 1000 * 60 * 30); // 30 minutes

    // Save to DB
    await prisma.user.update({
      where: { email },
      data: {
        verificationToken: token,
        verificationExpires: expires,
      },
    });

    // Email transport (Gmail example, switch to SMTP in prod)
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const verificationUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/verify-email?token=${token}`;

    await transporter.sendMail({
      from: `"EGOBAR" <${process.env.SMTP_USER}>`,
      to: email,
      subject: "Verify your email",
      html: `
        <h2>Verify your EGOBAR account</h2>
        <p>Click the link below to verify your email:</p>
        <a href="${verificationUrl}" target="_blank">${verificationUrl}</a>
        <p>This link will expire in 30 minutes.</p>
      `,
    });

    return NextResponse.json({ message: "Verification email resent" });
  } catch (err) {
    console.error("Resend verification error:", err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
