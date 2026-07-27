"use client";

import { FormEvent, useEffect, useState } from "react";
import Image from "next/image";
import type { PortfolioContent } from "@/lib/content";

function ExternalLink({ href, children, className = "" }: { href: string; children: React.ReactNode; className?: string }) {
  if (!href) return <span className={`disabled-link ${className}`} aria-disabled="true">{children}</span>;
  return <a className={className} href={href} target="_blank" rel="noreferrer">{children}</a>;
}

function RichContent({ value, className = "" }: { value: string; className?: string }) {
  return <div className={`rich-text ${className}`} dangerouslySetInnerHTML={{ __html: value }} />;
}

function OptionalProjectImage({ project, media }: { project: PortfolioContent["projects"][number]; media: PortfolioContent["media"] }) {
  const asset = media.find(item => item.id === project.imageId);
  if (!asset) return null;
  return <div className="project-image"><Image src={asset.dataUrl} alt={asset.alt} width={720} height={480} unoptimized /></div>;
}

function formatMonth(value: string) {
  if (!/^\d{4}-\d{2}$/.test(value)) return value;
  return new Intl.DateTimeFormat("en", { month: "short", year: "numeric", timeZone: "UTC" }).format(new Date(`${value}-01T00:00:00Z`));
}

function dateRange(start: string, end: string, current = false, fallback = "") {
  if (!start && !end) return fallback;
  return [formatMonth(start), current ? "Present" : formatMonth(end)].filter(Boolean).join(" — ");
}

