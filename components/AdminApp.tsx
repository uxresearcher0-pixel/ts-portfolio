"use client";

import Image from "next/image";
import Link from "next/link";
import { FormEvent, useEffect, useId, useMemo, useRef, useState } from "react";
import type { PortfolioContent } from "@/lib/content";

type Props = { initialAuthenticated: boolean; initialContent: PortfolioContent | null };
type Section = "dashboard" | "profile" | "about" | "projects" | "experience" | "skills" | "education" | "media" | "links" | "settings";
const nav: { id: Section; label: string; icon: string }[] = [
  { id: "dashboard", label: "Dashboard", icon: "▦" },
  { id: "profile", label: "Profile & hero", icon: "◉" },
  { id: "about", label: "About", icon: "¶" },
  { id: "projects", label: "Case studies", icon: "◆" },
  { id: "experience", label: "Experience", icon: "▣" },
  { id: "skills", label: "Skills", icon: "✦" },
  { id: "education", label: "Education", icon: "◇" },
  { id: "media", label: "Media", icon: "▧" },
  { id: "links", label: "Links & contact", icon: "↗" },
  { id: "settings", label: "SEO & settings", icon: "⚙" }
];

export function AdminApp({ initialAuthenticated, initialContent }: Props) {
  const [authenticated, setAuthenticated] = useState(initialAuthenticated);
  const [content, setContent] = useState(initialContent);
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);
  const [section, setSection] = useState<Section>("dashboard");
  const [dirty, setDirty] = useState(false);
  const [mobileNav, setMobileNav] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const warn = (event: BeforeUnloadEvent) => { if (dirty) event.preventDefault(); };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  const completeness = useMemo(() => {
    if (!content) return 0;
    const checks = [content.name, content.title, content.introduction, content.aboutTitle, content.linkedinUrl, content.projects.length, content.skills.length, content.profileImage, content.portfolioUrl || content.projects.some(project=>project.url), content.email || content.linkedinUrl];
    return Math.round((checks.filter(Boolean).length / checks.length) * 100);
  }, [content]);

  async function login(event: FormEvent) {
    event.preventDefault(); setBusy(true); setStatus("");
    const response = await fetch("/api/auth/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ password }) });
    const data = await response.json();
    if (!response.ok) { setStatus(data.error || "Unable to sign in."); setBusy(false); return; }
    const contentResponse = await fetch("/api/content");
    setContent(await contentResponse.json()); setAuthenticated(true); setPassword(""); setBusy(false);
  }
  async function save() {
    if (!content) return; setBusy(true); setStatus("Publishing changes…");
    const response = await fetch("/api/content", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(content) });
    const data = await response.json();
    if (response.ok) { setContent(data); setDirty(false); setStatus("Changes published successfully."); } else setStatus(data.error || "Unable to publish.");
    setBusy(false);
  }
  async function logout() { if (dirty && !window.confirm("Discard unpublished changes and sign out?")) return; await fetch("/api/auth/logout", { method: "POST" }); setAuthenticated(false); setContent(null); }
  const set = (key: keyof PortfolioContent, value: unknown) => { setContent(current => current ? ({ ...current, [key]: value }) : current); setDirty(true); };
  const choose = (id: Section) => { setSection(id); setMobileNav(false); window.scrollTo({ top: 0, behavior: "smooth" }); };

  async function addImage(file?: File) {
    if (!file) return;
    if (!file.type.match(/^image\/(jpeg|png|webp)$/)) { setStatus("Choose a JPG, PNG, or WebP image."); return; }
    if (file.size > 2 * 1024 * 1024) { setStatus("Image must be smaller than 2 MB."); return; }
    const reader = new FileReader();
    reader.onload = () => { set("profileImage", String(reader.result)); setStatus("Image added. Publish to make it live."); };
    reader.readAsDataURL(file);
  }

  if (!authenticated || !content) return <main className="admin-shell login-shell"><section className="login-card" aria-labelledby="login-title"><Link className="wordmark" href="/"><span className="wordmark-mark">tr</span><span>Taslima Rumky</span></Link><p className="eyebrow">Portfolio CMS</p><h1 id="login-title">Admin sign in</h1><p>Manage portfolio content, media, and publishing.</p><form onSubmit={login}><label htmlFor="password">Admin password</label><input id="password" type="password" autoComplete="current-password" required value={password} onChange={e => setPassword(e.target.value)}/><button className="button" disabled={busy}>{busy ? "Signing in…" : "Sign in"}</button></form>{status && <p className="form-status" role="alert">{status}</p>}<Link href="/">← Return to portfolio</Link></section></main>;

  const currentLabel = nav.find(item => item.id === section)?.label;
  return <main className="cms-shell">
    <aside className={`cms-sidebar ${mobileNav ? "is-open" : ""}`} aria-label="CMS navigation">
      <div className="cms-brand"><span className="wordmark-mark">tr</span><div><strong>Taslima Rumky</strong><small>Portfolio CMS</small></div></div>
      <nav>{nav.map(item => <button key={item.id} type="button" className={section === item.id ? "active" : ""} aria-current={section === item.id ? "page" : undefined} onClick={() => choose(item.id)}><span aria-hidden="true">{item.icon}</span>{item.label}</button>)}</nav>
      <div className="sidebar-footer"><div className="publish-state"><span className={dirty ? "status-dot warning" : "status-dot"}/><div><strong>{dirty ? "Unpublished changes" : "Up to date"}</strong><small>{content.updatedAt ? `Saved ${new Date(content.updatedAt).toLocaleString()}` : "Ready to publish"}</small></div></div><button className="sidebar-signout" onClick={logout}>Sign out</button></div>
    </aside>
    {mobileNav ? <button className="sidebar-scrim" aria-label="Close navigation" onClick={() => setMobileNav(false)}/> : null}
    <section className="cms-main">
      <header className="cms-topbar"><div className="mobile-title"><button className="cms-menu" aria-label="Open CMS navigation" onClick={() => setMobileNav(true)}>☰</button><div><small>Portfolio CMS</small><strong>{currentLabel}</strong></div></div><div className="cms-actions"><Link className="preview-button" href="/" target="_blank">Preview site ↗</Link><button className="publish-button" onClick={save} disabled={busy || !dirty}>{busy ? "Publishing…" : dirty ? "Publish changes" : "Published"}</button></div></header>
      <div className="cms-content">
        {status ? <div className="cms-notice" role="status"><span>{status}</span><button aria-label="Dismiss message" onClick={() => setStatus("")}>×</button></div> : null}
        {section === "dashboard" && <Dashboard content={content} completeness={completeness} go={choose}/>}
        {section === "profile" && <Panel title="Profile & hero" description="Control the first impression and professional summary."><div className="control-grid"><Field label="Full name" value={content.name} onChange={v=>set("name",v)}/><Field label="Display name" value={content.shortName} onChange={v=>set("shortName",v)}/><Field label="Professional title" value={content.title} onChange={v=>set("title",v)}/><Field label="Location" value={content.location} onChange={v=>set("location",v)}/><Field label="Hero heading" value={content.heroTitle} onChange={v=>set("heroTitle",v)}/><Field label="Accent line" value={content.heroAccent} onChange={v=>set("heroAccent",v)}/><Field label="Introduction" value={content.introduction} onChange={v=>set("introduction",v)} area/><Field label="Focus" value={content.focus} onChange={v=>set("focus",v)}/><Field label="Approach" value={content.approach} onChange={v=>set("approach",v)}/><div className="field field-wide"><Toggle label="Show availability badge" checked={content.showAvailability} onChange={v=>set("showAvailability",v)}/>{content.showAvailability ? <Field label="Availability message" value={content.availability} onChange={v=>set("availability",v)}/> : null}</div></div></Panel>}
        {section === "about" && <Panel title="About" description="Shape the professional narrative shown below the hero."><div className="control-grid"><Field label="Section heading" value={content.aboutTitle} onChange={v=>set("aboutTitle",v)}/>{content.about.map((value,index)=><div className="field field-wide" key={index}><Field label={`Paragraph ${index+1}`} value={value} area onChange={v=>set("about",content.about.map((p,i)=>i===index?v:p))}/>{content.about.length > 1 ? <button className="inline-remove" onClick={()=>set("about",content.about.filter((_,i)=>i!==index))}>Remove paragraph</button> : null}</div>)}<button className="add-control" onClick={()=>set("about",[...content.about,""])}>+ Add paragraph</button></div></Panel>}
        {section === "projects" && <Panel title="Featured case studies" description="Manage Rumky’s portfolio projects, external Figma links, visibility, and display order."><Repeater items={content.projects} onAdd={()=>set("projects",[...content.projects,{id:crypto.randomUUID(),title:"",category:"",summary:"",url:"",featured:true}])} addLabel="Add case study" onRemove={i=>set("projects",content.projects.filter((_,x)=>x!==i))} onMove={(i,d)=>set("projects",move(content.projects,i,d))}>{(item,index)=><div className="control-grid"><Field label="Project title" value={item.title} onChange={v=>set("projects",content.projects.map((x,i)=>i===index?{...x,title:v}:x))}/><Field label="Category" value={item.category} onChange={v=>set("projects",content.projects.map((x,i)=>i===index?{...x,category:v}:x))}/><Field label="Case study URL" value={item.url} type="url" onChange={v=>set("projects",content.projects.map((x,i)=>i===index?{...x,url:v}:x))}/><div className="field"><Toggle label="Show on portfolio" checked={item.featured} onChange={v=>set("projects",content.projects.map((x,i)=>i===index?{...x,featured:v}:x))}/></div><Field label="Short summary" value={item.summary} area onChange={v=>set("projects",content.projects.map((x,i)=>i===index?{...x,summary:v}:x))}/></div>}</Repeater></Panel>}
        {section === "experience" && <Panel title="Experience" description="Add roles, outcomes, and supporting skills. Use arrows to control display order."><Repeater items={content.experiences} onAdd={()=>set("experiences",[...content.experiences,{id:crypto.randomUUID(),period:"",company:"",role:"",summary:"",skills:[]}])} addLabel="Add experience" onRemove={i=>set("experiences",content.experiences.filter((_,x)=>x!==i))} onMove={(i,d)=>set("experiences",move(content.experiences,i,d))}>{(item,index)=><div className="control-grid"><Field label="Period" value={item.period} onChange={v=>set("experiences",content.experiences.map((x,i)=>i===index?{...x,period:v}:x))}/><Field label="Company" value={item.company} onChange={v=>set("experiences",content.experiences.map((x,i)=>i===index?{...x,company:v}:x))}/><Field label="Role" value={item.role} onChange={v=>set("experiences",content.experiences.map((x,i)=>i===index?{...x,role:v}:x))}/><Field label="Skills (comma separated)" value={item.skills.join(", ")} onChange={v=>set("experiences",content.experiences.map((x,i)=>i===index?{...x,skills:v.split(",").map(s=>s.trim()).filter(Boolean)}:x))}/><Field label="Summary" value={item.summary} area onChange={v=>set("experiences",content.experiences.map((x,i)=>i===index?{...x,summary:v}:x))}/></div>}</Repeater></Panel>}
        {section === "skills" && <Panel title="Skills & tools" description="Create focused capability groups instead of percentage scores."><Repeater items={content.skills} onAdd={()=>set("skills",[...content.skills,{id:crypto.randomUUID(),title:"",description:""}])} addLabel="Add skill group" onRemove={i=>set("skills",content.skills.filter((_,x)=>x!==i))} onMove={(i,d)=>set("skills",move(content.skills,i,d))}>{(item,index)=><div className="control-grid"><Field label="Group title" value={item.title} onChange={v=>set("skills",content.skills.map((x,i)=>i===index?{...x,title:v}:x))}/><Field label="Description" value={item.description} area onChange={v=>set("skills",content.skills.map((x,i)=>i===index?{...x,description:v}:x))}/></div>}</Repeater></Panel>}
        {section === "education" && <Panel title="Education" description="Manage qualifications and professional learning."><Repeater items={content.education} onAdd={()=>set("education",[...content.education,{id:crypto.randomUUID(),year:"",qualification:"",institution:"",detail:""}])} addLabel="Add education" onRemove={i=>set("education",content.education.filter((_,x)=>x!==i))} onMove={(i,d)=>set("education",move(content.education,i,d))}>{(item,index)=><div className="control-grid"><Field label="Year" value={item.year} onChange={v=>set("education",content.education.map((x,i)=>i===index?{...x,year:v}:x))}/><Field label="Qualification" value={item.qualification} onChange={v=>set("education",content.education.map((x,i)=>i===index?{...x,qualification:v}:x))}/><Field label="Institution" value={item.institution} onChange={v=>set("education",content.education.map((x,i)=>i===index?{...x,institution:v}:x))}/><Field label="Specialization or detail" value={item.detail} onChange={v=>set("education",content.education.map((x,i)=>i===index?{...x,detail:v}:x))}/></div>}</Repeater></Panel>}
        {section === "media" && <Panel title="Media library" description="Upload and manage the portrait used in the public hero. Images are stored securely with CMS content."><div className="media-manager"><div className="media-preview">{content.profileImage ? <Image src={content.profileImage} alt={content.profileImageAlt || "Profile image preview"} fill sizes="320px" unoptimized /> : <div><span aria-hidden="true">▧</span><strong>No portrait uploaded</strong><small>JPG, PNG or WebP · maximum 2 MB</small></div>}</div><div className="media-controls"><input ref={fileRef} className="sr-only" type="file" accept="image/jpeg,image/png,image/webp" onChange={e=>addImage(e.target.files?.[0])}/><button className="upload-button" onClick={()=>fileRef.current?.click()}>{content.profileImage ? "Replace image" : "Upload image"}</button>{content.profileImage ? <button className="remove-button" onClick={()=>set("profileImage","")}>Remove image</button> : null}<Field label="Alternative text" value={content.profileImageAlt} onChange={v=>set("profileImageAlt",v)}/><p className="helper">Describe the image for people who use screen readers. Avoid phrases like “image of”.</p></div></div></Panel>}
        {section === "links" && <Panel title="Links & contact" description="Manage external profiles, résumé access, and the preferred contact channel."><div className="control-grid"><Field label="Email" value={content.email} type="email" onChange={v=>set("email",v)}/><Field label="Figma portfolio URL" value={content.portfolioUrl} type="url" onChange={v=>set("portfolioUrl",v)}/><Field label="Résumé PDF URL" value={content.resumeUrl} type="url" onChange={v=>set("resumeUrl",v)}/><Field label="LinkedIn URL" value={content.linkedinUrl} type="url" onChange={v=>set("linkedinUrl",v)}/><Field label="Dribbble URL" value={content.dribbbleUrl} type="url" onChange={v=>set("dribbbleUrl",v)}/><Field label="Behance URL" value={content.behanceUrl} type="url" onChange={v=>set("behanceUrl",v)}/></div></Panel>}
        {section === "settings" && <Panel title="SEO & appearance" description="Control search-preview content and the portfolio accent color."><div className="control-grid"><Field label="SEO title" value={content.seoTitle} onChange={v=>set("seoTitle",v)}/><Field label="SEO description" value={content.seoDescription} area onChange={v=>set("seoDescription",v)}/><div className="field"><label htmlFor="accent-color">Accent color</label><div className="color-control"><input id="accent-color" type="color" value={content.accentColor} onChange={e=>set("accentColor",e.target.value)}/><input aria-label="Accent color hexadecimal value" value={content.accentColor} pattern="#[0-9A-Fa-f]{6}" onChange={e=>set("accentColor",e.target.value)}/></div></div><div className="settings-note"><strong>Publishing model</strong><p>Changes remain private until you select Publish changes. The public site reads the latest published MongoDB content.</p></div></div></Panel>}
      </div>
    </section>
  </main>;
}

