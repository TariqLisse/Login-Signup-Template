// app/api/protected/route.ts
import { NextResponse } from "next/server";
import { getUserFromCookie } from "@/lib/auth";

export async function GET() {
  const user = getUserFromCookie();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.json({ message: "Protected route accessed", user });
}
