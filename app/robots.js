export default function robots() {
  return { rules: [{ userAgent: "*", allow: "/", disallow: ["/admin", "/login", "/api/"] }], sitemap: "https://hepra.in/sitemap.xml" };
}
