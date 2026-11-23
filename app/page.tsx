"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight, BookOpen, CalendarClock, FileSearch, Fingerprint, Feather, Lightbulb, Menu, Network, Package, ScrollText, Users, X } from "lucide-react";

const navigation = [
  { label: "Overview", href: "/", icon: Fingerprint, group: "MAIN" },
  { label: "Community", href: "/community", icon: Users },
  { label: "Case challenges", href: "/challenges", icon: Lightbulb },
  { group: "INVESTIGATION DESK" },
  { label: "Timeline", href: "/desk/timeline", icon: CalendarClock },
  { label: "People & statements", href: "/desk/people", icon: Users },
  { label: "Clue register", href: "/desk/clues", icon: FileSearch },
  { label: "Investigator's notebook", href: "/desk/notes", icon: BookOpen },
  { group: "STORY WORKSHOP" },
  { label: "Worldbuilding", href: "/workshop/worldbuilding", icon: BookOpen },
  { label: "Story timeline", href: "/workshop/timeline", icon: CalendarClock },
  { label: "Characters", href: "/workshop/characters", icon: Network },
  { label: "Objects", href: "/workshop/objects", icon: Package },
  { label: "Plot architecture", href: "/workshop/plot", icon: ScrollText },
  { label: "Clues & misdirection", href: "/workshop/clues", icon: Lightbulb },
  { label: "Writer's notebook", href: "/workshop/notes", icon: Feather },
  { group: "MORE" },
  { label: "Tool directory", href: "/tools", icon: Fingerprint },
];

const cases = [
  { id: "CASE-014", tag: "TIME & ALIBIS", title: "The Clock That Never Chimed", summary: "A collector, a locked room, and a house full of clocks that disagree.", level: "Intermediate", tone: "wine" },
  { id: "CASE-013", tag: "OBSERVATION", title: "A Note in Disappearing Ink", summary: "Three invitations. Three guests. One overlooked detail ties them together.", level: "Beginner", tone: "green" },
  { id: "CASE-012", tag: "DEDUCTION", title: "The Witness Who Remembered Too Much", summary: "Four statements and a contradiction hiding in plain sight.", level: "Advanced", tone: "gold" },
];

