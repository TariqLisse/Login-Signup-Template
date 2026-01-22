import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import jwt from "jsonwebtoken";
import fs from "fs";
import path from "path";
import { promisify } from "util";

const writeFile = promisify(fs.writeFile);

// ✅ Extract user ID from JWT
function getUserIdFromToken(req: Request): string | null {
  const cookie = req.headers.get("cookie");
  if (!cookie) return null;

  const token = cookie
    .split(";")
    .find((c) => c.trim().startsWith("token="))
    ?.split("=")[1];

  if (!token) return null;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };
    return decoded.id;
  } catch {
    return null;
  }
}

// ✅ Upload Avatar
export async function POST(req: Request) {
  const userId = getUserIdFromToken(req);
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const formData = await req.formData();
  const file = formData.get("avatar") as File | null;

  if (!file) return NextResponse.json({ error: "No file uploaded" }, { status: 400 });

  const buffer = Buffer.from(await file.arrayBuffer());
  const fileName = `${userId}-${Date.now()}-${file.name}`;
  const filePath = path.join(process.cwd(), "public/uploads", fileName);

  // Ensure uploads folder exists
  fs.mkdirSync(path.join(process.cwd(), "public/uploads"), { recursive: true });

  await writeFile(filePath, buffer);

  // Public URL
  const url = `/uploads/${fileName}`;

  await prisma.user.update({
    where: { id: userId },
    data: { avatar: url },
  });

  return NextResponse.json({ success: true, avatar: url });
}

// ✅ Remove Avatar
export async function DELETE(req: Request) {
  const userId = getUserIdFromToken(req);
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await prisma.user.update({
    where: { id: userId },
    data: { avatar: null },
  });

  return NextResponse.json({ success: true });
}
