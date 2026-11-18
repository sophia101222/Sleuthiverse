"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Plus, Trash2, Check, Network } from "lucide-react";
import styles from "./workshop.module.css";

type Character = { id: string; name: string; role: string; motive: string; secret: string };
type Beat = { id: string; title: string; act: string; purpose: string };
type Device = { id: string; clue: string; placement: string; payoff: string; kind: "clue" | "misdirection" | "reveal" };
type TimelineEvent = { id: string; time: string; title: string; detail: string };
type StoryObject = { id: string; name: string; description: string; owner: string; significance: string };
type Relationship = { id: string; from: string; to: string; label: string };
type StoryData = { world: string; premise: string; characters: Character[]; beats: Beat[]; devices: Device[]; notes: string; timeline?: TimelineEvent[]; objects?: StoryObject[]; relationships?: Relationship[] };
type StoryProject = { id: string; title: string; genre: string; updatedAt: string; data: StoryData };

const sectionInfo: Record<string, { title: string; eyebrow: string; description: string }> = {
  worldbuilding: { title: "Worldbuilding", eyebrow: "SETTING · RULES · CONTEXT", description: "Build the setting and fictional rules that shape the story." },
  timeline: { title: "Story timeline", eyebrow: "CHRONOLOGY · SEQUENCE · TIME", description: "Plan the chronology of the story, including event order, duration and time gaps." },
  characters: { title: "Characters & relationships", eyebrow: "CAST · MOTIVES · CONNECTIONS", description: "Develop characters and map how they know, trust, oppose or influence one another." },
  objects: { title: "Important objects", eyebrow: "PROPS · DOCUMENTS · SYMBOLS", description: "Track important fictional objects, their owners, appearances and narrative significance." },
  plot: { title: "Plot architecture", eyebrow: "STRUCTURE · PACING · REVEALS", description: "Arrange the story's major beats and turning points." },
  clues: { title: "Clues & misdirection", eyebrow: "FAIR PLAY · FORESHADOWING · PAYOFF", description: "Plan clues, red herrings and how each detail pays off." },
  notes: { title: "Writer's notebook", eyebrow: "IDEAS · QUESTIONS · REVISIONS", description: "Keep loose ideas, research questions and revisions together." },
};

const initialData = (): StoryData => ({ world: "", premise: "", characters: [], beats: [], devices: [], notes: "", timeline: [], objects: [], relationships: [] });