function Dashboard({content,completeness,go}:{content:PortfolioContent;completeness:number;go:(id:Section)=>void}) { const missing=[!content.profileImage&&"Profile image",!content.projects.some(project=>project.url)&&"More case-study links",!content.resumeUrl&&"Résumé link",!content.email&&"Contact email",!content.experiences.length&&"Verified experience",!content.education.length&&"Verified education"].filter(Boolean); return <><div className="dashboard-heading"><div><p className="eyebrow">Overview</p><h1>Welcome back, {content.shortName.split(" ")[0]}.</h1><p>Manage the content and presentation of your portfolio.</p></div><div className="completion-ring" style={{"--progress":`${completeness * 3.6}deg`} as React.CSSProperties}><strong>{completeness}%</strong><span>complete</span></div></div><div className="metric-grid"><Metric label="Case studies" value={content.projects.filter(project=>project.featured).length} note="featured projects"/><Metric label="Skill groups" value={content.skills.length} note="capability areas"/><Metric label="Linked projects" value={content.projects.filter(project=>project.url).length} note="available case studies"/><Metric label="Last update" value={content.updatedAt?new Date(content.updatedAt).toLocaleDateString():"—"} note="published content"/></div><div className="dashboard-grid"><section className="dashboard-card"><div className="card-heading"><div><h2>Content checklist</h2><p>Complete these items as Rumky’s verified information becomes available.</p></div><span className={missing.length?"pill warning":"pill"}>{missing.length?`${missing.length} remaining`:"Complete"}</span></div>{missing.length?<ul className="checklist">{missing.map(item=><li key={String(item)}><span aria-hidden="true">○</span>{item}</li>)}</ul>:<div className="empty-success">✓ Core portfolio content is ready.</div>}</section><section className="dashboard-card"><h2>Quick actions</h2><div className="quick-actions"><button onClick={()=>go("projects")}>◆ Manage case studies <span>→</span></button><button onClick={()=>go("media")}>▧ Add profile image <span>→</span></button><button onClick={()=>go("links")}>↗ Add portfolio links <span>→</span></button><Link href="/" target="_blank">◉ Preview live site <span>↗</span></Link></div></section></div></>; }
function Metric({label,value,note}:{label:string;value:string|number;note:string}) { return <article className="metric"><span>{label}</span><strong>{value}</strong><small>{note}</small></article>; }
function Panel({title,description,children}:{title:string;description:string;children:React.ReactNode}) { return <section className="cms-panel"><header><div><h1>{title}</h1><p>{description}</p></div></header><div className="panel-body">{children}</div></section>; }
function Field({label,value,onChange,area=false,type="text"}:{label:string;value:string;onChange:(value:string)=>void;area?:boolean;type?:string}) { const id=useId(); return <div className={area?"field field-wide":"field"}><label htmlFor={id}>{label}</label>{area?<textarea id={id} rows={5} value={value} onChange={e=>onChange(e.target.value)}/>:<input id={id} type={type} value={value} onChange={e=>onChange(e.target.value)}/>}</div>; }
function Toggle({label,checked,onChange}:{label:string;checked:boolean;onChange:(value:boolean)=>void}) { return <label className="toggle-row"><span>{label}</span><input type="checkbox" checked={checked} onChange={e=>onChange(e.target.checked)}/><i aria-hidden="true"/></label>; }
function Repeater<T extends {id:string}>({items,onAdd,addLabel,onRemove,onMove,children}:{items:T[];onAdd:()=>void;addLabel:string;onRemove:(i:number)=>void;onMove:(i:number,d:number)=>void;children:(item:T,index:number)=>React.ReactNode}) { return <div className="repeater">{items.map((item,index)=><article className="repeater-card" key={item.id}><header><div><span>Item {index+1}</span><strong>{"role" in item ? String(item.role||"Untitled role") : "title" in item ? String(item.title||"Untitled group") : "qualification" in item ? String(item.qualification||"Untitled education") : "Item"}</strong></div><div className="item-actions"><button title="Move up" disabled={index===0} onClick={()=>onMove(index,-1)}>↑</button><button title="Move down" disabled={index===items.length-1} onClick={()=>onMove(index,1)}>↓</button><button className="remove-button" onClick={()=>onRemove(index)}>Remove</button></div></header>{children(item,index)}</article>)}<button className="add-control" onClick={onAdd}>+ {addLabel}</button></div>; }
function move<T>(items:T[],index:number,direction:number){const next=[...items];const target=index+direction;if(target<0||target>=next.length)return next;[next[index],next[target]]=[next[target],next[index]];return next;}
