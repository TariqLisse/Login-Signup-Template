import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcrypt";
import crypto from "crypto";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
  try {
    const { contact, password } = await req.json();

    // --- Find user by email or mobile ---
    const user = await prisma.user.findFirst({
      where: {
        OR: [{ email: contact }, { mobile: contact }],
      },
    });

    if (!user) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    // --- Check if verified ---
    if (!user.verified) {
      return NextResponse.json(
        { error: "Please verify your email before signing in." },
        { status: 403 }
      );
    }

    // --- Compare password ---
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    // --- Generate OTP (6-digit) ---
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // --- Save OTP + expiry ---
    await prisma.user.update({
      where: { id: user.id },
      data: {
        otpCode: otp,
        otpExpires: new Date(Date.now() + 1000 * 60 * 5), // 5 minutes expiry
      },
    });

    // --- Send OTP email ---
    if (user.email) {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      await transporter.sendMail({
        from: `"EGOBAR" <${process.env.EMAIL_USER}>`,
        to: user.email,
        subject: "Your EGOBAR Login Code",
        html: `
          <h2>EGOBAR Login</h2>
          <p>Your one-time password (OTP) is:</p>
          <h1 style="letter-spacing:4px;">${otp}</h1>
          <p>This code will expire in 5 minutes.</p>
        `,
      });
    }

    return NextResponse.json({ message: "OTP sent to your email" });
  } catch (err) {
    console.error("Signin error:", err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