export default function WorkshopSectionPage({ section }: { section: string }) {
  const info = sectionInfo[section];
  const [projects, setProjects] = useState<StoryProject[]>([]);
  const [selectedId, setSelectedId] = useState("");
  const [ready, setReady] = useState(false);
  const [form, setForm] = useState<Record<string, string>>({});
  const [relation, setRelation] = useState({ from: "", to: "", label: "" });

  useEffect(() => {
    try {
      const raw = localStorage.getItem("sleuthiverse-story-projects-v1");
      if (raw) {
        const parsed = JSON.parse(raw) as { projects?: StoryProject[]; selectedId?: string };
        if (Array.isArray(parsed.projects) && parsed.projects.length) {
          const normalized = parsed.projects.map(p => ({ ...p, data: { ...initialData(), ...p.data, timeline: p.data.timeline ?? [], objects: p.data.objects ?? [], relationships: p.data.relationships ?? [] } }));
          setProjects(normalized);
          setSelectedId(normalized.some(p => p.id === parsed.selectedId) ? parsed.selectedId! : normalized[0].id);
        }
      }
    } catch { /* Keep the page usable if local data is invalid. */ }
    setReady(true);
  }, []);

  useEffect(() => {
    if (ready && projects.length) localStorage.setItem("sleuthiverse-story-projects-v1", JSON.stringify({ projects, selectedId }));
  }, [projects, selectedId, ready]);

  const project = projects.find(p => p.id === selectedId);
  const data = project?.data;
  const update = (patch: Partial<StoryData>) => setProjects(current => current.map(p => p.id === selectedId ? { ...p, data: { ...p.data, ...patch }, updatedAt: new Date().toLocaleString() } : p));
  const people = data?.characters ?? [];
  const nodes = useMemo(() => {
    const cx = 300, cy = 190, rx = 220, ry = 125;
    return people.map((person, index) => {
      const angle = (Math.PI * 2 * index / Math.max(people.length, 1)) - Math.PI / 2;
      return { ...person, x: cx + Math.cos(angle) * (people.length === 1 ? 0 : rx), y: cy + Math.sin(angle) * (people.length === 1 ? 0 : ry) };
    });
  }, [people]);

  function addItem(key: "timeline" | "objects" | "beats" | "devices" | "characters") {
    if (!data) return;
    const id = crypto.randomUUID();
    if (key === "timeline" && form.title?.trim()) update({ timeline: [...(data.timeline ?? []), { id, time: form.time ?? "", title: form.title, detail: form.detail ?? "" }] });
    if (key === "objects" && form.name?.trim()) update({ objects: [...(data.objects ?? []), { id, name: form.name, description: form.description ?? "", owner: form.owner ?? "", significance: form.significance ?? "" }] });
    if (key === "beats" && form.title?.trim()) update({ beats: [...data.beats, { id, title: form.title, act: form.act ?? "Investigation", purpose: form.purpose ?? "" }] });
    if (key === "devices" && form.clue?.trim()) update({ devices: [...data.devices, { id, clue: form.clue, placement: form.placement ?? "", payoff: form.payoff ?? "", kind: (form.kind ?? "clue") as Device["kind"] }] });
    if (key === "characters" && form.name?.trim()) update({ characters: [...people, { id, name: form.name, role: form.role ?? "", motive: form.motive ?? "", secret: form.secret ?? "" }] });
    setForm({});
  }

  if (!info) return <main className={styles.shell}><h1>Tool not found</h1><Link href="/workshop">Back to Story Workshop</Link></main>;

  return (
    <main className={styles.shell}>
      <header className={styles.header}><Link href="/workshop" className={styles.brand}><ArrowLeft size={18}/> STORY WORKSHOP <span>/ ALL TOOLS</span></Link><Link href="/tools" className={styles.back}>All tools</Link></header>
      <section className={styles.intro}><div className={styles.kicker}>{info.eyebrow}</div><h1>{info.title}</h1><p>{info.description}</p></section>
      <section className={styles.projectBar}>
        <div><span className={styles.kicker}>ACTIVE STORY PROJECT</span><strong>{project?.title ?? (ready ? "NO PROJECT SELECTED" : "LOADING…")}</strong></div>
        <div className={styles.projectActions}><select aria-label="Select story project" value={selectedId} onChange={e=>setSelectedId(e.target.value)}><option value="">Select project</option>{projects.map(p=><option key={p.id} value={p.id}>{p.title}</option>)}</select><Link className={styles.action} href="/workshop">Story tools</Link></div>
      </section>
      {!project ? <div className={styles.panel}><p>Create a story project in the Story Workshop directory first.</p><Link href="/workshop">Open Story Workshop</Link></div> : (
        <section className={styles.panel}>
          {section === "worldbuilding" && <><div className={styles.panelHead}><div><div className={styles.kicker}>FOUNDATIONS & CONTEXT</div><h2>Worldbuilding</h2><p>Define the fictional setting, constraints and premise.</p></div></div><label className={styles.editorLabel}>STORY PREMISE<textarea className={styles.shortEditor} value={data!.premise} onChange={e=>update({premise:e.target.value})} placeholder="What is the central situation?"/></label><label className={styles.editorLabel}>SETTING, RULES & BACKGROUND<textarea className={styles.longEditor} value={data!.world} onChange={e=>update({world:e.target.value})} placeholder="Place, period, social context, geography, important locations and rules of the fictional world..."/></label></>}
          {section === "timeline" && <><div className={styles.panelHead}><div><div className={styles.kicker}>CHRONOLOGY</div><h2>Story timeline</h2><p>Record the sequence and timing of major fictional events.</p></div><span className={styles.count}>{(data!.timeline ?? []).length} EVENTS</span></div><div className={styles.beatList}>{[...(data!.timeline ?? [])].sort((a,b)=>a.time.localeCompare(b.time)).map((item,index)=><article className={styles.beat} key={item.id}><div className={styles.beatNumber}>{item.time || String(index+1).padStart(2,"0")}</div><div><h3>{item.title}</h3><p>{item.detail}</p></div><button onClick={()=>update({timeline:(data!.timeline ?? []).filter(x=>x.id!==item.id)})}><Trash2 size={14}/></button></article>)}</div><form className={styles.addForm} onSubmit={e=>{e.preventDefault();addItem("timeline");}}><h3><Plus size={16}/> Add timeline event</h3><div className={styles.formGrid}><label>Time / date<input value={form.time ?? ""} onChange={e=>setForm({...form,time:e.target.value})} placeholder="e.g. 7:30 PM / Day 2"/></label><label>Event title<input required value={form.title ?? ""} onChange={e=>setForm({...form,title:e.target.value})} placeholder="What happens?"/></label></div><label>Details<input value={form.detail ?? ""} onChange={e=>setForm({...form,detail:e.target.value})} placeholder="Context, location or participants"/></label><button className={styles.primaryButton}>Add event</button></form></>}
          {section === "characters" && <><div className={styles.panelHead}><div><div className={styles.kicker}>CAST & CONNECTIONS</div><h2>Character relationship map</h2><p>Add characters, then connect two people with a named relationship.</p></div><span className={styles.count}>{people.length} CHARACTERS</span></div><div className={styles.graphWrap}><svg viewBox="0 0 600 380" role="img" aria-label="Character relationship diagram">{(data!.relationships ?? []).map(edge=>{const a=nodes.find(n=>n.id===edge.from),b=nodes.find(n=>n.id===edge.to);return a&&b?<g key={edge.id}><line x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke="#a98c78" strokeWidth="2"/><text x={(a.x+b.x)/2} y={(a.y+b.y)/2-7} textAnchor="middle" fill="#735c56" fontSize="11">{edge.label}</text></g>:null;})}{nodes.map(node=><g key={node.id}><circle cx={node.x} cy={node.y} r="34" fill="#e8eee7" stroke="#617968" strokeWidth="2"/><text x={node.x} y={node.y+4} textAnchor="middle" fill="#30483a" fontSize="11">{node.name.length>11?node.name.slice(0,10)+"…":node.name}</text></g>)}</svg>{people.length===0&&<p className={styles.graphEmpty}>Add characters to begin the relationship map.</p>}</div><form className={styles.addForm} onSubmit={e=>{e.preventDefault();addItem("characters");}}><h3><Plus size={16}/> Add character</h3><div className={styles.formGrid}><label>Name<input required value={form.name??""} onChange={e=>setForm({...form,name:e.target.value})}/></label><label>Role<input value={form.role??""} onChange={e=>setForm({...form,role:e.target.value})} placeholder="Detective, suspect, witness..."/></label></div><label>Motivation<input value={form.motive??""} onChange={e=>setForm({...form,motive:e.target.value})}/></label><label>Secret / private knowledge<input value={form.secret??""} onChange={e=>setForm({...form,secret:e.target.value})}/></label><button className={styles.primaryButton}>Add character</button></form><form className={styles.addForm} onSubmit={e=>{e.preventDefault();if(relation.from&&relation.to&&relation.from!==relation.to&&relation.label.trim()){update({relationships:[...(data!.relationships??[]),{...relation,id:crypto.randomUUID()}]});setRelation({from:"",to:"",label:""});}}}><h3><Network size={16}/> Connect characters</h3><div className={styles.formGrid}><label>Person A<select value={relation.from} onChange={e=>setRelation({...relation,from:e.target.value})}><option value="">Choose character</option>{people.map(p=><option key={p.id} value={p.id}>{p.name}</option>)}</select></label><label>Person B<select value={relation.to} onChange={e=>setRelation({...relation,to:e.target.value})}><option value="">Choose character</option>{people.map(p=><option key={p.id} value={p.id}>{p.name}</option>)}</select></label></div><label>Relationship<input value={relation.label} onChange={e=>setRelation({...relation,label:e.target.value})} placeholder="Sibling, rival, former colleague..."/></label><button className={styles.primaryButton} disabled={people.length<2}>Add connection</button></form><div className={styles.beatList}>{(data!.relationships??[]).map(edge=><div className={styles.beat} key={edge.id}><div><h3>{people.find(p=>p.id===edge.from)?.name ?? "?"} — {edge.label} — {people.find(p=>p.id===edge.to)?.name ?? "?"}</h3></div><button onClick={()=>update({relationships:(data!.relationships??[]).filter(x=>x.id!==edge.id)})}><Trash2 size={14}/></button></div>)}</div></>}
          {section === "objects" && <><div className={styles.panelHead}><div><div className={styles.kicker}>OBJECT REGISTER</div><h2>Important objects</h2><p>Track fictional objects, who possesses them and why they matter.</p></div><span className={styles.count}>{(data!.objects??[]).length} OBJECTS</span></div><div className={styles.characterGrid}>{(data!.objects??[]).map(item=><article className={styles.character} key={item.id}><div className={styles.characterTop}><span>{item.owner || "OWNER NOT SET"}</span><button onClick={()=>update({objects:(data!.objects??[]).filter(x=>x.id!==item.id)})}><Trash2 size={14}/></button></div><h3>{item.name}</h3><p>{item.description}</p><p><b>Story significance:</b> {item.significance}</p></article>)}</div><form className={styles.addForm} onSubmit={e=>{e.preventDefault();addItem("objects");}}><h3><Plus size={16}/> Add important object</h3><label>Object name<input required value={form.name??""} onChange={e=>setForm({...form,name:e.target.value})} placeholder="Letter, key, photograph..."/></label><div className={styles.formGrid}><label>Current owner / holder<input value={form.owner??""} onChange={e=>setForm({...form,owner:e.target.value})}/></label><label>Description<input value={form.description??""} onChange={e=>setForm({...form,description:e.target.value})}/></label></div><label>Narrative significance<input value={form.significance??""} onChange={e=>setForm({...form,significance:e.target.value})} placeholder="Why is this object important?"/></label><button className={styles.primaryButton}>Add object</button></form></>}
          {section === "plot" && <><div className={styles.panelHead}><div><div className={styles.kicker}>NARRATIVE SEQUENCE</div><h2>Plot architecture</h2><p>Build the reader's journey from opening to resolution.</p></div></div><div className={styles.beatList}>{data!.beats.map((beat,index)=><article className={styles.beat} key={beat.id}><div className={styles.beatNumber}>{String(index+1).padStart(2,"0")}</div><div><span>{beat.act}</span><h3>{beat.title}</h3><p>{beat.purpose}</p></div><button onClick={()=>update({beats:data!.beats.filter(x=>x.id!==beat.id)})}><Trash2 size={14}/></button></article>)}</div><form className={styles.addForm} onSubmit={e=>{e.preventDefault();addItem("beats");}}><h3><Plus size={16}/> Add plot beat</h3><div className={styles.formGrid}><label>Title<input required value={form.title??""} onChange={e=>setForm({...form,title:e.target.value})}/></label><label>Stage<select value={form.act??"Investigation"} onChange={e=>setForm({...form,act:e.target.value})}>{["Opening","Disruption","Investigation","Complication","Turning point","Reveal","Resolution"].map(x=><option key={x}>{x}</option>)}</select></label></div><label>Purpose<input value={form.purpose??""} onChange={e=>setForm({...form,purpose:e.target.value})}/></label><button className={styles.primaryButton}>Add plot beat</button></form></>}
          {section === "clues" && <><div className={styles.panelHead}><div><div className={styles.kicker}>FAIR-PLAY DESIGN</div><h2>Clues & misdirection</h2><p>Plan placement and payoff for every fictional clue.</p></div></div><div className={styles.deviceList}>{data!.devices.map(item=><article className={styles.device} key={item.id}><div className={styles.deviceTop}><span className={styles.clueTag}>{item.kind.toUpperCase()}</span><button onClick={()=>update({devices:data!.devices.filter(x=>x.id!==item.id)})}><Trash2 size={14}/></button></div><h3>{item.clue}</h3><p><b>Placement:</b> {item.placement}</p><p><b>Payoff:</b> {item.payoff}</p></article>)}</div><form className={styles.addForm} onSubmit={e=>{e.preventDefault();addItem("devices");}}><h3><Plus size={16}/> Add mystery element</h3><label>Type<select value={form.kind??"clue"} onChange={e=>setForm({...form,kind:e.target.value})}><option value="clue">Clue</option><option value="misdirection">Misdirection / red herring</option><option value="reveal">Reveal detail</option></select></label><label>Element<input required value={form.clue??""} onChange={e=>setForm({...form,clue:e.target.value})}/></label><label>Placement<input value={form.placement??""} onChange={e=>setForm({...form,placement:e.target.value})}/></label><label>Payoff<input value={form.payoff??""} onChange={e=>setForm({...form,payoff:e.target.value})}/></label><button className={styles.primaryButton}>Add element</button></form></>}
          {section === "notes" && <><div className={styles.kicker}>PRIVATE WRITER'S NOTES</div><h2 className={styles.notesTitle}>Creative notebook</h2><textarea className={styles.longEditor} value={data!.notes} onChange={e=>update({notes:e.target.value})} placeholder="Draft ideas, questions, alternative endings..."/><div className={styles.saved}><Check size={14}/> Autosaved in this browser</div></>}
        </section>
      )}
      <footer className={styles.footer}>SLEUTHIVERSE · STORY WORKSHOP · SAVED LOCALLY IN THIS BROWSER.</footer>
    </main>
  );
}
