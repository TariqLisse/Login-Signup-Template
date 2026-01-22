import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const mobile = searchParams.get("mobile");

  if (!mobile) {
    return NextResponse.json({ taken: false });
  }

  const user = await prisma.user.findUnique({
    where: { mobile }, // works only if mobile is @unique
  });

  return NextResponse.json({ taken: !!user });
}
