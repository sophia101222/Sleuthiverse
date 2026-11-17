"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowDownRight, ArrowRight, BookOpen, Bookmark, ChevronDown,
  Clock3, Compass, Feather, FileSearch, Fingerprint, Library,
  Lightbulb, Menu, MessageCircle, Search, Shield, Sparkles,
  Users, X, type LucideIcon
} from "lucide-react";

type Challenge = {
  id: string; category: string; difficulty: string; title: string;
  description: string; author: string; time: string; replies: number;
  accent: string; tag: string;
};

const challenges: Challenge[] = [
  { id:"CASE-014", category:"Locked-room", difficulty:"Intermediate", title:"The Clock That Never Chimed", description:"A collector is found in a room locked from within. Every clock in the house shows a different time — but one of them is telling the truth.", author:"M. Ellery", time:"12 min ago", replies:18, accent:"wine", tag:"TIME & ALIBIS" },
  { id:"CASE-013", category:"Classic clues", difficulty:"Beginner", title:"A Note in Disappearing Ink", description:"Three guests each received a different invitation. Only one noticed the detail that connects them.", author:"papertrail", time:"Yesterday", replies:32, accent:"green", tag:"OBSERVATION" },
  { id:"CASE-012", category:"Character logic", difficulty:"Advanced", title:"The Witness Who Remembered Too Much", description:"Four statements, one shared memory, and a contradiction hiding in plain sight.", author:"A. Finch", time:"2 days ago", replies: nine(), accent:"gold", tag:"DEDUCTION" },
];

function nine() { return 9; }

const discussions = [
  { topic:"AGATHA CHRISTIE", title:"Is The Murder of Roger Ackroyd still the fairest twist in detective fiction?", replies:46, last:"8 min ago", initials:"AC", color:"wine" },
  { topic:"HOLMES & CO.", title:"Holmes's deductions: observation or educated guesswork?", replies:28, last:"24 min ago", initials:"SH", color:"green" },
  { topic:"WRITING CRAFT", title:"How much information should a reader have before the reveal?", replies:19, last:"1 hr ago", initials:"WC", color:"gold" },
];

const categories = ["All cases", "Locked-room", "Classic clues", "Character logic"];

function IconTile({ icon: Icon, tone="green" }: { icon: LucideIcon; tone?: string }) {
  return <span className={`icon-tile ${tone}`}><Icon size={18} strokeWidth={1.7} /></span>;
}

