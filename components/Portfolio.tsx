"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import type { PortfolioContent } from "@/lib/content";

function ExternalLink({ href, children, className = "" }: { href: string; children: React.ReactNode; className?: string }) {
  if (!href) return <span className={`disabled-link ${className}`} aria-disabled="true">{children}</span>;
  return <a className={className} href={href} target="_blank" rel="noreferrer">{children}</a>;
}

export function Portfolio({ content }: { content: PortfolioContent }) {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const close = (event: KeyboardEvent) => event.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", close);
    return () => document.removeEventListener("keydown", close);
  }, []);
  const initials = content.name.split(" ").map((part) => part[0]).slice(0, 2).join("").toLowerCase();
  return <div style={{ "--accent": content.accentColor, "--accent-dark": content.accentColor } as React.CSSProperties}>
    <a className="skip-link" href="#main-content">Skip to main content</a>
    <header className="site-header">
      <div className="container header-inner">
        <a className="wordmark" href="#home" aria-label={`${content.name}, home`}><span className="wordmark-mark" aria-hidden="true">{initials}</span><span>{content.shortName}</span></a>
        <button className="menu-button" type="button" aria-expanded={open} aria-controls="primary-navigation" onClick={() => setOpen(!open)}><span className="sr-only">{open ? "Close" : "Open"} navigation</span><span/><span/><span/></button>
        <nav id="primary-navigation" className={`primary-nav ${open ? "is-open" : ""}`} aria-label="Primary navigation">
          {[["About", "about"], ["Experience", "experience"], ["Skills", "skills"], ["Education", "education"], ["Contact", "contact"]].map(([label,id]) => <a key={id} href={`#${id}`} onClick={() => setOpen(false)}>{label}</a>)}
          {content.resumeUrl ? <a className="button button-small" href={content.resumeUrl} target="_blank" rel="noreferrer">Download résumé</a> : null}
        </nav>
      </div>
    </header>
    <main id="main-content">
      <section id="home" className="hero" aria-labelledby="hero-title"><div className="container hero-grid"><div>
        {content.showAvailability ? <p className="availability"><span aria-hidden="true"/>{content.availability}</p> : null}<p className="eyebrow">{content.title}</p>
        <h1 id="hero-title">{content.heroTitle} <span>{content.heroAccent}</span></h1>
        <p className="hero-copy">Hi, I’m <strong>{content.name}</strong>. {content.introduction}</p>
        <div className="hero-actions"><ExternalLink className="button" href={content.portfolioUrl}>View portfolio <span aria-hidden="true">↗</span></ExternalLink><a className="button button-secondary" href="#contact">Let’s connect</a></div>
        <ul className="social-list" aria-label="Professional profiles">{[["LinkedIn",content.linkedinUrl],["Dribbble",content.dribbbleUrl],["Behance",content.behanceUrl]].filter(([,url]) => url).map(([label,url]) => <li key={label}><ExternalLink href={url}>{label} <span aria-hidden="true">↗</span></ExternalLink></li>)}</ul>
      </div><aside className="hero-card" aria-label="Professional summary">{content.profileImage ? <div className="profile-image-wrap"><Image src={content.profileImage} alt={content.profileImageAlt} width={520} height={520} unoptimized /></div> : null}<p className="hero-card-label">At a glance</p><dl><div><dt>Focus</dt><dd>{content.focus}</dd></div><div><dt>Approach</dt><dd>{content.approach}</dd></div><div><dt>Based in</dt><dd>{content.location}</dd></div></dl><div className="visual-note" aria-hidden="true"><span>Research</span><span>Design</span><span>Validate</span></div></aside></div></section>
      <section id="about" className="section section-tinted" aria-labelledby="about-title"><div className="container split-heading"><div><p className="eyebrow">About me</p><h2 id="about-title">{content.aboutTitle}</h2></div><div className="prose">{content.about.map((paragraph,index) => <p key={index}>{paragraph}</p>)}</div></div></section>
      <section id="experience" className="section" aria-labelledby="experience-title"><div className="container"><div className="section-heading"><div><p className="eyebrow">Career journey</p><h2 id="experience-title">Experience</h2></div></div><div className="timeline">{content.experiences.map((item) => <article className="timeline-item" key={item.id}><div className="timeline-meta"><p>{item.period}</p><p>{item.company}</p></div><div><h3>{item.role}</h3><p>{item.summary}</p><ul className="tag-list" aria-label="Skills used">{item.skills.map(skill => <li key={skill}>{skill}</li>)}</ul></div></article>)}</div></div></section>
      <section id="skills" className="section section-dark" aria-labelledby="skills-title"><div className="container"><div className="section-heading section-heading-light"><div><p className="eyebrow">What I bring</p><h2 id="skills-title">Skills &amp; tools</h2></div><p>A practical toolkit for moving from ambiguity to a usable product.</p></div><div className="skill-grid">{content.skills.map((item,index) => <article key={item.id}><span className="skill-number" aria-hidden="true">{String(index + 1).padStart(2,"0")}</span><h3>{item.title}</h3><p>{item.description}</p></article>)}</div></div></section>
      <section className="section portfolio-callout" aria-labelledby="portfolio-title"><div className="container callout-card"><div><p className="eyebrow">Selected work</p><h2 id="portfolio-title">See the full design portfolio in Figma.</h2><p>Explore detailed projects, process work, and interface design in one curated portfolio file.</p></div><ExternalLink className="button button-light" href={content.portfolioUrl}>Open Figma portfolio <span aria-hidden="true">↗</span></ExternalLink></div></section>
      <section id="education" className="section section-tinted" aria-labelledby="education-title"><div className="container"><div className="section-heading"><div><p className="eyebrow">Background</p><h2 id="education-title">Education</h2></div></div><div className="education-grid">{content.education.map(item => <article key={item.id}><p className="education-year">{item.year}</p><h3>{item.qualification}</h3><p>{item.institution}</p><span>{item.detail}</span></article>)}</div></div></section>
      <section id="contact" className="section contact-section" aria-labelledby="contact-title"><div className="container contact-grid"><div><p className="eyebrow">Let’s work together</p><h2 id="contact-title">Have a project or opportunity in mind?</h2></div><div className="contact-actions"><a className="email-link" href={`mailto:${content.email}`}>{content.email} <span aria-hidden="true">↗</span></a><p>Email is the preferred contact method. No phone number is displayed.</p><div className="hero-actions"><ExternalLink className="button" href={content.linkedinUrl}>LinkedIn</ExternalLink>{content.resumeUrl ? <a className="button button-secondary" href={content.resumeUrl} target="_blank" rel="noreferrer">Download résumé</a> : null}</div></div></div></section>
    </main>
    <footer><div className="container footer-inner"><p>© {new Date().getFullYear()} {content.name}</p><a href="#home">Back to top ↑</a></div></footer>
  </div>;
}
