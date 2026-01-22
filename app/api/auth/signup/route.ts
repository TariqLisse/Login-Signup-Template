// app/api/auth/signup/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcrypt";
import crypto from "crypto";
import nodemailer from "nodemailer";

const APP_URL = process.env.APP_URL || "http://localhost:3000"; // frontend base url

export async function POST(req: Request) {
  try {
    let { username, email, mobile, password, confirmPassword, birthday } =
      await req.json();

    // --- Clean inputs ---
    username = username?.trim();
    email = email?.trim() === "" ? null : email?.trim();
    mobile = mobile?.trim() === "" ? null : mobile?.trim();

    // --- Validation ---
    if (!username || username.length < 3 || username.length > 20) {
      return NextResponse.json(
        { error: "Username must be between 3 and 20 characters" },
        { status: 400 }
      );
    }

    if (!email && !mobile) {
      return NextResponse.json(
        { error: "Either email or mobile number is required" },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email && !emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    const phoneRegex = /^\+?[1-9]\d{9,14}$/;
    if (mobile && !phoneRegex.test(mobile)) {
      return NextResponse.json(
        { error: "Invalid mobile number format" },
        { status: 400 }
      );
    }

    // ✅ Updated Password Regex
    // Requires: at least 1 lowercase, 1 uppercase, 1 digit, 1 special char (any), min length 8
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/;

    if (!passwordRegex.test(password)) {
      return NextResponse.json(
        {
          error:
            "Password must be at least 8 characters long and include uppercase, lowercase, number, and special character",
        },
        { status: 400 }
      );
    }

    if (password !== confirmPassword) {
      return NextResponse.json(
        { error: "Passwords do not match" },
        { status: 400 }
      );
    }

    if (!birthday) {
      return NextResponse.json(
        { error: "Birthday is required" },
        { status: 400 }
      );
    }

    const birthDate = new Date(birthday);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    const dayDiff = today.getDate() - birthDate.getDate();
    const isUnder13 =
      age < 13 ||
      (age === 13 && (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)));
    if (isUnder13) {
      return NextResponse.json(
        { error: "You must be at least 13 years old" },
        { status: 400 }
      );
    }

    // --- Check existing user ---
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { username },
          email ? { email } : undefined,
          mobile ? { mobile } : undefined,
        ].filter(Boolean) as any,
      },
    });
    if (existingUser) {
      return NextResponse.json(
        { error: "Username, email, or mobile already exists" },
        { status: 400 }
      );
    }

    // --- Hash password ---
    const hashed = await bcrypt.hash(password, 10);

    // --- Generate verification token ---
    const verificationToken = crypto.randomBytes(32).toString("hex");
    const verificationExpires = new Date(Date.now() + 1000 * 60 * 60 * 24); // 24h

    // --- Create user ---
    const user = await prisma.user.create({
      data: {
        username,
        email,
        mobile,
        password: hashed,
        birthday: birthDate,
        verified: false,
        verificationToken,
        verificationExpires,
      },
    });

    // --- Send verification email (if email provided) ---
    if (email) {
      const transporter = nodemailer.createTransport({
        service: "gmail", // or your SMTP provider
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      const verifyUrl = `${APP_URL}/api/auth/verify-email?token=${verificationToken}`;

      await transporter.sendMail({
        from: `"EGOBAR" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: "Verify your EGOBAR account",
        html: `
          <h1>Welcome to EGOBAR!</h1>
          <p>Hi ${username}, please verify your email by clicking the link below:</p>
          <a href="${verifyUrl}" target="_blank" style="color:white; background:#e60023; padding:10px 20px; border-radius:5px; text-decoration:none;">Verify Email</a>
          <p>This link will expire in 24 hours.</p>
        `,
      });
    }

    return NextResponse.json({
      message:
        "User created successfully. Please check your email for verification link.",
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        mobile: user.mobile,
      },
    });
  } catch (err) {
    console.error("Signup error:", err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
