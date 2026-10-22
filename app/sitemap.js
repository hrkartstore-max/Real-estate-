import { getDb } from "../lib/mongodb";
import { isVerifiedListing } from "../lib/verification";

const base = (process.env.NEXT_PUBLIC_SITE_URL || "https://hepra.in").replace(/\/$/, "");

export default async function sitemap() {
  let properties = [];
  try {
    const db = await getDb();
    if (db) {
      const docs = await db.collection("properties").find({}).toArray();
      properties = docs.filter(isVerifiedListing).map(p => ({ id: p.id || String(p._id), updatedAt: p.updatedAt || p.createdAt || new Date() }));
    }
  } catch { /* Keep the homepage available in the sitemap when the database is offline. */ }
  return [
    { url: base, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    ...properties.map(p => ({ url: `${base}/property/${encodeURIComponent(p.id)}`, lastModified: new Date(p.updatedAt), changeFrequency: "monthly", priority: 0.7 }))
  ];
}
