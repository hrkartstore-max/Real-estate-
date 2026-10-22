import { properties } from "../lib/properties";
const base = "https://hepra.in";
export default function sitemap() {
  return [
    { url: base, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    ...properties.map(p => ({ url: `${base}/property/${p.id}`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 }))
  ];
}
