// app/api/auth/logout/route.ts
import { NextResponse } from "next/server";

export async function POST() {
  // 🗑️ Clear the JWT cookie
  const res = NextResponse.json({ message: "Logged out successfully" });
  res.cookies.set("token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    expires: new Date(0), // expire immediately
  });
  return res;
}
