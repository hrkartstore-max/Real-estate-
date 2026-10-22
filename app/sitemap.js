import { properties as samples } from "../lib/properties";
import { getDb } from "../lib/mongodb";
const base = (process.env.NEXT_PUBLIC_SITE_URL || "https://hepra.in").replace(/\/$/, "");
export default async function sitemap() {
  let properties = samples;
  try {
    const db = await getDb();
    if (db) {
      const docs = await db.collection("properties").find({}, { projection: { id: 1 } }).toArray();
      if (docs.length) properties = docs.map(p => ({ id: p.id || String(p._id) }));
    }
  } catch { /* Keep sample route URLs in the sitemap if the database is offline. */ }
  return [
    { url: base, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    ...properties.map(p => ({ url: `${base}/property/${p.id}`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 }))
  ];
}
