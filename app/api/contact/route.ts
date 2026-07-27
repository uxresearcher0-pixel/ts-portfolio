import { NextResponse } from "next/server";
import { getDatabaseName, getMongoClient } from "@/lib/mongodb";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (body.website) return NextResponse.json({ ok: true });
    const name = String(body.name || "").trim().slice(0, 100);
    const email = String(body.email || "").trim().slice(0, 180);
    const project = String(body.project || "Full portfolio").trim().slice(0, 160);
    const message = String(body.message || "").trim().slice(0, 2000);
    if (name.length < 2 || !emailPattern.test(email) || message.length < 10) {
      return NextResponse.json({ error: "Enter your name, a valid email, and a message of at least 10 characters." }, { status: 400 });
    }
    const client = await getMongoClient();
    if (!client) return NextResponse.json({ error: "Contact requests are temporarily unavailable." }, { status: 503 });
    await client.db(getDatabaseName()).collection("contact_requests").insertOne({ name, email, project, message, createdAt: new Date().toISOString(), status: "new" });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Unable to send your request. Please try again." }, { status: 500 });
  }
}
