"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { properties, cities, types } from "../lib/properties";
import { fmt } from "../lib/site";
import Art from "../components/Art";
import SavedSearchAlerts from "../components/SavedSearchAlerts";

const categories = [
  { type: "Apartment", title: "City apartments", desc: "Thoughtfully located homes for everyday living.", icon: "⌂" },
  { type: "Villa", title: "Private villas", desc: "More space, privacy and room to grow.", icon: "◇" },
  { type: "House", title: "Independent homes", desc: "A place that feels completely your own.", icon: "⌂" },
  { type: "Plot", title: "Residential plots", desc: "Find the right ground for your next chapter.", icon: "▧" }
];

export default function Home() {
  const [city, setCity] = useState("All");
  const [type, setType] = useState("All");
  const [budget, setBudget] = useState(0);
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("featured");
  const [favorites, setFavorites] = useState([]);
  const [favoritesLoaded, setFavoritesLoaded] = useState(false);
  const [customerSignedIn, setCustomerSignedIn] = useState(false);
  useEffect(() => {
    try {
      const saved = window.localStorage.getItem("hepra-realty-saved-homes");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) setFavorites(parsed.filter(id => typeof id === "string"));
      }
    } catch (error) {
      // Keep saved homes usable if browser storage is unavailable.
    }
    setFavoritesLoaded(true);
  }, []);
  useEffect(() => {
    if (!favoritesLoaded) return;
    try {
      window.localStorage.setItem("hepra-realty-saved-homes", JSON.stringify(favorites));
    } catch (error) {
      // Saving is best-effort when storage is disabled or full.
    }
  }, [favorites, favoritesLoaded]);
  useEffect(() => { fetch("/api/account/saved").then(r => r.ok ? r.json() : null).then(data => { if (data?.authenticated) { setCustomerSignedIn(true); setFavorites(old => [...new Set([...old, ...(data.savedPropertyIds || [])])]); } }).catch(() => {}); }, []);
  useEffect(() => { if (!favoritesLoaded || !customerSignedIn) return; fetch("/api/account/saved", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ savedPropertyIds: favorites }) }).catch(() => {}); }, [favorites, favoritesLoaded, customerSignedIn]);
  const [compare, setCompare] = useState([]);
  const [showCompare, setShowCompare] = useState(false);
  const [showSavedOnly, setShowSavedOnly] = useState(false);
  const [minBeds, setMinBeds] = useState(0);
  const [minArea, setMinArea] = useState(0);
  const [maxArea, setMaxArea] = useState(0);
  const [sourceProperties, setSourceProperties] = useState(properties);
  useEffect(() => { fetch("/api/properties").then(r => r.ok ? r.json() : null).then(data => { if (Array.isArray(data?.properties) && data.properties.length) setSourceProperties(data.properties); }).catch(() => {}); }, []);
  const listings = useMemo(() => {
    const found = sourceProperties.filter(p =>
      (city === "All" || p.city === city) &&
      (type === "All" || p.type === type) &&
      (!showSavedOnly || favorites.includes(p.id)) &&
      (!budget || p.price <= budget) &&
      (!minBeds || (p.beds || 0) >= minBeds) &&
      (!minArea || p.area >= minArea) &&
      (!maxArea || p.area <= maxArea) &&
      `${p.title} ${p.city} ${p.type} ${p.area}`.toLowerCase().includes(query.toLowerCase().trim())
    );
    if (sort === "low") found.sort((a,b) => a.price-b.price);
    if (sort === "high") found.sort((a,b) => b.price-a.price);
    if (sort === "area") found.sort((a,b) => b.area-a.area);
    return found;
  }, [city,type,budget,query,sort,showSavedOnly,favorites,minBeds,minArea,maxArea,sourceProperties]);
  const reset = () => { setCity("All"); setType("All"); setBudget(0); setQuery(""); setSort("featured"); setShowSavedOnly(false); setMinBeds(0); setMinArea(0); setMaxArea(0); };
  const toggleFavorite = (id) => setFavorites(old => old.includes(id) ? old.filter(x => x !== id) : [...old,id]);
  const toggleCompare = (id) => setCompare(old => old.includes(id) ? old.filter(x => x !== id) : old.length < 3 ? [...old,id] : old);
  const compared = sourceProperties.filter(p => compare.includes(p.id));

  return <main>
    <section className="hero"><div className="hero-photo" /><div className="hero-overlay" /><div className="hero-content">
      <p className="eyebrow"><span /> A MORE CONSIDERED WAY TO FIND HOME</p>
      <h1>Find a place<br/><em>to belong.</em></h1>
      <p className="hero-copy">Exceptional homes, private villas and promising plots across Tamil Nadu. Start with what matters to you.</p>
      <a className="underlink" href="#properties">Explore the collection <span>↘</span></a>
      <div className="hero-sign"><span>H</span><div><b>HEPRA REALTY</b><small>Property, with perspective.</small></div></div>
    </div><div className="hero-caption">01 <i/> TAMIL NADU PROPERTY COLLECTION</div></section>

    <section className="search-section"><div className="search-heading"><p className="eyebrow dark">THE SEARCH STARTS HERE</p><h2>What are you looking for?</h2></div>
      <div className="search-panel">
        <label className="keyword"><span>LOCATION OR KEYWORD</span><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Try Chennai, villa, 3 BHK…" /></label>
        <label><span>CITY</span><select value={city} onChange={e=>setCity(e.target.value)}>{["All", ...new Set(sourceProperties.map(p=>p.city))].map(c=><option key={c}>{c}</option>)}</select></label>
        <label><span>PROPERTY TYPE</span><select value={type} onChange={e=>setType(e.target.value)}>{["All", ...new Set(sourceProperties.map(p=>p.type))].map(t=><option key={t}>{t}</option>)}</select></label>
        <label><span>MAXIMUM BUDGET</span><select value={budget} onChange={e=>setBudget(+e.target.value)}><option value="0">Any budget</option><option value="30">Up to ₹30 L</option><option value="50">Up to ₹50 L</option><option value="100">Up to ₹1 Cr</option><option value="250">Up to ₹2.5 Cr</option><option value="500">Up to ₹5 Cr</option></select></label>
        <label><span>MIN. BEDROOMS</span><select value={minBeds} onChange={e=>setMinBeds(+e.target.value)}><option value="0">Any</option><option value="1">1+ bedroom</option><option value="2">2+ bedrooms</option><option value="3">3+ bedrooms</option><option value="4">4+ bedrooms</option></select></label><label><span>MIN. AREA</span><select value={minArea} onChange={e=>setMinArea(+e.target.value)}><option value="0">Any size</option><option value="1000">1,000+ sq ft</option><option value="1500">1,500+ sq ft</option><option value="2000">2,000+ sq ft</option><option value="3000">3,000+ sq ft</option></select></label><label><span>MAX. AREA</span><select value={maxArea} onChange={e=>setMaxArea(+e.target.value)}><option value="0">Any size</option><option value="1200">Up to 1,200 sq ft</option><option value="2000">Up to 2,000 sq ft</option><option value="3000">Up to 3,000 sq ft</option></select></label><a className="button search-button" href="#properties">Find properties ↗</a>
      </div>
    </section>

    <section className="intro wrap"><div><p className="eyebrow dark">A BETTER WAY TO MOVE FORWARD</p><h2>Space for your<br/><em>next chapter.</em></h2></div><p>From your first apartment to land you can build on, discover a considered collection of properties selected to help you take your next step with clarity.</p></section>

    <section className="categories wrap">{categories.map(c=><button key={c.type} className={`category ${type===c.type?"active":""}`} onClick={()=>{setType(type===c.type?"All":c.type);document.getElementById("properties")?.scrollIntoView({behavior:"smooth"});}}><span className="category-icon">{c.icon}</span><strong>{c.title}</strong><small>{c.desc}</small><i>↗</i></button>)}</section>

    <section className="collection" id="properties"><div className="wrap"><div className="section-head"><div><p className="eyebrow dark">THE HEPRA COLLECTION</p><h2>Properties with <em>possibility.</em></h2><p className="muted">Explore homes and land across Tamil Nadu.</p></div><label className="sort"><span>SORT BY</span><select value={sort} onChange={e=>setSort(e.target.value)}><option value="featured">Curated order</option><option value="low">Price: low to high</option><option value="high">Price: high to low</option><option value="area">Largest area</option></select></label></div>
      <div className="result-line"><span><b>{String(listings.length).padStart(2,"0")}</b> properties to explore</span><div className="result-actions"><button className={showSavedOnly?"toolbar-active":""} onClick={()=>setShowSavedOnly(v=>!v)}>♡ Saved homes ({favorites.length})</button><button onClick={reset}>Reset filters ↺</button></div></div>
      <SavedSearchAlerts city={city} type={type} maxPriceLakh={budget}/>
      {listings.length===0&&<div className="empty"><h3>No properties found</h3><p>Try a different location, type or budget.</p><button className="button" onClick={reset}>Clear all filters</button></div>}
      <div className="property-grid">{listings.map((p,i)=><article className="property-card" key={p.id}><Link className="property-image-link" href={`/property/${p.id}`}><div className="property-image"><Art type={p.type}/><span className="number">0{i+1}</span><span className="type-pill">{p.type}</span><span className="open-arrow">↗</span></div></Link><button aria-label="Save property" className={`favorite-button ${favorites.includes(p.id)?"is-favorite":""}`} onClick={()=>toggleFavorite(p.id)}>{favorites.includes(p.id)?"♥":"♡"}</button><div className="property-info"><p className="location">⌖ {p.city} <span>/</span> {p.area.toLocaleString("en-IN")} sq ft</p><Link href={`/property/${p.id}`}><h3>{p.title}</h3></Link><div className="property-features"><span>{p.beds ? `${p.beds} bed` : "Land"}</span>{p.baths>0&&<span>{p.baths} bath</span>}<span>{p.area.toLocaleString("en-IN")} sq ft</span></div><div className="price-row"><strong>{fmt(p.price)}</strong><label className="compare-check"><input type="checkbox" checked={compare.includes(p.id)} onChange={()=>toggleCompare(p.id)} disabled={!compare.includes(p.id)&&compare.length>=3}/> Compare</label></div></div></article>)}</div>
      <p className="sample-note">Illustrative sample listings only. Verify availability, price, title and approvals independently before making a decision.</p>
    </div></section>

    <section className="approach" id="approach"><div className="approach-image"><div className="monogram"><span>H</span><small>HEPRA REALTY</small></div></div><div className="approach-copy"><p className="eyebrow">THE HEPRA APPROACH</p><h2>Good decisions<br/>start with <em>clarity.</em></h2><p>Property is personal. We believe the process should feel considered, transparent and centred around what you need next.</p><div className="steps"><div><b>01</b><span><strong>Start with your priorities</strong><small>Location, lifestyle and budget come first.</small></span></div><div><b>02</b><span><strong>Ask the right questions</strong><small>Request documentation and verify every detail.</small></span></div><div><b>03</b><span><strong>Move at your own pace</strong><small>Make an informed choice, without the rush.</small></span></div></div><a className="underlink" href={`https://wa.me/918124262289`} target="_blank" rel="noreferrer">Talk to our team <span>↗</span></a></div></section>

    <section className="closing"><p className="eyebrow dark">YOUR NEXT CHAPTER BEGINS HERE</p><h2>Let’s find the <em>right place.</em></h2><p>Tell us what you have in mind. We’ll help you take the next step.</p><a className="button" href="https://wa.me/918124262289" target="_blank" rel="noreferrer">Start a conversation ↗</a></section>
    {compare.length>0&&<aside className="compare-dock"><div><b>{compare.length} / 3 selected</b><span>Select at least two homes to compare.</span></div><div className="dock-actions"><button className="dock-clear" onClick={()=>setCompare([])}>Clear</button><button className="button" disabled={compare.length<2} onClick={()=>setShowCompare(true)}>Compare homes ↗</button></div></aside>}
    {showCompare&&<div className="modal-backdrop" onClick={e=>{if(e.target===e.currentTarget)setShowCompare(false);}}><section className="compare-modal" role="dialog" aria-modal="true" aria-labelledby="compare-title"><div className="modal-head"><div><p className="eyebrow dark">SIDE-BY-SIDE VIEW</p><h2 id="compare-title">Compare properties.</h2></div><button className="modal-close" onClick={()=>setShowCompare(false)} aria-label="Close comparison">×</button></div><div className="compare-table">{[["Property",p=>p.title],["Location",p=>p.city],["Price",p=>fmt(p.price)],["Type",p=>p.type],["Area",p=>p.area.toLocaleString("en-IN")+" sq ft"],["Bedrooms",p=>p.beds||"—"],["Bathrooms",p=>p.baths||"—"]].map(([label,value])=><div className="compare-row" key={label}><span>{label}</span>{compared.map(p=><b key={p.id}>{value(p)}</b>)}</div>)}</div><div className="modal-foot"><p className="muted">Sample figures only; verify all listing details.</p><button className="button" onClick={()=>setShowCompare(false)}>Done</button></div></section></div>}
  </main>;
}
