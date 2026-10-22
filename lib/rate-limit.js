import crypto from "node:crypto";
import { getDb } from "./mongodb";

const WINDOW_MS = 10 * 60 * 1000;
let indexPromise;

function clientKey(request, scope) {
  const forwarded = request.headers.get("x-vercel-forwarded-for") ||
    request.headers.get("x-real-ip") ||
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    "unknown";
  const secret = process.env.AUTH_SECRET || "hepra-rate-limit";
  const digest = crypto.createHmac("sha256", secret).update(String(forwarded)).digest("hex");
  return scope + ":" + digest;
}

/**
 * Fixed-window limiter backed by MongoDB so limits are shared across serverless
 * instances. If the database is unavailable, returns a non-blocking result;
 * configure MongoDB and monitor this dependency for production protection.
 */
export async function checkRateLimit(request, scope, limit, windowMs = WINDOW_MS) {
  try {
    const db = await getDb();
    if (!db) return { limited: false, configured: false };
    const collection = db.collection("apiRateLimits");
    if (!indexPromise) {
      indexPromise = collection.createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 }).catch(error => {
        indexPromise = null;
        throw error;
      });
    }
    await indexPromise;
    const now = Date.now();
    const bucket = Math.floor(now / windowMs);
    const key = clientKey(request, scope) + ":" + bucket;
    const expiresAt = new Date((bucket + 1) * windowMs + 60_000);
    const result = await collection.findOneAndUpdate(
      { key },
      { $inc: { count: 1 }, $setOnInsert: { expiresAt, createdAt: new Date(now) } },
      { upsert: true, returnDocument: "after", includeResultMetadata: false }
    );
    const count = result?.count || 0;
    return {
      limited: count > limit,
      configured: true,
      remaining: Math.max(0, limit - count),
      retryAfterSeconds: Math.max(1, Math.ceil(((bucket + 1) * windowMs - now) / 1000))
    };
  } catch {
    return { limited: false, configured: false };
  }
}