export function Portfolio({ content }: { content: PortfolioContent }) {
  const [open, setOpen] = useState(false);
  const [requestForm, setRequestForm] = useState({ name: "", email: "", project: "Full portfolio", message: "I’d like to request access to the full portfolio and additional case studies.", website: "" });
  const [requestStatus, setRequestStatus] = useState("");
  const [requestBusy, setRequestBusy] = useState(false);
  useEffect(() => {
    const close = (event: KeyboardEvent) => event.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", close);
    return () => document.removeEventListener("keydown", close);
  }, []);
  const links = content.links || [];
  const findLink = (kind: string) => links.find(link => link.kind === kind)?.url || "";
  const portfolioUrl = findLink("Portfolio") || content.portfolioUrl;
  const resumeUrl = findLink("Résumé") || content.resumeUrl;
  const email = findLink("Email") || content.email;
  const linkHref = (kind: string, url: string) => kind === "Email" ? `mailto:${url}` : url;
  async function sendRequest(event: FormEvent) {
    event.preventDefault(); setRequestBusy(true); setRequestStatus("");
    const response = await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(requestForm) });
    const data = await response.json();
    if (response.ok) { setRequestStatus("Your request was sent successfully."); setRequestForm(current=>({...current,name:"",email:"",message:"I’d like to request access to the full portfolio and additional case studies."})); }
    else setRequestStatus(data.error || "Unable to send your request.");
    setRequestBusy(false);
  }
  const initials = content.name.split(" ").map((part) => part[0]).slice(0, 2).join("").toLowerCase();
  return <div style={{ "--accent": content.accentColor, "--accent-dark": content.accentColor } as React.CSSProperties}>
    <a className="skip-link" href="#main-content">Skip to main content</a>
    <header className="site-header">
      <div className="container header-inner">
        <a className="wordmark" href="#home" aria-label={`${content.name}, home`}><span className="wordmark-mark" aria-hidden="true">{initials}</span><span>{content.shortName}</span></a>
        <button className="menu-button" type="button" aria-expanded={open} aria-controls="primary-navigation" onClick={() => setOpen(!open)}><span className="sr-only">{open ? "Close" : "Open"} navigation</span><span/><span/><span/></button>
        <nav id="primary-navigation" className={`primary-nav ${open ? "is-open" : ""}`} aria-label="Primary navigation">
          {[["About", "about"], ["Work", "work"], ...(content.experiences.length ? [["Experience", "experience"]] : []), ["Skills", "skills"], ...(content.education.length ? [["Education", "education"]] : []), ["Contact", "contact"]].map(([label,id]) => <a key={id} href={`#${id}`} onClick={() => setOpen(false)}>{label}</a>)}
          {resumeUrl ? <a className="button button-small" href={resumeUrl} target="_blank" rel="noreferrer">Download résumé</a> : null}
        </nav>
      </div>
    </header>
    <main id="main-content">
      <section id="home" className="hero" aria-labelledby="hero-title"><div className="container hero-grid"><div>
        {content.showAvailability ? <p className="availability"><span aria-hidden="true"/>{content.availability}</p> : null}<p className="eyebrow">{content.title}</p>
        <h1 id="hero-title">{content.heroTitle} <span>{content.heroAccent}</span></h1>
        <div className="hero-copy"><p>Hi, I’m <strong>{content.name}</strong>.</p><RichContent value={content.introduction}/></div>
        <div className="hero-actions">{portfolioUrl ? <ExternalLink className="button" href={portfolioUrl}>View portfolio <span aria-hidden="true">↗</span></ExternalLink> : <a className="button" href="#work">View selected work <span aria-hidden="true">↓</span></a>}<a className="button button-secondary" href="#contact">Let’s connect</a></div>
        <ul className="social-list" aria-label="Professional profiles">{links.filter(link=>link.showInHero&&link.url).map(link => <li key={link.id}><ExternalLink href={linkHref(link.kind,link.url)}>{link.label} <span aria-hidden="true">↗</span></ExternalLink></li>)}</ul>
      </div><aside className="hero-card" aria-label="Professional summary">{content.profileImage ? <div className="profile-image-wrap"><Image src={content.profileImage} alt={content.profileImageAlt} width={520} height={520} unoptimized /></div> : null}<p className="hero-card-label">At a glance</p><dl><div><dt>Focus</dt><dd>{content.focus}</dd></div><div><dt>Approach</dt><dd>{content.approach}</dd></div><div><dt>Based in</dt><dd>{content.location}</dd></div></dl><div className="visual-note" aria-hidden="true"><span>Research</span><span>Design</span><span>Validate</span></div></aside></div></section>
      <section id="about" className="section section-tinted" aria-labelledby="about-title"><div className="container split-heading"><div><p className="eyebrow">About me</p><h2 id="about-title">{content.aboutTitle}</h2></div><div className="prose">{content.about.map((paragraph,index) => <RichContent value={paragraph} key={index}/>)}</div></div></section>
      <section id="work" className="section work-section" aria-labelledby="work-title"><div className="container"><div className="section-heading"><div><p className="eyebrow">Featured case studies</p><h2 id="work-title">Selected product work</h2></div><p>Projects spanning enterprise, public-service, healthcare, consumer, web, and design-system experiences.</p></div><div className="project-grid">{content.projects.filter(project=>project.featured).slice(0,content.projectDisplayLimit).map((project,index)=><article className="project-card" key={project.id}><OptionalProjectImage project={project} media={content.media}/><div className="project-number" aria-hidden="true">{String(index+1).padStart(2,"0")}</div><p className="project-category">{project.category}</p><h3>{project.title}</h3><RichContent value={project.summary}/>{project.url?<a href={project.url} target="_blank" rel="noreferrer">View case study <span aria-hidden="true">↗</span></a>:<span className="project-status">Case study preview coming soon</span>}</article>)}</div><div className="work-request"><div><strong>Want to see the complete portfolio?</strong><p>Request access to additional case studies and detailed project files.</p></div><a className="button button-secondary" href="#contact">Request full portfolio <span aria-hidden="true">→</span></a></div></div></section>
      {content.experiences.length ? <section id="experience" className="section" aria-labelledby="experience-title"><div className="container"><div className="section-heading"><div><p className="eyebrow">Career journey</p><h2 id="experience-title">Experience</h2></div></div><div className="timeline">{content.experiences.map((item) => <article className="timeline-item" key={item.id}><div className="timeline-meta"><p>{dateRange(item.startDate,item.endDate,item.current,item.period)}</p><p>{item.company}</p>{[item.employmentType,item.workplaceType,item.location].filter(Boolean).length?<small>{[item.employmentType,item.workplaceType,item.location].filter(Boolean).join(" · ")}</small>:null}</div><div><h3>{item.role}</h3><RichContent value={item.summary}/><ul className="tag-list" aria-label="Skills used">{item.skills.map(skill => <li key={skill}>{skill}</li>)}</ul></div></article>)}</div></div></section> : null}
      <section id="skills" className="section section-dark" aria-labelledby="skills-title"><div className="container"><div className="section-heading section-heading-light"><div><p className="eyebrow">What I bring</p><h2 id="skills-title">Skills &amp; tools</h2></div><p>A practical toolkit for moving from ambiguity to a usable product.</p></div><div className="skill-grid">{content.skills.map((item,index) => <article key={item.id}><span className="skill-number" aria-hidden="true">{String(index + 1).padStart(2,"0")}</span><h3>{item.title}</h3><RichContent value={item.description}/></article>)}</div></div></section>
      {portfolioUrl ? <section className="section portfolio-callout" aria-labelledby="portfolio-title"><div className="container callout-card"><div><p className="eyebrow">Selected work</p><h2 id="portfolio-title">See the full design portfolio in Figma.</h2><p>Explore detailed projects, process work, and interface design in one curated portfolio file.</p></div><ExternalLink className="button button-light" href={portfolioUrl}>Open Figma portfolio <span aria-hidden="true">↗</span></ExternalLink></div></section> : null}
      {content.education.length ? <section id="education" className="section section-tinted" aria-labelledby="education-title"><div className="container"><div className="section-heading"><div><p className="eyebrow">Background</p><h2 id="education-title">Education</h2></div></div><div className="education-grid">{content.education.map(item => <article key={item.id}><p className="education-year">{dateRange(item.startDate,item.endDate,false,item.year)}</p><h3>{item.qualification}</h3><p>{item.institution}</p><RichContent value={item.detail}/></article>)}</div></div></section> : null}
      <section id="contact" className="section contact-section" aria-labelledby="contact-title"><div className="container contact-grid"><div><p className="eyebrow">Let’s connect</p><h2 id="contact-title">Interested in Rumky’s work?</h2><p>Request access to the complete portfolio or ask about a specific case study.</p></div><div className="contact-actions">{email ? <><a className="email-link" href={`mailto:${email}`}>{email} <span aria-hidden="true">↗</span></a><p>Email is the preferred contact method. No phone number is displayed.</p></> : <p>Use a professional profile below to discuss design work and opportunities.</p>}<div className="contact-link-list">{links.filter(link=>link.showInContact&&link.url&&link.kind!=="Email").map(link=><ExternalLink className={link.kind==="LinkedIn"?"button":"button button-secondary"} href={linkHref(link.kind,link.url)} key={link.id}>{link.label} <span aria-hidden="true">↗</span></ExternalLink>)}</div></div><form className="request-form" onSubmit={sendRequest}><div className="request-form-heading"><div><h3>Request the full portfolio</h3><p>Rumky can follow up with access to relevant project work.</p></div><span>All fields required</span></div><div className="request-fields"><label>Full name<input required minLength={2} maxLength={100} autoComplete="name" value={requestForm.name} onChange={e=>setRequestForm({...requestForm,name:e.target.value})}/></label><label>Email address<input required type="email" maxLength={180} autoComplete="email" value={requestForm.email} onChange={e=>setRequestForm({...requestForm,email:e.target.value})}/></label><label>Project or portfolio<select value={requestForm.project} onChange={e=>setRequestForm({...requestForm,project:e.target.value})}><option>Full portfolio</option>{content.projects.map(project=><option key={project.id} value={project.title}>{project.title}</option>)}</select></label><label className="request-message">Message<textarea required minLength={10} maxLength={2000} rows={5} value={requestForm.message} onChange={e=>setRequestForm({...requestForm,message:e.target.value})}/></label><label className="request-honeypot" aria-hidden="true">Website<input tabIndex={-1} autoComplete="off" value={requestForm.website} onChange={e=>setRequestForm({...requestForm,website:e.target.value})}/></label></div><div className="request-submit"><button className="button" disabled={requestBusy}>{requestBusy?"Sending…":"Send access request"}</button>{requestStatus?<p role="status">{requestStatus}</p>:null}</div></form></div></section>
    </main>
    <footer><div className="container footer-inner"><p>© {new Date().getFullYear()} {content.name}</p><a href="#home">Back to top ↑</a></div></footer>
  </div>;
}
