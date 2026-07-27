import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
let clientPromise: Promise<MongoClient> | null = null;

export function getMongoClient() {
  if (!uri) return null;
  if (!clientPromise) {
    const client = new MongoClient(uri);
    clientPromise = client.connect();
  }
  return clientPromise;
}

export function getDatabaseName() {
  return process.env.MONGODB_DB || "taslima_rumky_portfolio";
}
