import Link from "next/link";
import { notFound } from "next/navigation";
import { properties } from "../../../lib/properties";
import { fmt } from "../../../lib/site";
import Art from "../../../components/Art";
import Enquiry from "../../../components/Enquiry";
import MortgageCalculator from "../../../components/MortgageCalculator";
import PropertyActions from "../../../components/PropertyActions";
import LocationMap from "../../../components/LocationMap";
import { getDb } from "../../../lib/mongodb";
import { isVerifiedListing } from "../../../lib/verification";
export const dynamic = "force-dynamic";

export function generateStaticParams() {
  return properties.map(p => ({ id: p.id }));
}
export async function generateMetadata({ params }) {
  let p = properties.find(item => item.id === params.id);
  try {
    const db = await getDb();
    if (db) p = await db.collection("properties").findOne({ id: params.id }) || p;
  } catch { /* Sample metadata remains available if MongoDB is offline. */ }
  if (!p) return { title: "Property not found | Hepra Realty", robots: { index: false, follow: false } };
  const verified = isVerifiedListing(p);
  const title = `${p.title} in ${p.city} | Hepra Realty`;
  const description = `${p.title} in ${p.city}, Tamil Nadu. ${p.area.toLocaleString("en-IN")} sq ft, ${fmt(p.price)}. ${verified ? "Listing marked verified by the listing administrator." : "Illustrative listing; independently verify property details."} ${p.blurb || ""}`.slice(0, 300);
  const url = `/property/${p.id}`;
  return {
    title, description,
    alternates: { canonical: url },
    keywords: [p.title, p.city, p.type, "property in Tamil Nadu", "HEPRA Realty"],
    openGraph: { type: "website", title, description, url, siteName: "Hepra Realty", locale: "en_IN", images: [{ url: "/opengraph-image" }] },
    twitter: { card: "summary_large_image", title, description, images: ["/opengraph-image"] },
    robots: { index: verified, follow: true }
  };
}
export default async function PropertyPage({ params }) {
  let p = properties.find(item => item.id === params.id);
  try {
    const db = await getDb();
    if (db) p = await db.collection("properties").findOne({ id: params.id }) || p;
    if (p?._id) { const { _id, ...plain } = p; p = plain; }
  } catch { /* Keep the sample listing as a fallback if the database is unavailable. */ }
  if (!p) notFound();
  const facts = [["Asking price",fmt(p.price)],["Area",`${p.area.toLocaleString("en-IN")} sq ft`],["Property type",p.type],["Location",p.city],...(p.beds?[["Bedrooms",p.beds],["Bathrooms",p.baths]]:[])];
  return <main className="detail-page"><div className="wrap detail-wrap"><Link href="/#properties" className="back-link">← Back to the collection</Link><div className="detail-kicker"><p className="eyebrow dark">{p.city.toUpperCase()} · {p.type.toUpperCase()}</p><span className={isVerifiedListing(p)?"verified-badge":"sample-badge"}>{p.verified===true&&["ownershipProof","approvalDocuments","encumbranceCertificate","propertyTaxReceipt"].every(id=>(p.verificationDocuments||[]).includes(id))?"✓ VERIFIED LISTING":"ILLUSTRATIVE LISTING"}</span></div><h1>{p.title}</h1><p className="detail-location">⌖ {p.city}, Tamil Nadu <span>·</span> {p.area.toLocaleString("en-IN")} sq ft</p><PropertyActions propertyId={p.id} title={p.title}/><Art type={p.type} tall/><LocationMap city={p.city} address={p.address} latitude={p.latitude} longitude={p.longitude} verified={p.verified===true&&["ownershipProof","approvalDocuments","encumbranceCertificate","propertyTaxReceipt"].every(id=>(p.verificationDocuments||[]).includes(id))}/><div className="detail-columns"><section><p className="eyebrow dark">PROPERTY OVERVIEW</p><h2>Room for what<br/><em>comes next.</em></h2><p className="lead">{p.blurb}</p><div className="facts">{facts.map(([label,value])=><div className="fact" key={label}><small>{label}</small><strong>{value}</strong></div>)}</div><MortgageCalculator priceLakh={p.price}/><div className="verification"><b>i</b><p><strong>Before you make a decision</strong><br/>This is illustrative listing information. Independently verify availability, ownership/title, approvals, dimensions, encumbrances and transaction terms with qualified local professionals.</p></div></section><Enquiry subject={`${p.title} (${fmt(p.price)})`}/></div></div></main>;
}
