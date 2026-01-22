import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const username = searchParams.get("username");

  if (!username) {
    return NextResponse.json({ taken: false });
  }

  const user = await prisma.user.findUnique({
    where: { username },
  });

  return NextResponse.json({ taken: !!user });
}
