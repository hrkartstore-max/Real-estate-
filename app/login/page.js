"use client";
import { useState } from "react";
import Link from "next/link";
export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  async function submit(e) {
    e.preventDefault(); setBusy(true); setError("");
    try {
      const response = await fetch("/api/auth/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, password }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Unable to sign in.");
      window.location.href = "/admin";
    } catch (err) { setError(err.message || "Unable to sign in."); }
    finally { setBusy(false); }
  }
  return <main className="auth-page"><form className="auth-card" onSubmit={submit}><p className="eyebrow dark">HEPRA REALTY · ADMIN</p><h1>Welcome <em>back.</em></h1><p className="muted">Sign in to manage property listings.</p><label>Admin email<input type="email" autoComplete="username" required value={email} onChange={e=>setEmail(e.target.value)} placeholder="admin@example.com"/></label><label>Password<input type="password" autoComplete="current-password" required value={password} onChange={e=>setPassword(e.target.value)} placeholder="Your admin password"/></label>{error&&<p className="auth-error" role="alert">{error}</p>}<button className="button" disabled={busy}>{busy?"Signing in…":"Sign in securely ↗"}</button><small>Admin access requires server-side credentials configured in your deployment environment.</small><Link href="/" className="back-link">← Back to website</Link></form></main>;
}
