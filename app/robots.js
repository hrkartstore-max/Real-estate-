export default function robots() {
  return { rules: [{ userAgent: "*", allow: "/", disallow: ["/admin", "/login", "/account", "/api/"] }], sitemap: "https://hepra.in/sitemap.xml" };
}
