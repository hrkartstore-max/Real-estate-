import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
if (!uri && process.env.NODE_ENV === "production") {
  // Database configuration is optional until persistent listings are enabled.
}
let clientPromise;
if (uri) {
  const options = {};
  if (process.env.NODE_ENV === "development") {
    if (!global._mongoClientPromise) {
      global._mongoClientPromise = new MongoClient(uri, options).connect();
    }
    clientPromise = global._mongoClientPromise;
  } else {
    clientPromise = new MongoClient(uri, options).connect();
  }
}
export async function getDb() {
  if (!clientPromise) return null;
  const client = await clientPromise;
  return client.db(process.env.MONGODB_DB || "hepra_realty");
}
