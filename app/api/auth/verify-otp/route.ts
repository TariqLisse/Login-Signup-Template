import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "super-secret";

export async function POST(req: Request) {
  try {
    const { contact, otp } = await req.json();

    if (!contact || !otp) {
      return NextResponse.json(
        { error: "Contact and OTP are required" },
        { status: 400 }
      );
    }

    // --- Find user by email or mobile ---
    const user = await prisma.user.findFirst({
      where: {
        OR: [{ email: contact }, { mobile: contact }],
      },
    });

    if (!user) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    // --- Check OTP ---
    if (
      !user.otpCode ||
      !user.otpExpires ||
      user.otpCode !== otp ||
      user.otpExpires < new Date()
    ) {
      return NextResponse.json(
        { error: "Invalid or expired OTP" },
        { status: 400 }
      );
    }

    // --- Clear OTP after use ---
    await prisma.user.update({
      where: { id: user.id },
      data: { otpCode: null, otpExpires: null },
    });

    // --- Create session token ---
    const token = jwt.sign(
      { id: user.id, username: user.username },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    const res = NextResponse.json({ message: "OTP verified successfully" });
    res.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60, // 1h
    });

    return res;
  } catch (err) {
    console.error("Verify OTP error:", err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
