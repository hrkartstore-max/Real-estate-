import { getDb } from "./mongodb";

export async function notifySavedSearchSubscribers(property) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL;
  if (!apiKey || !from) return { configured: false, sent: 0 };

  const db = await getDb();
  if (!db) return { configured: false, sent: 0 };
  const subscriptions = await db.collection("savedSearches").find({
    active: { $ne: false },
    $and: [
      { $or: [{ city: "All" }, { city: property.city }] },
      { $or: [{ type: "All" }, { type: property.type }] },
      { $or: [{ maxPriceLakh: { $lte: 0 } }, { maxPriceLakh: { $gte: Number(property.price) } }] }
    ]
  }).toArray();
  const matchedSubscriptions = subscriptions.filter(sub => {
    const needle = String(sub.keyword || "").trim().toLowerCase();
    const text = `${property.title || ""} ${property.city || ""} ${property.type || ""} ${property.area || ""}`.toLowerCase();
    return (!needle || text.includes(needle)) &&
      Number(property.beds || 0) >= Number(sub.minBeds || 0) &&
      Number(property.area || 0) >= Number(sub.minArea || 0) &&
      (!Number(sub.maxArea || 0) || Number(property.area || 0) <= Number(sub.maxArea));
  });
  const base = (process.env.NEXT_PUBLIC_SITE_URL || "https://hepra.in").replace(/\/$/, "");
  let sent = 0;
  for (const sub of matchedSubscriptions) {
    const unsubscribe = `${base}/api/saved-searches/unsubscribe?token=${encodeURIComponent(sub.unsubscribeToken || "")}`;
    const text = [
      `A new HEPRA Realty listing matches your saved search.`,
      "",
      property.title,
      `Location: ${property.city}, Tamil Nadu`,
      `Type: ${property.type}`,
      `Price: ₹${property.price} lakh`,
      `Area: ${property.area} sq ft`,
      "",
      `View property: ${base}/property/${encodeURIComponent(property.id)}`,
      "",
      `Stop these alerts: ${unsubscribe}`,
      "",
      "This is an automated alert based on the search you subscribed to. Listing details should be independently verified."
    ].join("\n");
    try {
      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({ from, to: [sub.email], subject: `New listing matching your search: ${property.city}`, text })
      });
      if (response.ok) sent += 1;
    } catch { /* Listing creation should not fail because email delivery is offline. */ }
  }
  return { configured: true, sent };
}
