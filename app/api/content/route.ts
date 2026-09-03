import { NextRequest, NextResponse } from "next/server";
import { readContent, writeContent, type SiteContent } from "@/lib/content";
import { requireAdmin } from "@/lib/auth";

export async function GET() {
  const content = await readContent();
  return NextResponse.json(content);
}

export async function PUT(req: NextRequest) {
  const isAdmin = await requireAdmin();
  if (!isAdmin) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  let content: SiteContent;
  try {
    content = (await req.json()) as SiteContent;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  try {
    await writeContent(content);
  } catch (err) {
    return NextResponse.json(
      { error: (err as Error).message },
      { status: 400 }
    );
  }

  return NextResponse.json({ ok: true });
}
