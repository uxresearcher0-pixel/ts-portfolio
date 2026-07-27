import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { isAuthenticated } from "@/lib/auth";
import { getDatabaseName, getMongoClient } from "@/lib/mongodb";

export async function GET() {
  if (!(await isAuthenticated())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const client = await getMongoClient();
  if (!client) return NextResponse.json([]);
  const requests = await client.db(getDatabaseName()).collection("contact_requests").find({}).sort({ createdAt: -1 }).limit(100).toArray();
  return NextResponse.json(requests.map(item => ({ ...item, _id: String(item._id) })));
}

export async function PATCH(request: Request) {
  if (!(await isAuthenticated())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id, status } = await request.json();
  if (!ObjectId.isValid(id) || !["new", "read"].includes(status)) return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  const client = await getMongoClient();
  if (!client) return NextResponse.json({ error: "Database unavailable." }, { status: 503 });
  await client.db(getDatabaseName()).collection("contact_requests").updateOne({ _id: new ObjectId(id) }, { $set: { status } });
  return NextResponse.json({ ok: true });
}

export async function DELETE(request: Request) {
  if (!(await isAuthenticated())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const id = new URL(request.url).searchParams.get("id") || "";
  if (!ObjectId.isValid(id)) return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  const client = await getMongoClient();
  if (!client) return NextResponse.json({ error: "Database unavailable." }, { status: 503 });
  await client.db(getDatabaseName()).collection("contact_requests").deleteOne({ _id: new ObjectId(id) });
  return NextResponse.json({ ok: true });
}
