import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { normalizeContent } from "@/lib/content";
import { getContent, saveContent } from "@/lib/store";

export async function GET() {
  if (!(await isAuthenticated())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return NextResponse.json(await getContent());
}

export async function PUT(request: Request) {
  if (!(await isAuthenticated())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const body = normalizeContent(await request.json());
    return NextResponse.json(await saveContent(body));
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to save content." }, { status: 500 });
  }
}
