"use client";
import { useEffect, useState } from "react";
const blank = { id:"", title:"", city:"Chennai", type:"Apartment", price:"", area:"", beds:"2", baths:"2", blurb:"" };
export default function AdminPage() {
  const [auth,setAuth] = useState("checking");
  const [email,setEmail] = useState("");
  const [items,setItems] = useState([]);
  const [enquiries,setEnquiries] = useState([]);
  const [form,setForm] = useState(blank);
  const [message,setMessage] = useState("");
  const [busy,setBusy] = useState(false);
  const [leadQuery,setLeadQuery] = useState("");
  const [leadFilter,setLeadFilter] = useState("All");
  async function load() {
    const me = await fetch("/api/auth/me").then(r=>r.json()).catch(()=>({authenticated:false}));
    if(!me.authenticated){setAuth("signed-out");return;}
    setEmail(me.email||""); setAuth("signed-in");
    const data=await fetch("/api/properties").then(r=>r.json()).catch(()=>({properties:[]}));
    setItems(data.properties||[]);
    const leadData = await fetch("/api/enquiries").then(r=>r.json()).catch(()=>({enquiries:[],configured:false}));
    setEnquiries(leadData.enquiries||[]);
    if(data.source!=="database") setMessage("Database is not connected yet. Configure MONGODB_URI to save live listings; sample listings are read-only.");
  }
  useEffect(()=>{load();},[]);
  function edit(p){setForm({...p,price:String(p.price),area:String(p.area),beds:String(p.beds||0),baths:String(p.baths||0)});window.scrollTo({top:0,behavior:"smooth"});}
  async function save(e){
    e.preventDefault();setBusy(true);setMessage("");
    const body={...form,id:form.id||undefined,price:Number(form.price),area:Number(form.area),beds:Number(form.beds||0),baths:Number(form.baths||0)};
    try{const r=await fetch("/api/properties",{method:form.id?"PUT":"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(body)});const d=await r.json();if(!r.ok)throw new Error(d.error||"Could not save listing.");setForm(blank);setMessage("Listing saved.");await load();}catch(e){setMessage(e.message)}finally{setBusy(false)}
  }
  async function remove(id){if(!window.confirm("Delete this property listing?"))return;const r=await fetch("/api/properties?id="+encodeURIComponent(id),{method:"DELETE"});const d=await r.json();if(!r.ok){setMessage(d.error||"Delete failed");return}setItems(old=>old.filter(p=>p.id!==id));setMessage("Listing deleted.");}
  async function setLeadStatus(id,status){const r=await fetch("/api/enquiries",{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify({id,status})});const d=await r.json();if(!r.ok){setMessage(d.error||"Could not update enquiry");return}setEnquiries(old=>old.map(item=>item.id===id?{...item,status}:item));}
  const filteredEnquiries = enquiries.filter(item => (leadFilter === "All" || (item.status || "New") === leadFilter) && `${item.name} ${item.phone} ${item.subject} ${item.note || ""}`.toLowerCase().includes(leadQuery.toLowerCase().trim()));
  const leadCounts = { New: enquiries.filter(item => (item.status || "New") === "New").length, Contacted: enquiries.filter(item => item.status === "Contacted").length, Closed: enquiries.filter(item => item.status === "Closed").length };
  async function logout(){await fetch("/api/auth/logout",{method:"POST"});window.location.href="/login";}
  if(auth==="checking")return <main className="admin-wrap"><p>Checking admin session…</p></main>;
  if(auth==="signed-out")return <main className="admin-wrap"><div className="admin-heading"><p className="eyebrow dark">PRIVATE WORKSPACE</p><h1>Admin <em>dashboard.</em></h1><p>Sign in to manage listings. Live edits require MongoDB configuration.</p><a className="button" href="/login">Admin sign in ↗</a></div></main>;
  return <main className="admin-wrap"><div className="admin-top"><div><p className="eyebrow dark">HEPRA REALTY · CONTROL ROOM</p><h1>Property <em>manager.</em></h1><p className="muted">Signed in as {email}. Live changes are stored in MongoDB.</p></div><button className="button admin-logout" onClick={logout}>Sign out ↗</button></div>
  {message&&<p className="admin-message" role="status">{message}</p>}
  <div className="admin-layout"><form className="admin-form" onSubmit={save}><p className="eyebrow dark">{form.id?"EDIT LISTING":"ADD A LISTING"}</p><h2>{form.id?"Update property":"New property"}</h2><label>Property title<input required value={form.title} onChange={e=>setForm({...form,title:e.target.value})}/></label><div className="admin-form-row"><label>City<input required value={form.city} onChange={e=>setForm({...form,city:e.target.value})}/></label><label>Type<select value={form.type} onChange={e=>setForm({...form,type:e.target.value})}>{["Apartment","Villa","House","Plot"].map(t=><option key={t}>{t}</option>)}</select></label></div><div className="admin-form-row"><label>Price (₹ lakh)<input type="number" min="1" required value={form.price} onChange={e=>setForm({...form,price:e.target.value})}/></label><label>Area (sq ft)<input type="number" min="1" required value={form.area} onChange={e=>setForm({...form,area:e.target.value})}/></label></div><div className="admin-form-row"><label>Bedrooms<input type="number" min="0" value={form.beds} onChange={e=>setForm({...form,beds:e.target.value})}/></label><label>Bathrooms<input type="number" min="0" value={form.baths} onChange={e=>setForm({...form,baths:e.target.value})}/></label></div><label>Description<textarea rows="4" value={form.blurb} onChange={e=>setForm({...form,blurb:e.target.value})}/></label><button className="button" disabled={busy}>{busy?"Saving…":form.id?"Save changes ↗":"Create listing ↗"}</button>{form.id&&<button type="button" className="admin-cancel" onClick={()=>setForm(blank)}>Cancel editing</button>}</form>
  <section className="admin-list"><div className="admin-list-head"><div><p className="eyebrow dark">LISTING INVENTORY</p><h2>{items.length} properties</h2></div><button className="admin-refresh" onClick={load}>Refresh ↻</button></div>{items.map(p=><article className="admin-item" key={p.id}><div><strong>{p.title}</strong><small>{p.city} · {p.type} · ₹{p.price} L · {p.area} sq ft</small></div><div className="admin-item-actions"><button onClick={()=>edit(p)}>Edit</button><button onClick={()=>remove(p.id)}>Delete</button></div></article>)}</section><section className="admin-list admin-leads"><div className="admin-list-head"><div><p className="eyebrow dark">CLIENT FOLLOW-UP</p><h2>{enquiries.length} enquiries</h2></div><button className="admin-refresh" onClick={load}>Refresh ↻</button></div><div className="lead-stats"><div><strong>{leadCounts.New}</strong><span>New</span></div><div><strong>{leadCounts.Contacted}</strong><span>Contacted</span></div><div><strong>{leadCounts.Closed}</strong><span>Closed</span></div></div><div className="lead-toolbar"><label>Search enquiries<input value={leadQuery} onChange={e=>setLeadQuery(e.target.value)} placeholder="Name, phone or property…" /></label><label>Filter status<select value={leadFilter} onChange={e=>setLeadFilter(e.target.value)}><option>All</option><option>New</option><option>Contacted</option><option>Closed</option></select></label></div>{enquiries.length===0?<p className="muted">No saved enquiries yet. Enquiry tracking appears here after MongoDB is configured.</p>:filteredEnquiries.length===0?<p className="muted">No enquiries match this search and status filter.</p>:filteredEnquiries.map(item=><article className="admin-item" key={item.id}><div><strong>{item.name} · {item.subject}</strong><small>{item.phone} · {item.createdAt?new Date(item.createdAt).toLocaleString("en-IN"):"Date unavailable"} {item.note? " · "+item.note:""}</small></div><select aria-label={"Enquiry status for "+item.name} value={item.status||"New"} onChange={e=>setLeadStatus(item.id,e.target.value)}><option>New</option><option>Contacted</option><option>Closed</option></select></article>)}</section></div></main>;
}