export default function Home() {
  const [active, setActive] = useState("Overview");
  const [category, setCategory] = useState("All cases");
  const [query, setQuery] = useState("");
  const [showAll, setShowAll] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [saved, setSaved] = useState<string[]>([]);
  const [selectedCase, setSelectedCase] = useState<Challenge | null>(null);

  const filtered = useMemo(() => challenges.filter((item) => {
    const matchesCategory = category === "All cases" || item.category === category;
    const matchesQuery = (item.title + " " + item.description + " " + item.tag).toLowerCase().includes(query.toLowerCase());
    return matchesCategory && matchesQuery;
  }), [category, query]);

  const navItems = [
    { label:"Overview", icon:Compass },
    { label:"Community", icon:Users },
    { label:"Case challenges", icon:Fingerprint },
    { label:"Investigation desk", icon:FileSearch },
    { label:"Creative studio", icon:Feather },
    { label:"The library", icon:Library },
  ];

  const changeSection = (label: string) => {
    if (label === "Investigation desk") { window.location.href = "/desk"; return; }
    setActive(label);
    setMenuOpen(false);
    if (label !== "Overview") {
      document.getElementById(label === "Community" ? "community" : label === "Case challenges" ? "challenges" : label === "The library" ? "library" : "workspace")?.scrollIntoView({ behavior:"smooth", block:"start" });
    } else window.scrollTo({ top:0, behavior:"smooth" });
  };

  return (
    <main className="site-shell">
      <aside className={`sidebar ${menuOpen ? "open" : ""}`}>
        <a className="brand" href="#" onClick={() => changeSection("Overview")}>
          <span className="brand-mark"><Fingerprint size={25} strokeWidth={1.45}/></span>
          <span className="brand-name">sleuth<span>iverse</span><small>THE MYSTERY SOCIETY</small></span>
        </a>
        <div className="side-rule" />
        <p className="side-label">THE SOCIETY</p>
        <nav className="side-nav">
          {navItems.map(({label,icon:Icon}) => (
            <button key={label} className={active===label ? "nav-item active" : "nav-item"} onClick={() => changeSection(label)}>
              <Icon size={17} strokeWidth={1.7}/><span>{label}</span>{label==="Case challenges" && <i className="nav-count">03</i>}
            </button>
          ))}
        </nav>
        <div className="sidebar-note">
          <div className="note-stamp"><Shield size={15}/> MEMBER&apos;S NOTE</div>
          <p>Every mystery leaves a trace. Every curious mind belongs here.</p>
          <span>EST. FOR THE CURIOUS</span>
        </div>
        <div className="profile-mini">
          <div className="avatar">G</div><div><strong>Guest investigator</strong><small>Exploring the society</small></div><ChevronDown size={15}/>
        </div>
      </aside>

      <section className="main-area">
        <header className="topbar">
          <button className="mobile-menu" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">{menuOpen?<X/>:<Menu/>}</button>
          <div className="breadcrumb"><span>THE SOCIETY</span><b>/</b><strong>{active.toUpperCase()}</strong></div>
          <div className="top-actions"><span className="status-dot"/> <span className="status-text">THE ARCHIVES ARE OPEN</span><Link className="join-button" href="/desk">Explore as guest <ArrowRight size={15}/></Link></div>
        </header>

        <div className="content-wrap">
          <section className="hero">
            <div className="hero-copy">
              <div className="eyebrow"><span/> A PLACE FOR THE PERPETUALLY CURIOUS</div>
              <h1>Somewhere,<br/>a <em>clue</em> is waiting.</h1>
              <p className="hero-description">For those who read between the lines, question every alibi, and find delight in the details others overlook.</p>
              <div className="hero-actions">
                <button className="primary-button" onClick={() => document.getElementById("challenges")?.scrollIntoView({behavior:"smooth"})}>Enter the case files <ArrowRight size={16}/></button>
                <button className="text-button" onClick={() => document.getElementById("community")?.scrollIntoView({behavior:"smooth"})}>Meet the society <ArrowDownRight size={16}/></button>
              </div>
              <div className="hero-foot"><span>VOL. 01</span><i/> <span>FOR READERS · THINKERS · STORYTELLERS</span></div>
            </div>
            <div className="hero-art" aria-label="Illustrated detective archive desk">
              <div className="art-topline"><span>ARCHIVE No. 001</span><span>CONFIDENTIAL</span></div>
              <div className="moon-disc"/>
              <div className="magnifier"><div className="lens"><Fingerprint size={78} strokeWidth={0.8}/></div><div className="handle"/></div>
              <div className="paper paper-back"><span>FIELD NOTES</span><b>Observe.<br/>Connect.<br/>Deduce.</b><i>— THE INVESTIGATOR</i></div>
              <div className="paper paper-front"><small>CASE STUDY / 001</small><strong>THE ART OF<br/>NOTICING</strong><div className="paper-lines"/><span>Nothing is insignificant.</span></div>
              <div className="art-bottom"><span>FIG. A — THE INVESTIGATOR&apos;S DESK</span><span>01 / 05</span></div>
            </div>
          </section>

          <div className="ticker"><span>✳ &nbsp; READ DEEPLY</span><i/><span>THINK CRITICALLY</span><i/><span>FOLLOW THE EVIDENCE</span><i/><span>TRUST NO EASY ANSWER</span><i/><span>✳</span></div>

          <section className="section-block" id="challenges">
            <div className="section-heading">
              <div><div className="eyebrow"><span/> THE CASE ROOM</div><h2>Open <em>investigations</em></h2><p>Small mysteries. Big questions. Your deduction starts here.</p></div>
              <div className="section-actions"><button className="outline-button" onClick={() => setShowAll(!showAll)}>{showAll?"Show featured":"Show featured set"} <ArrowRight size={15}/></button><Link className="outline-button" href="/challenges">Open case room <ArrowRight size={15}/></Link></div>
            </div>
            <div className="case-toolbar">
              <div className="filter-tabs">{categories.map((c) => <button key={c} className={category===c?"filter-tab selected":"filter-tab"} onClick={() => setCategory(c)}>{c}</button>)}</div>
              <label className="search-box"><Search size={15}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search case files..." /><span>⌘ K</span></label>
            </div>
            <div className="case-grid">
              {(showAll ? [...filtered, ...filtered] : filtered).map((item,index) => (
                <article className={`case-card ${item.accent}`} key={item.id+"-"+index}>
                  <div className="case-card-top"><span className="case-id">{item.id}</span><button className={saved.includes(item.id)?"save-button saved":"save-button"} onClick={()=>setSaved(old=>old.includes(item.id)?old.filter(x=>x!==item.id):[...old,item.id])} aria-label="Save case"><Bookmark size={16} fill={saved.includes(item.id)?"currentColor":"none"}/></button></div>
                  <div className="case-tag">{item.tag}</div><h3>{item.title}</h3><p>{item.description}</p>
                  <div className="case-meta"><span><Clock3 size={13}/>{item.time}</span><span><MessageCircle size={13}/>{item.replies} theories</span></div>
                  <div className="case-card-bottom"><span>{item.difficulty}</span><button onClick={()=>setSelectedCase(item)}>Examine case <ArrowUpRightIcon/></button></div>
                </article>
              ))}
              {filtered.length===0 && <div className="empty-state">No case files match that search. Try another clue.</div>}
            </div>
          </section>

          <section className="community-section" id="community">
            <div className="community-intro"><div className="eyebrow"><span/> THE READING ROOM</div><h2>Good theories<br/>are <em>better shared.</em></h2><p>A thoughtful corner for readers who love a clever reveal, a fair-play mystery, and a spirited discussion.</p><Link className="text-button" href="/community">Enter the discussion room <ArrowRight size={15}/></Link></div>
            <div className="discussion-list">
              <div className="discussion-header"><span>RECENT CONVERSATIONS</span><span>COMMUNITY NOTES <ArrowRight size={13}/></span></div>
              {discussions.map((d)=><article className="discussion-row" key={d.title}><div className={`discussion-avatar ${d.color}`}>{d.initials}</div><div className="discussion-content"><span>{d.topic}</span><h3>{d.title}</h3><small>{d.last}</small></div><div className="discussion-replies"><MessageCircle size={14}/>{d.replies}</div><ArrowRight className="discussion-arrow" size={16}/></article>)}
              <Link className="all-discussions" href="/community">View all conversations <ArrowRight size={14}/></Link>
            </div>
          </section>

          <section className="workspace-section" id="workspace">
            <div className="section-heading"><div><div className="eyebrow"><span/> YOUR INVESTIGATION DESK</div><h2>Make sense of the <em>evidence.</em></h2><p>Keep your notes, connections and creative threads in one place.</p></div><span className="coming-soon">YOUR PRIVATE WORKSPACE</span></div>
            <div className="tool-grid">
              <article className="tool-card"><IconTile icon={Clock3}/><span>01 / CHRONOLOGY</span><h3>Timeline builder</h3><p>Arrange events, compare accounts and spot contradictions in a story.</p><button onClick={()=>{ window.location.href="/desk"; }}>Explore tool <ArrowRight size={14}/></button></article>
              <article className="tool-card"><IconTile icon={Users} tone="wine"/><span>02 / CONNECTIONS</span><h3>Character web</h3><p>Map relationships, motives and the links between every character.</p><button onClick={()=>{ window.location.href="/desk"; }}>Explore tool <ArrowRight size={14}/></button></article>
              <article className="tool-card"><IconTile icon={Lightbulb} tone="gold"/><span>03 / DEDUCTION</span><h3>Logic notebook</h3><p>Collect clues, record hypotheses and test whether the details add up.</p><button onClick={()=>{ window.location.href="/desk"; }}>Explore tool <ArrowRight size={14}/></button></article>
            </div>
          </section>

          <section className="library-strip" id="library"><div className="library-icon"><BookOpen size={24}/></div><div><div className="eyebrow"><span/> THE REFERENCE ARCHIVE</div><h2>A little knowledge is a <em>powerful clue.</em></h2><p>Discover authors, detective fiction traditions, literary devices and the science behind fictional investigations.</p></div><button className="outline-button" onClick={()=>setActive("The library")}>Visit the library <ArrowRight size={15}/></button></section>

          <footer className="footer"><a className="footer-brand" href="#"><Fingerprint size={19}/> SLEUTHIVERSE</a><span>A UNIVERSE OF CLUES, CASES & CURIOUS MINDS.</span><span>© 2026 SLEUTHIVERSE SOCIETY</span></footer>
        </div>
      </section>

      {selectedCase && <div className="modal-backdrop" onClick={()=>setSelectedCase(null)}><div className="case-modal" onClick={e=>e.stopPropagation()}><button className="modal-close" onClick={()=>setSelectedCase(null)}><X size={18}/></button><span className="case-id">{selectedCase.id} / {selectedCase.tag}</span><h2>{selectedCase.title}</h2><p>{selectedCase.description}</p><div className="modal-note"><Sparkles size={16}/> {selectedCase.time==="Coming soon"?"This workspace is part of the product roadmap.":"This is a preview case for the first Sleuthiverse concept build. Full case submissions and discussion will be added in a later version."}</div><button className="primary-button" onClick={()=>setSelectedCase(null)}>Back to the society <ArrowRight size={15}/></button></div></div>}
    </main>
  );
}

function ArrowUpRightIcon() { return <ArrowRight size={14}/>; }