const quickTools = [
  { label: "Timeline", detail: "Arrange events and spot contradictions.", href: "/desk/timeline", icon: CalendarClock, tone: "green" },
  { label: "People & statements", detail: "Track characters and what they claim.", href: "/desk/people", icon: Users, tone: "wine" },
  { label: "Clue register", detail: "Keep evidence and interpretation distinct.", href: "/desk/clues", icon: FileSearch, tone: "gold" },
  { label: "Investigator's notebook", detail: "Save theories and open questions.", href: "/desk/notes", icon: BookOpen, tone: "green" },
];

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <main className="site-shell home-v2">
      <aside className={`sidebar ${menuOpen ? "open" : ""}`}>
        <Link className="brand" href="/" onClick={() => setMenuOpen(false)}>
          <span className="brand-mark"><Fingerprint size={24} strokeWidth={1.5}/></span>
          <span className="brand-name">sleuth<span>iverse</span><small>THE MYSTERY SOCIETY</small></span>
        </Link>
        <div className="side-rule"/>
        <nav className="side-nav home-nav">
          {navigation.map((item, index) => item.group ? (
            <div className="side-label" key={item.group}>{item.group}</div>
          ) : (
            <Link key={item.href} href={item.href!} className={item.href === "/" ? "nav-item active" : "nav-item"} onClick={() => setMenuOpen(false)}>
              {item.icon && <item.icon size={17} strokeWidth={1.65}/>}<span>{item.label}</span>
            </Link>
          ))}
        </nav>
        <div className="sidebar-note">
          <div className="note-stamp"><Fingerprint size={14}/> SOCIETY&apos;S MOTTO</div>
          <p>Every mystery leaves a trace. Every curious mind belongs here.</p>
          <span>READ · THINK · DEDUCE</span>
        </div>
        <div className="profile-mini"><div className="avatar">G</div><div><strong>Guest investigator</strong><small>Local workspace</small></div></div>
      </aside>

      <section className="main-area">
        <header className="topbar">
          <button className="mobile-menu" onClick={() => setMenuOpen(v => !v)} aria-label="Toggle menu">{menuOpen ? <X/> : <Menu/>}</button>
          <div className="breadcrumb"><span>SLEUTHIVERSE</span><b>/</b><strong>OVERVIEW</strong></div>
          <div className="top-actions"><span className="status-dot"/><span className="status-text">THE ARCHIVES ARE OPEN</span><Link className="join-button" href="/tools">Tool directory <ArrowRight size={15}/></Link></div>
        </header>

        <div className="content-wrap home-content-v2">
          <section className="home-welcome">
            <div className="home-welcome-copy">
              <div className="eyebrow"><span/> A PLACE FOR THE PERPETUALLY CURIOUS</div>
              <h1>Somewhere,<br/>a <em>clue</em> is waiting.</h1>
              <p>Read between the lines, question every alibi, and follow the details others overlook.</p>
              <div className="hero-actions"><Link className="primary-button" href="/challenges">Explore cases <ArrowRight size={15}/></Link><Link className="text-button" href="/community">Visit the reading room <ArrowRight size={15}/></Link></div>
            </div>
            <div className="home-welcome-art">
              <div className="welcome-art-label">ARCHIVE No. 001 <span>CONFIDENTIAL</span></div>
              <div className="welcome-art-orbit"><Fingerprint size={70} strokeWidth={.85}/></div>
              <div className="welcome-paper"><small>FIELD NOTES</small><strong>Observe.<br/>Connect.<br/>Deduce.</strong><span>— THE INVESTIGATOR</span></div>
              <div className="welcome-art-caption">THE ART OF NOTICING · 01</div>
            </div>
          </section>

          <section className="home-overview-grid">
            <Link href="/challenges" className="overview-panel overview-case-panel">
              <div className="overview-panel-top"><span>THE CASE ROOM</span><Lightbulb size={18}/></div>
              <h2>Open <em>investigations</em></h2>
              <p>Small mysteries, big questions. Your deduction starts here.</p>
              <span className="overview-link">Browse case challenges <ArrowRight size={14}/></span>
            </Link>
            <Link href="/community" className="overview-panel overview-community-panel">
              <div className="overview-panel-top"><span>THE READING ROOM</span><Users size={18}/></div>
              <h2>Good theories are <em>better shared.</em></h2>
              <p>Discuss detective fiction, compare interpretations, and exchange ideas.</p>
              <span className="overview-link">Join the community <ArrowRight size={14}/></span>
            </Link>
          </section>

          <section className="home-section-v2">
            <div className="home-section-heading">
              <div><div className="eyebrow"><span/> YOUR INVESTIGATION DESK</div><h2>Keep the details <em>in order.</em></h2><p>Jump straight into a tool. No directory page in between.</p></div>
              <Link href="/desk" className="outline-button">Case files <ArrowRight size={14}/></Link>
            </div>
            <div className="home-tools-grid">
              {quickTools.map(({label,detail,href,icon:Icon,tone})=><Link href={href} className="home-tool" key={href}><span className={`home-tool-icon ${tone}`}><Icon size={18}/></span><div><h3>{label}</h3><p>{detail}</p></div><ArrowRight size={15} className="home-tool-arrow"/></Link>)}
            </div>
          </section>

          <section className="home-section-v2">
            <div className="home-section-heading">
              <div><div className="eyebrow"><span/> FEATURED CASES</div><h2>Pick up a <em>thread.</em></h2><p>Short mysteries designed to reward careful observation.</p></div>
              <Link href="/challenges" className="outline-button">All challenges <ArrowRight size={14}/></Link>
            </div>
            <div className="home-featured-cases">
              {cases.map(c=><Link href="/challenges" className={`home-feature-case ${c.tone}`} key={c.id}><span className="case-id">{c.id}</span><span className="case-tag">{c.tag}</span><h3>{c.title}</h3><p>{c.summary}</p><div className="home-case-footer"><span>{c.level}</span><span>Examine <ArrowRight size={14}/></span></div></Link>)}
            </div>
          </section>

          <section className="home-workshop-strip">
            <div className="home-workshop-icon"><Feather size={22}/></div><div><div className="eyebrow"><span/> STORY WORKSHOP</div><h2>Create a mystery of your own.</h2><p>Build the setting, cast, timeline, plot and clue logic in separate workspaces.</p></div><Link href="/workshop/worldbuilding" className="outline-button">Start building <ArrowRight size={14}/></Link>
          </section>

          <footer className="footer home-footer-v2"><Link className="footer-brand" href="/"><Fingerprint size={18}/> SLEUTHIVERSE</Link><span>A UNIVERSE OF CLUES, CASES & CURIOUS MINDS.</span><span>© 2026 SLEUTHIVERSE</span></footer>
        </div>
      </section>
    </main>
  );
}
