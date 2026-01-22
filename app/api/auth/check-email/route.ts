import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get("email");

  if (!email) {
    return NextResponse.json({ taken: false });
  }

  const user = await prisma.user.findUnique({
    where: { email },
  });

  return NextResponse.json({ taken: !!user });
}
