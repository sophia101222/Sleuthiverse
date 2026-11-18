"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, BookOpen, CalendarClock, Check, Feather, Fingerprint, Lightbulb, Network, Package, Plus, ScrollText, Trash2 } from "lucide-react";
import styles from "./workshop.module.css";

type StoryProject = { id:string; title:string; genre:string; updatedAt:string; data:{world:string;premise:string;characters:{id:string;name:string;role:string;motive:string;secret:string}[];beats:{id:string;title:string;act:string;purpose:string}[];devices:{id:string;clue:string;placement:string;payoff:string;kind:"clue"|"misdirection"|"reveal"}[];notes:string;timeline?:unknown[];objects?:unknown[];relationships?:unknown[]} };
const blank = (): StoryProject => ({id:crypto.randomUUID(),title:"",genre:"Classic detective mystery",updatedAt:new Date().toLocaleString(),data:{world:"",premise:"",characters:[],beats:[],devices:[],notes:"",timeline:[],objects:[],relationships:[]}});
const tools = [
  {href:"/workshop/worldbuilding",title:"Worldbuilding",detail:"Setting, fictional rules, geography and background.",icon:BookOpen,tag:"FOUNDATIONS"},
  {href:"/workshop/timeline",title:"Story timeline",detail:"Chronology, event order, durations and time gaps.",icon:CalendarClock,tag:"CHRONOLOGY"},
  {href:"/workshop/characters",title:"Characters & relationships",detail:"Character profiles and a visual relationship map.",icon:Network,tag:"CAST & CONNECTIONS"},
  {href:"/workshop/objects",title:"Important objects",detail:"Track key objects, holders, appearances and significance.",icon:Package,tag:"OBJECT REGISTER"},
  {href:"/workshop/plot",title:"Plot architecture",detail:"Structure, turning points, pacing and reveals.",icon:ScrollText,tag:"NARRATIVE"},
  {href:"/workshop/clues",title:"Clues & misdirection",detail:"Plan clue placement, red herrings and payoffs.",icon:Lightbulb,tag:"FAIR-PLAY DESIGN"},
  {href:"/workshop/notes",title:"Writer's notebook",detail:"Collect loose ideas, questions and revisions.",icon:Feather,tag:"PRIVATE NOTES"},
];

export default function StoryWorkshopPage() {
  const [projects,setProjects]=useState<StoryProject[]>([]);
  const [selectedId,setSelectedId]=useState("");
  const [ready,setReady]=useState(false);
  const [showCreate,setShowCreate]=useState(false);
  const [title,setTitle]=useState("");
  const [genre,setGenre]=useState("Classic detective mystery");
  useEffect(()=>{
    try {
      const raw=localStorage.getItem("sleuthiverse-story-projects-v1");
      if(raw){const parsed=JSON.parse(raw) as {projects?:StoryProject[];selectedId?:string};if(Array.isArray(parsed.projects)&&parsed.projects.length){setProjects(parsed.projects);setSelectedId(parsed.projects.some(p=>p.id===parsed.selectedId)?parsed.selectedId!:parsed.projects[0].id);}}
    } catch {}
    setReady(true);
  },[]);
  useEffect(()=>{if(ready&&projects.length)localStorage.setItem("sleuthiverse-story-projects-v1",JSON.stringify({projects,selectedId}));},[projects,selectedId,ready]);
  function createProject(e:React.FormEvent){e.preventDefault();if(!title.trim())return;const next=blank();next.title=title.trim();next.genre=genre;setProjects(p=>[...p,next]);setSelectedId(next.id);setTitle("");setShowCreate(false);}
  function deleteProject(){if(projects.length<2){window.alert("Create another story before deleting the only project.");return;}if(!window.confirm("Delete this story project and all its content?"))return;const next=projects.filter(p=>p.id!==selectedId);setProjects(next);setSelectedId(next[0].id);}
  return <main className={styles.shell}>
    <header className={styles.header}><Link href="/tools" className={styles.brand}><Fingerprint size={23}/> SLEUTHIVERSE <span>/ STORY WORKSHOP</span></Link><Link href="/tools" className={styles.back}>All tools</Link></header>
    <section className={styles.intro}><div className={styles.kicker}>IMAGINE · DESIGN · CONSTRUCT</div><h1>The <em>story</em> workshop.</h1><p>Each part of your story has its own workspace. Choose a tool below; all tools share the same selected story project and save changes in this browser.</p></section>
    <section className={styles.projectBar}><div><span className={styles.kicker}>YOUR STORY PROJECTS</span><strong>{projects.length} SAVED {projects.length===1?"PROJECT":"PROJECTS"}</strong></div><div className={styles.projectActions}><select aria-label="Select story project" value={selectedId} onChange={e=>setSelectedId(e.target.value)}><option value="">Select project</option>{projects.map(p=><option key={p.id} value={p.id}>{p.title}</option>)}</select><button onClick={()=>setShowCreate(true)}><Plus size={15}/> New story</button>{projects.length>1&&<button className={styles.deleteProject} onClick={deleteProject} aria-label="Delete selected project"><Trash2 size={14}/></button>}</div></section>
    {showCreate&&<div className={styles.createOverlay}><form className={styles.createDialog} onSubmit={createProject}><button type="button" className={styles.closeDialog} onClick={()=>setShowCreate(false)}>×</button><div className={styles.kicker}>NEW CREATIVE PROJECT</div><h2>Start a story</h2><label>Project title<input autoFocus required value={title} onChange={e=>setTitle(e.target.value)} placeholder="Give your story a working title"/></label><label>Genre<select value={genre} onChange={e=>setGenre(e.target.value)}><option>Classic detective mystery</option><option>Locked-room mystery</option><option>Psychological mystery</option><option>Cozy mystery</option><option>Historical mystery</option><option>Other fiction</option></select></label><button className={styles.primaryButton}><Plus size={15}/> Create project</button></form></div>}
    {projects.length>0&&<section className={styles.projectHeading}><div><span>ACTIVE STORY / {projects.find(p=>p.id===selectedId)?.genre.toUpperCase()}</span><h2>{projects.find(p=>p.id===selectedId)?.title}</h2><p>Changes across all tools are saved to this project.</p></div><span className={styles.saved}><Check size={14}/> LOCAL AUTOSAVE</span></section>}
    <section className={styles.toolDirectory}><div className={styles.kicker}>STORY CREATION TOOLS · OPEN A SEPARATE WORKSPACE</div><div className={styles.directoryGrid}>{tools.map(({href,title,detail,icon:Icon,tag})=><Link href={href} key={href} className={styles.directoryCard}><div className={styles.directoryTop}><Icon size={20}/><span>{tag}</span></div><h2>{title}</h2><p>{detail}</p><span className={styles.directoryOpen}>Open tool <ArrowRight size={15}/></span></Link>)}</div></section>
    <footer className={styles.footer}>SLEUTHIVERSE · STORY WORKSHOP · A UNIVERSE OF CLUES, CASES & CURIOUS MINDS.</footer>
  </main>;
}
