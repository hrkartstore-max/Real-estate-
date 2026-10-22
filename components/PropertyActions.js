"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "hepra-realty-saved-homes";

export default function PropertyActions({ propertyId, title }) {
  const [saved, setSaved] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    try {
      const current = JSON.parse(window.localStorage.getItem(STORAGE_KEY) || "[]");
      setSaved(Array.isArray(current) && current.includes(propertyId));
    } catch {}
  }, [propertyId]);

  function toggleSave() {
    let current = [];
    try {
      const parsed = JSON.parse(window.localStorage.getItem(STORAGE_KEY) || "[]");
      if (Array.isArray(parsed)) current = parsed.filter(id => typeof id === "string");
    } catch {}
    const next = current.includes(propertyId) ? current.filter(id => id !== propertyId) : [...current, propertyId];
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      setSaved(next.includes(propertyId));
      setMessage(next.includes(propertyId) ? "Saved to your favourites on this device." : "Removed from saved homes.");
    } catch {
      setMessage("Your browser could not save this property. Check storage permissions.");
    }
  }

  async function share() {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title, text: "Take a look at " + title + " on HEPRA Realty", url });
        setMessage("Property share opened.");
      } else if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(url);
        setMessage("Property link copied.");
      } else {
        setMessage("Copy this page URL from your browser to share it.");
      }
    } catch (error) {
      if (error?.name !== "AbortError") setMessage("Could not share automatically. Copy the page URL instead.");
    }
  }

  return <div className="property-actions" aria-label="Property actions">
    <button type="button" className={saved ? "property-action is-saved" : "property-action"} onClick={toggleSave}>{saved ? "♥ Saved home" : "♡ Save home"}</button>
    <button type="button" className="property-action" onClick={share}>↗ Share property</button>
    {message && <p className="property-action-message" role="status">{message}</p>}
  </div>;
}
