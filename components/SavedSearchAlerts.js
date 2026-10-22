"use client";

import { useState } from "react";

export default function SavedSearchAlerts({ city = "All", type = "All", maxPriceLakh = 0, keyword = "", minBeds = 0, minArea = 0, maxArea = 0 }) {
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [kind, setKind] = useState("");

  async function subscribe(event) {
    event.preventDefault();
    setBusy(true);
    setMessage("");
    setKind("");
    try {
      const response = await fetch("/api/saved-searches", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, city, type, maxPriceLakh, keyword, minBeds, minArea, maxArea, consent })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Could not save this alert.");
      setMessage(data.message || "Saved-search alert updated.");
      setKind(data.deliveryConfigured ? "success" : "notice");
    } catch (error) {
      setMessage(error.message || "Could not save this alert.");
      setKind("error");
    } finally {
      setBusy(false);
    }
  }

  return <section className="saved-search-alert" aria-labelledby="saved-search-alert-title">
    <div className="saved-search-copy">
      <p className="eyebrow dark">DON’T MISS THE RIGHT HOME</p>
      <h3 id="saved-search-alert-title">Get new listings <em>by email.</em></h3>
      <p>We’ll save your active location, type, budget, keyword, bedroom and size filters, then email you when a matching listing is added. You can unsubscribe at any time. Email delivery must be configured by the site owner.</p>
      <div className="saved-search-summary"><span>{city === "All" ? "All cities" : city}</span><span>{type === "All" ? "All property types" : type}</span><span>{Number(maxPriceLakh) > 0 ? `Up to ₹${maxPriceLakh} L` : "Any budget"}</span>{keyword.trim()&&<span>Keyword: {keyword.trim()}</span>}{Number(minBeds)>0&&<span>{minBeds}+ beds</span>}{Number(minArea)>0&&<span>{Number(minArea).toLocaleString("en-IN")}+ sq ft</span>}{Number(maxArea)>0&&<span>Up to {Number(maxArea).toLocaleString("en-IN")} sq ft</span>}</div>
    </div>
    <form className="saved-search-form" onSubmit={subscribe}>
      <label htmlFor="saved-search-email">Email address</label>
      <input id="saved-search-email" type="email" required autoComplete="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" />
      <label className="saved-search-consent"><input type="checkbox" checked={consent} onChange={e => setConsent(e.target.checked)} required />I agree to receive new property alerts for this search.</label>
      <button className="button" disabled={busy || !consent}>{busy ? "Saving alert…" : "Create email alert ↗"}</button>
      {message && <p className={`saved-search-message ${kind}`} role="status">{message}</p>}
    </form>
  </section>;
}
