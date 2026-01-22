// app/api/auth/verify-email/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const token = searchParams.get("token");

    if (!token) {
      return NextResponse.json({ error: "Invalid token" }, { status: 400 });
    }

    const user = await prisma.user.findFirst({
      where: {
        verificationToken: token,
        verificationExpires: { gt: new Date() }, // still valid
      },
    });

    if (!user) {
      return NextResponse.json({ error: "Token expired or invalid" }, { status: 400 });
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { verified: true, verificationToken: null, verificationExpires: null },
    });

    // redirect to signin page with a success message
    return NextResponse.redirect(`${process.env.APP_URL}/signin?verified=true`);
  } catch (err) {
    console.error("Verify error:", err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
