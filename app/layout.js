import "./globals.css";
import Link from "next/link";
import { SITE } from "../lib/site";

export const metadata = {
  title: { default: "Hepra Realty | Considered homes across Tamil Nadu", template: "%s | Hepra Realty" },
  description: "Explore homes, villas, apartments and residential land with Hepra Realty. Compare properties and enquire directly.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://hepra.in"),
  openGraph: { title: "Hepra Realty", description: "A considered way to explore property across Tamil Nadu.", type: "website", locale: "en_IN", siteName: "Hepra Realty" },
  twitter: { card: "summary_large_image", title: "Hepra Realty", description: "Explore homes and land across Tamil Nadu." },
  robots: { index: true, follow: true }
};

export default function RootLayout({ children }) {
  return <html lang="en"><body>
    <header className="nav">
      <Link href="/" className="brand"><span className="brand-mark">H</span><span>HEPRA<small>REALTY</small></span></Link>
      <nav><a href="/#properties">Properties</a><a href="/#approach">Our approach</a><a href="/account">My account</a></nav>
      <a className="button nav-button" href={`https://wa.me/${SITE.whatsapp}`} target="_blank" rel="noreferrer">Speak with us ↗</a>
    </header>
    {children}
    <footer className="footer"><div className="footer-top"><Link href="/" className="brand brand-light"><span className="brand-mark">H</span><span>HEPRA<small>REALTY</small></span></Link><p>Property, with perspective.</p><a href={`https://wa.me/${SITE.whatsapp}`}>Start a conversation ↗</a></div><div className="footer-bottom"><span>© {new Date().getFullYear()} {SITE.name}</span><span>{SITE.region}</span><a href={`mailto:${SITE.email}`}>{SITE.email}</a></div><p className="disclaimer">Listings are illustrative sample content. Verify availability, ownership, approvals, dimensions and transaction terms independently.</p></footer>
  </body></html>;
}
