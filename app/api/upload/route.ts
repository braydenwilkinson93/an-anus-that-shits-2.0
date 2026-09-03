import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { requireAdmin } from "@/lib/auth";

const ALLOWED_TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
};

const MAX_BYTES = 8 * 1024 * 1024; // 8MB

export async function POST(req: NextRequest) {
  const isAdmin = await requireAdmin();
  if (!isAdmin) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const formData = await req.formData();
  const file = formData.get("file");
  const bookId = formData.get("bookId");

  if (!(file instanceof File) || typeof bookId !== "string") {
    return NextResponse.json({ error: "Missing file or bookId" }, { status: 400 });
  }

  const ext = ALLOWED_TYPES[file.type];
  if (!ext) {
    return NextResponse.json(
      { error: "Unsupported image type. Use JPG, PNG, WEBP, or GIF." },
      { status: 400 }
    );
  }

  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: "Image too large (8MB max)." }, { status: 400 });
  }

  const idNum = parseInt(bookId, 10);
  if (!Number.isFinite(idNum)) {
    return NextResponse.json({ error: "Invalid bookId" }, { status: 400 });
  }

  const filename = `book-${idNum}-${Date.now()}.${ext}`;
  const destDir = path.join(process.cwd(), "public", "books");
  const destPath = path.join(destDir, filename);

  const bytes = Buffer.from(await file.arrayBuffer());
  await fs.mkdir(destDir, { recursive: true });
  await fs.writeFile(destPath, bytes);

  return NextResponse.json({ ok: true, path: `/books/${filename}` });
}
