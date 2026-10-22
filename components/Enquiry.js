"use client";

import { useState } from "react";
import { SITE } from "../lib/site";

export default function Enquiry({ subject }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [note, setNote] = useState("");
  const valid = name.trim().length > 1 && /^\d{10}$/.test(phone);
  async function send() {
    if (!valid) return;
    const message = `Hello ${SITE.name}, I'm ${name} (${phone}). I'm interested in: ${subject}.${note.trim() ? ` Message: ${note.trim()}` : ""}`;
    const waUrl = `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(message)}`;
    window.open(waUrl, "_blank", "noopener,noreferrer");
    try { await fetch("/api/enquiries", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name, phone, note, subject }) }); } catch { /* WhatsApp enquiry remains available if storage is offline. */ }
  }
  return <aside className="enquiry" id="enquiry">
    <p className="eyebrow">LET’S TALK PROPERTY</p><h2>Make an enquiry.</h2>
    <p className="muted">Share your details and continue securely in WhatsApp.</p>
    <label>Your name<input value={name} onChange={e => setName(e.target.value)} autoComplete="name" placeholder="Full name" /></label>
    <label>Mobile number<input value={phone} onChange={e => setPhone(e.target.value.replace(/\D/g, "").slice(0,10))} inputMode="numeric" autoComplete="tel" placeholder="10-digit mobile number" /></label>
    <label>Message <span className="muted">(optional)</span><textarea rows="3" value={note} onChange={e => setNote(e.target.value)} placeholder="What would you like to know?" /></label>
    <button className="button" type="button" onClick={send} disabled={!valid}>Continue on WhatsApp <span>↗</span></button>
    <small className="muted">You will continue in WhatsApp. If database storage is configured, your enquiry is also recorded for follow-up.</small>
  </aside>;
}
