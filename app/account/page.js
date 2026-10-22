"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
export default function AccountPage(){
  const [mode,setMode]=useState("login");
  const [name,setName]=useState("");
  const [email,setEmail]=useState("");
  const [password,setPassword]=useState("");
  const [error,setError]=useState("");
  const [account,setAccount]=useState(null);
  const [busy,setBusy]=useState(false);
  async function refresh(){const data=await fetch("/api/account/me").then(r=>r.json()).catch(()=>({authenticated:false}));setAccount(data.authenticated?data:null);}
  useEffect(()=>{refresh();},[]);
  async function submit(e){
    e.preventDefault();setBusy(true);setError("");
    try{const r=await fetch(mode==="register"?"/api/account/register":"/api/account/login",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({name,email,password})});const d=await r.json();if(!r.ok)throw new Error(d.error||"Could not sign in.");setAccount(d);setPassword("");}
    catch(e){setError(e.message||"Something went wrong.");}finally{setBusy(false)}
  }
  async function logout(){await fetch("/api/account/logout",{method:"POST"});setAccount(null);}
  if(account)return <main className="auth-page"><section className="auth-card account-card"><p className="eyebrow dark">YOUR HEPRA ACCOUNT</p><h1>Welcome, <em>{account.name||"back"}.</em></h1><p className="muted">{account.email}</p><div className="account-saved"><strong>{(account.savedPropertyIds||[]).length} saved homes</strong><p>Saved properties sync to this account when you use the same login on another device.</p><Link className="button" href="/#properties">Explore properties ↗</Link></div><button className="admin-cancel" onClick={logout}>Sign out</button><Link href="/" className="back-link">← Return to HEPRA Realty</Link></section></main>;
  return <main className="auth-page"><form className="auth-card" onSubmit={submit}><p className="eyebrow dark">HEPRA REALTY · YOUR ACCOUNT</p><h1>{mode==="login"?"Welcome ":"Create your "}<em>{mode==="login"?"back.":"account."}</em></h1><p className="muted">Save favourite homes and keep them synced across devices.</p>{mode==="register"&&<label>Your name<input autoComplete="name" required value={name} onChange={e=>setName(e.target.value)} placeholder="Full name"/></label>}<label>Email address<input type="email" autoComplete="email" required value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@example.com"/></label><label>Password<input type="password" autoComplete={mode==="login"?"current-password":"new-password"} minLength={mode==="register"?10:1} required value={password} onChange={e=>setPassword(e.target.value)} placeholder={mode==="register"?"At least 10 characters":"Your password"}/></label>{error&&<p className="auth-error" role="alert">{error}</p>}<button className="button" disabled={busy}>{busy?"Please wait…":mode==="login"?"Sign in ↗":"Create account ↗"}</button><button className="admin-cancel" type="button" onClick={()=>{setMode(mode==="login"?"register":"login");setError("");}}>{mode==="login"?"New to HEPRA? Create an account":"Already have an account? Sign in"}</button><small>Account features require MongoDB and AUTH_SECRET configuration. Passwords are stored as salted hashes, not plain text.</small><Link href="/" className="back-link">← Back to website</Link></form></main>;
}
