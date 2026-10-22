import Link from "next/link";
import { notFound } from "next/navigation";
import { properties } from "../../../lib/properties";
import { fmt } from "../../../lib/site";
import Art from "../../../components/Art";
import Enquiry from "../../../components/Enquiry";

export function generateStaticParams() {
  return properties.map(p => ({ id: p.id }));
}
export function generateMetadata({ params }) {
  const p = properties.find(item => item.id === params.id);
  return { title: p ? `${p.title} | Hepra Realty` : "Property not found | Hepra Realty", description: p?.blurb || "Explore property listings with Hepra Realty." };
}
export default function PropertyPage({ params }) {
  const p = properties.find(item => item.id === params.id);
  if (!p) notFound();
  const facts = [["Asking price",fmt(p.price)],["Area",`${p.area.toLocaleString("en-IN")} sq ft`],["Property type",p.type],["Location",p.city],...(p.beds?[["Bedrooms",p.beds],["Bathrooms",p.baths]]:[])];
  return <main className="detail-page"><div className="wrap detail-wrap"><Link href="/#properties" className="back-link">← Back to the collection</Link><div className="detail-kicker"><p className="eyebrow dark">{p.city.toUpperCase()} · {p.type.toUpperCase()}</p><span>SAMPLE LISTING</span></div><h1>{p.title}</h1><p className="detail-location">⌖ {p.city}, Tamil Nadu <span>·</span> {p.area.toLocaleString("en-IN")} sq ft</p><Art type={p.type} tall/><div className="detail-columns"><section><p className="eyebrow dark">PROPERTY OVERVIEW</p><h2>Room for what<br/><em>comes next.</em></h2><p className="lead">{p.blurb}</p><div className="facts">{facts.map(([label,value])=><div className="fact" key={label}><small>{label}</small><strong>{value}</strong></div>)}</div><div className="verification"><b>i</b><p><strong>Before you make a decision</strong><br/>This is illustrative listing information. Independently verify availability, ownership/title, approvals, dimensions, encumbrances and transaction terms with qualified local professionals.</p></div></section><Enquiry subject={`${p.title} (${fmt(p.price)})`}/></div></div></main>;
}
