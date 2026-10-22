const base = (process.env.NEXT_PUBLIC_SITE_URL || "https://hepra.in").replace(/\/$/, "");
export default function robots() {
  return { rules: [{ userAgent: "*", allow: "/", disallow: ["/admin", "/login", "/account", "/api/"] }], sitemap: `${base}/sitemap.xml` };
}
