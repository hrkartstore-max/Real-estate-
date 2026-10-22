import "./globals.css";
import Link from "next/link";
import { SITE } from "../lib/site";

export const metadata = {
  title: "Hepra Realty | Considered homes across Tamil Nadu",
  description: "Explore homes, villas, apartments and residential land with Hepra Realty.",
  metadataBase: new URL("https://hepra.in")
};

export default function RootLayout({ children }) {
  return <html lang="en"><body>
    <header className="nav">
      <Link href="/" className="brand"><span className="brand-mark">H</span><span>HEPRA<small>REALTY</small></span></Link>
      <nav><a href="/#properties">Properties</a><a href="/#approach">Our approach</a></nav>
      <a className="button nav-button" href={`https://wa.me/${SITE.whatsapp}`} target="_blank" rel="noreferrer">Speak with us ↗</a>
    </header>
    {children}
    <footer className="footer"><div className="footer-top"><Link href="/" className="brand brand-light"><span className="brand-mark">H</span><span>HEPRA<small>REALTY</small></span></Link><p>Property, with perspective.</p><a href={`https://wa.me/${SITE.whatsapp}`}>Start a conversation ↗</a></div><div className="footer-bottom"><span>© {new Date().getFullYear()} {SITE.name}</span><span>{SITE.region}</span><a href={`mailto:${SITE.email}`}>{SITE.email}</a></div><p className="disclaimer">Listings are illustrative sample content. Verify availability, ownership, approvals, dimensions and transaction terms independently.</p></footer>
  </body></html>;
}
