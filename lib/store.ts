import { defaultContent, normalizeContent, PortfolioContent } from "@/lib/content";
import { getDatabaseName, getMongoClient } from "@/lib/mongodb";

export async function getContent(): Promise<PortfolioContent> {
  try {
    const clientPromise = getMongoClient();
    if (!clientPromise) return defaultContent;
    const client = await clientPromise;
    const document = await client
      .db(getDatabaseName())
      .collection<PortfolioContent & { _key: string }>("content")
      .findOne({ _key: "portfolio" });
    return document ? normalizeContent(document) : defaultContent;
  } catch (error) {
    console.error("Unable to load portfolio content", error);
    return defaultContent;
  }
}

export async function saveContent(content: PortfolioContent) {
  const clientPromise = getMongoClient();
  if (!clientPromise) throw new Error("MongoDB is not configured.");
  const client = await clientPromise;
  const normalized = normalizeContent({ ...content, updatedAt: new Date().toISOString() });
  await client.db(getDatabaseName()).collection("content").updateOne(
    { _key: "portfolio" },
    { $set: { ...normalized, _key: "portfolio" } },
    { upsert: true }
  );
  return normalized;
}
