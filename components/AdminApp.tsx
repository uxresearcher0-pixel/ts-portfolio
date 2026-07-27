"use client";

import Link from "next/link";
import { FormEvent, useId, useState } from "react";
import type { PortfolioContent } from "@/lib/content";

type Props = { initialAuthenticated: boolean; initialContent: PortfolioContent | null };

export function AdminApp({ initialAuthenticated, initialContent }: Props) {
  const [authenticated, setAuthenticated] = useState(initialAuthenticated);
  const [content, setContent] = useState(initialContent);
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);

  async function login(event: FormEvent) {
    event.preventDefault(); setBusy(true); setStatus("");
    const response = await fetch("/api/auth/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ password }) });
    const data = await response.json();
    if (!response.ok) { setStatus(data.error || "Unable to sign in."); setBusy(false); return; }
    const contentResponse = await fetch("/api/content");
    setContent(await contentResponse.json()); setAuthenticated(true); setPassword(""); setBusy(false);
  }
  async function save(event: FormEvent) {
    event.preventDefault(); if (!content) return; setBusy(true); setStatus("Saving…");
    const response = await fetch("/api/content", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(content) });
    const data = await response.json();
    if (response.ok) { setContent(data); setStatus("Saved and published successfully."); } else setStatus(data.error || "Unable to save.");
    setBusy(false);
  }
  async function logout() { await fetch("/api/auth/logout", { method: "POST" }); setAuthenticated(false); setContent(null); }
  const set = (key: keyof PortfolioContent, value: unknown) => setContent(current => current ? ({ ...current, [key]: value }) : current);

  if (!authenticated || !content) return <main className="admin-shell login-shell"><section className="login-card" aria-labelledby="login-title"><Link className="wordmark" href="/"><span className="wordmark-mark">tr</span><span>Taslima Rumky</span></Link><p className="eyebrow">Portfolio CMS</p><h1 id="login-title">Admin sign in</h1><p>Use the private administrator password configured in Vercel.</p><form onSubmit={login}><label htmlFor="password">Admin password</label><input id="password" type="password" autoComplete="current-password" required value={password} onChange={e => setPassword(e.target.value)}/><button className="button" disabled={busy}>{busy ? "Signing in…" : "Sign in"}</button></form>{status && <p className="form-status" role="alert">{status}</p>}<Link href="/">← Return to portfolio</Link></section></main>;

  return <main className="admin-shell"><header className="admin-header"><div><p className="eyebrow">Portfolio CMS</p><h1>Content editor</h1><p>Update verified information, then save to publish it.</p></div><div className="admin-actions"><Link className="button button-secondary" href="/" target="_blank">View site ↗</Link><button className="text-button" onClick={logout}>Sign out</button></div></header>
    <form className="editor" onSubmit={save}>
      <EditorSection title="Profile and hero"><Field label="Full name" value={content.name} onChange={v=>set("name",v)}/><Field label="Display name" value={content.shortName} onChange={v=>set("shortName",v)}/><Field label="Professional title" value={content.title} onChange={v=>set("title",v)}/><Field label="Availability" value={content.availability} onChange={v=>set("availability",v)}/><Field label="Location" value={content.location} onChange={v=>set("location",v)}/><Field label="Hero heading" value={content.heroTitle} onChange={v=>set("heroTitle",v)}/><Field label="Hero accent line" value={content.heroAccent} onChange={v=>set("heroAccent",v)}/><Field label="Introduction" value={content.introduction} onChange={v=>set("introduction",v)} area/><Field label="Focus" value={content.focus} onChange={v=>set("focus",v)}/><Field label="Approach" value={content.approach} onChange={v=>set("approach",v)}/></EditorSection>
      <EditorSection title="About"><Field label="Section heading" value={content.aboutTitle} onChange={v=>set("aboutTitle",v)}/>{content.about.map((value,index)=><Field key={index} label={`Paragraph ${index+1}`} value={value} area onChange={v=>set("about",content.about.map((p,i)=>i===index?v:p))}/>)}</EditorSection>
      <EditorSection title="Contact and links"><Field label="Email" value={content.email} type="email" onChange={v=>set("email",v)}/><Field label="Figma portfolio URL" value={content.portfolioUrl} type="url" onChange={v=>set("portfolioUrl",v)}/><Field label="Résumé PDF URL" value={content.resumeUrl} type="url" onChange={v=>set("resumeUrl",v)}/><Field label="LinkedIn URL" value={content.linkedinUrl} type="url" onChange={v=>set("linkedinUrl",v)}/><Field label="Dribbble URL" value={content.dribbbleUrl} type="url" onChange={v=>set("dribbbleUrl",v)}/><Field label="Behance URL" value={content.behanceUrl} type="url" onChange={v=>set("behanceUrl",v)}/></EditorSection>
      <EditorSection title="Experience">{content.experiences.map((item,index)=><div className="repeat-card" key={item.id}><Field label="Period" value={item.period} onChange={v=>set("experiences",content.experiences.map((x,i)=>i===index?{...x,period:v}:x))}/><Field label="Company" value={item.company} onChange={v=>set("experiences",content.experiences.map((x,i)=>i===index?{...x,company:v}:x))}/><Field label="Role" value={item.role} onChange={v=>set("experiences",content.experiences.map((x,i)=>i===index?{...x,role:v}:x))}/><Field label="Summary" value={item.summary} area onChange={v=>set("experiences",content.experiences.map((x,i)=>i===index?{...x,summary:v}:x))}/><Field label="Skills (comma separated)" value={item.skills.join(", ")} onChange={v=>set("experiences",content.experiences.map((x,i)=>i===index?{...x,skills:v.split(",").map(s=>s.trim()).filter(Boolean)}:x))}/><button type="button" className="danger-button" onClick={()=>set("experiences",content.experiences.filter((_,i)=>i!==index))}>Remove experience</button></div>)}<button type="button" className="add-button" onClick={()=>set("experiences",[...content.experiences,{id:crypto.randomUUID(),period:"",company:"",role:"",summary:"",skills:[]}])}>+ Add experience</button></EditorSection>
      <EditorSection title="Skills">{content.skills.map((item,index)=><div className="repeat-card compact" key={item.id}><Field label="Group" value={item.title} onChange={v=>set("skills",content.skills.map((x,i)=>i===index?{...x,title:v}:x))}/><Field label="Description" value={item.description} area onChange={v=>set("skills",content.skills.map((x,i)=>i===index?{...x,description:v}:x))}/><button type="button" className="danger-button" onClick={()=>set("skills",content.skills.filter((_,i)=>i!==index))}>Remove skill group</button></div>)}<button type="button" className="add-button" onClick={()=>set("skills",[...content.skills,{id:crypto.randomUUID(),title:"",description:""}])}>+ Add skill group</button></EditorSection>
      <EditorSection title="Education">{content.education.map((item,index)=><div className="repeat-card" key={item.id}><Field label="Year" value={item.year} onChange={v=>set("education",content.education.map((x,i)=>i===index?{...x,year:v}:x))}/><Field label="Qualification" value={item.qualification} onChange={v=>set("education",content.education.map((x,i)=>i===index?{...x,qualification:v}:x))}/><Field label="Institution" value={item.institution} onChange={v=>set("education",content.education.map((x,i)=>i===index?{...x,institution:v}:x))}/><Field label="Specialization or detail" value={item.detail} onChange={v=>set("education",content.education.map((x,i)=>i===index?{...x,detail:v}:x))}/><button type="button" className="danger-button" onClick={()=>set("education",content.education.filter((_,i)=>i!==index))}>Remove education</button></div>)}<button type="button" className="add-button" onClick={()=>set("education",[...content.education,{id:crypto.randomUUID(),year:"",qualification:"",institution:"",detail:""}])}>+ Add education</button></EditorSection>
      <div className="save-bar"><p role="status">{status}</p><button className="button" disabled={busy}>{busy ? "Saving…" : "Save and publish"}</button></div>
    </form>
  </main>;
}

function EditorSection({title,children}:{title:string;children:React.ReactNode}) { return <section className="editor-section"><h2>{title}</h2><div className="field-grid">{children}</div></section>; }
function Field({label,value,onChange,area=false,type="text"}:{label:string;value:string;onChange:(value:string)=>void;area?:boolean;type?:string}) { const id=useId(); return <div className={area?"field field-wide":"field"}><label htmlFor={id}>{label}</label>{area?<textarea id={id} rows={4} value={value} onChange={e=>onChange(e.target.value)}/>:<input id={id} type={type} value={value} onChange={e=>onChange(e.target.value)}/>}</div>; }
