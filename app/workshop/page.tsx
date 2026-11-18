"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, BookOpen, Check, Feather, Fingerprint, Lightbulb, Network, Plus, ScrollText, Trash2, WandSparkles, X } from "lucide-react";
import styles from "./workshop.module.css";

type Character = { id: string; name: string; role: string; motive: string; secret: string };
type Beat = { id: string; title: string; act: string; purpose: string };
type Device = { id: string; clue: string; placement: string; payoff: string; kind: "clue" | "misdirection" | "reveal" };
type StoryData = { world: string; premise: string; characters: Character[]; beats: Beat[]; devices: Device[]; notes: string };
type StoryProject = { id: string; title: string; genre: string; updatedAt: string; data: StoryData };
type Tab = "world" | "characters" | "plot" | "mystery" | "notes";

const blankData = (): StoryData => ({ world: "", premise: "", characters: [], beats: [], devices: [], notes: "" });
const sample: StoryProject = { id: "sample-story", title: "The Glasshouse Paradox", genre: "Classic detective mystery", updatedAt: "Sample project", data: { world: "SETTING\nA secluded botanical estate in the late autumn. The glasshouse is the centre of the property and a symbol of the family's carefully maintained public image.\n\nWORLD RULES\n- The estate has a small household and a fixed guest list.\n- The story takes place over one evening.\n- All important locations are introduced before the central incident.", premise: "During a private gathering, the family archivist announces that a long-lost document will change the inheritance. By morning, the document has vanished and every guest has a different account of the evening.", characters: [{ id: "sc1", name: "Iris Vale", role: "Amateur investigator", motive: "Wants to protect the archive", secret: "Recognised a detail in the document earlier" }, { id: "sc2", name: "Edmund Grey", role: "Estate heir", motive: "Fears losing his position", secret: "Has concealed an old family letter" }], beats: [{ id: "b1", title: "The announcement", act: "Opening", purpose: "Establish the document, the guests and competing interests." }, { id: "b2", title: "The missing page", act: "Disruption", purpose: "Introduce the central question and conflicting accounts." }, { id: "b3", title: "The overlooked detail", act: "Investigation", purpose: "Revisit an early detail with a new interpretation." }, { id: "b4", title: "The explanation", act: "Reveal", purpose: "Resolve the timeline and explain the document's disappearance." }], devices: [{ id: "d1", clue: "A pressed flower inside the archive book", placement: "Mentioned casually in the opening scene", payoff: "Connects two locations and establishes who handled the book", kind: "clue" }, { id: "d2", clue: "A guest gives an overly precise description", placement: "During the first round of interviews", payoff: "The detail is based on an assumption rather than direct observation", kind: "misdirection" }], notes: "DESIGN QUESTIONS\n- What does the reader know at each stage?\n- Which facts are objective, and which are character interpretations?\n- Does the final explanation account for every major clue?" } };
const makeProject = (title: string, genre: string): StoryProject => ({ id: crypto.randomUUID(), title, genre, updatedAt: new Date().toLocaleString(), data: blankData() });

export default function StoryWorkshopPage() {
  const [projects, setProjects] = useState<StoryProject[]>([sample]);
  const [selectedId, setSelectedId] = useState(sample.id);
  const [tab, setTab] = useState<Tab>("world");
  const [ready, setReady] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [title, setTitle] = useState("");
  const [genre, setGenre] = useState("Classic detective mystery");
  const [characterForm, setCharacterForm] = useState({ name: "", role: "", motive: "", secret: "" });
  const [beatForm, setBeatForm] = useState({ title: "", act: "Investigation", purpose: "" });
  const [deviceForm, setDeviceForm] = useState({ clue: "", placement: "", payoff: "", kind: "clue" as Device["kind"] });

  useEffect(() => {
    try {
      const saved = localStorage.getItem("sleuthiverse-story-projects-v1");
      if (saved) {
        const parsed = JSON.parse(saved) as { projects: StoryProject[]; selectedId: string };
        if (Array.isArray(parsed.projects) && parsed.projects.length) {
          setProjects(parsed.projects);
          setSelectedId(parsed.projects.some(item => item.id === parsed.selectedId) ? parsed.selectedId : parsed.projects[0].id);
        }
      }
    } catch { /* Keep the sample project if local data is invalid. */ }
    setReady(true);
  }, []);
  useEffect(() => { if (ready) localStorage.setItem("sleuthiverse-story-projects-v1", JSON.stringify({ projects, selectedId })); }, [projects, selectedId, ready]);

  const project = projects.find(item => item.id === selectedId) ?? projects[0];
  const data = project.data;
  const update = (patch: Partial<StoryData>) => setProjects(current => current.map(item => item.id === selectedId ? { ...item, data: { ...item.data, ...patch }, updatedAt: new Date().toLocaleString() } : item));

  function createProject(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    const next = makeProject(title.trim(), genre);
    setProjects(current => [...current, next]);
    setSelectedId(next.id);
    setTab("world");
    setTitle("");
    setShowCreate(false);
  }
  function deleteProject() {
    if (projects.length === 1) { window.alert("Keep at least one story project. Create another before deleting this one."); return; }
    if (!window.confirm("Delete this story project and all its contents? This cannot be undone.")) return;
    const next = projects.filter(item => item.id !== selectedId);
    setProjects(next);
    setSelectedId(next[0].id);
  }
  function addCharacter(e: React.FormEvent) {
    e.preventDefault();
    if (!characterForm.name.trim()) return;
    update({ characters: [...data.characters, { ...characterForm, id: crypto.randomUUID() }] });
    setCharacterForm({ name: "", role: "", motive: "", secret: "" });
  }
  function addBeat(e: React.FormEvent) {
    e.preventDefault();
    if (!beatForm.title.trim()) return;
    update({ beats: [...data.beats, { ...beatForm, id: crypto.randomUUID() }] });
    setBeatForm({ title: "", act: "Investigation", purpose: "" });
  }
  function addDevice(e: React.FormEvent) {
    e.preventDefault();
    if (!deviceForm.clue.trim()) return;
    update({ devices: [...data.devices, { ...deviceForm, id: crypto.randomUUID() }] });
    setDeviceForm({ clue: "", placement: "", payoff: "", kind: "clue" });
  }

  const tabs: { id: Tab; label: string; icon: typeof BookOpen }[] = [
    { id: "world", label: "World bible", icon: BookOpen },
    { id: "characters", label: "Characters", icon: Network },
    { id: "plot", label: "Plot structure", icon: ScrollText },
    { id: "mystery", label: "Clue & trick design", icon: Lightbulb },
    { id: "notes", label: "Writer's notes", icon: Feather },
  ];

  return (
    <main className={styles.shell}>
      <header className={styles.header}>
        <Link href="/tools" className={styles.brand}><Fingerprint size={23}/> SLEUTHIVERSE <span>/ STORY WORKSHOP</span></Link>
        <div className={styles.headerRight}><span className={styles.guest}><i/> GUEST MODE</span><Link href="/tools" className={styles.back}><ArrowLeft size={15}/> All tools</Link></div>
      </header>
      <section className={styles.intro}>
        <div className={styles.kicker}>IMAGINE · DESIGN · CONSTRUCT</div>
        <h1>The <em>story</em> workshop.</h1>
        <p>Build an original mystery from its foundations. Develop a coherent world, a purposeful cast, a fair sequence of clues and a satisfying explanation.</p>
      </section>
      <section className={styles.projectBar}>
        <div><span className={styles.kicker}>YOUR STORY PROJECTS</span><strong>{projects.length} SAVED {projects.length === 1 ? "PROJECT" : "PROJECTS"}</strong></div>
        <div className={styles.projectActions}><select aria-label="Open saved story project" value={selectedId} onChange={e=>setSelectedId(e.target.value)}>{projects.map(item=><option key={item.id} value={item.id}>{item.title}</option>)}</select><button onClick={()=>setShowCreate(true)}><Plus size={15}/> New story</button><button className={styles.deleteProject} onClick={deleteProject} aria-label="Delete current story"><Trash2 size={14}/></button></div>
      </section>
      {showCreate && <div className={styles.createOverlay}><form className={styles.createDialog} onSubmit={createProject}><button type="button" className={styles.closeDialog} onClick={()=>setShowCreate(false)}><X size={17}/></button><div className={styles.kicker}>NEW CREATIVE PROJECT</div><h2>Start a story</h2><label>Project title<input autoFocus required value={title} onChange={e=>setTitle(e.target.value)} placeholder="Give your story a working title"/></label><label>Genre<select value={genre} onChange={e=>setGenre(e.target.value)}><option>Classic detective mystery</option><option>Locked-room mystery</option><option>Psychological mystery</option><option>Cozy mystery</option><option>Historical mystery</option><option>Other fiction</option></select></label><button className={styles.primaryButton}><Plus size={15}/> Create and open</button></form></div>}
      <section className={styles.projectHeading}><div><span>ACTIVE STORY / {project.genre.toUpperCase()}</span><h2>{project.title}</h2><p>Changes are saved automatically in this browser · Last edited: {project.updatedAt}</p></div><span className={styles.saved}><Check size={14}/> LOCAL AUTOSAVE</span></section>
      <section className={styles.workspace}>
        <aside className={styles.side}><div className={styles.sideTitle}>STORY BLUEPRINT</div>{tabs.map(({id,label,icon:Icon})=><button key={id} onClick={()=>setTab(id)} className={tab===id?styles.activeTab:styles.tab}><Icon size={17}/>{label}<span>{id==="characters"?data.characters.length:id==="plot"?data.beats.length:id==="mystery"?data.devices.length:"✎"}</span></button>)}<div className={styles.sideHint}><WandSparkles size={16}/><p>Use this space for fictional narrative design. Keep the story&apos;s internal rules and clues consistent.</p></div></aside>
        <div className={styles.panel}>
          {tab==="world" && <><div className={styles.panelHead}><div><div className={styles.kicker}>FOUNDATIONS & CONTEXT</div><h2>World bible</h2><p>Define the setting, constraints and premise before designing the mystery.</p></div></div><label className={styles.editorLabel}>STORY PREMISE<textarea className={styles.shortEditor} value={data.premise} onChange={e=>update({premise:e.target.value})} placeholder="What is the central situation? What question drives the story?"/></label><label className={styles.editorLabel}>SETTING, WORLD RULES & BACKGROUND<textarea className={styles.longEditor} value={data.world} onChange={e=>update({world:e.target.value})} placeholder="Place, period, social context, geography, important locations, rules of the fictional world..."/></label><div className={styles.hint}><BookOpen size={15}/> A useful world bible records only details that affect the story, its characters or what is possible within the fictional setting.</div></>}
          {tab==="characters" && <><div className={styles.panelHead}><div><div className={styles.kicker}>CAST & MOTIVATION</div><h2>Character architecture</h2><p>Design what each character wants, what they know and how they relate to the central mystery.</p></div><span className={styles.count}>{data.characters.length} CHARACTERS</span></div><div className={styles.characterGrid}>{data.characters.map(person=><article className={styles.character} key={person.id}><div className={styles.characterTop}><span>{person.role||"CHARACTER"}</span><button aria-label="Delete character" onClick={()=>update({characters:data.characters.filter(x=>x.id!==person.id)})}><Trash2 size={14}/></button></div><h3>{person.name}</h3><p><b>Wants:</b> {person.motive||"Not defined"}</p><p><b>Secret / private knowledge:</b> {person.secret||"Not defined"}</p></article>)}</div><form className={styles.addForm} onSubmit={addCharacter}><h3><Plus size={16}/> Add a character</h3><div className={styles.formGrid}><label>Name<input required value={characterForm.name} onChange={e=>setCharacterForm({...characterForm,name:e.target.value})} placeholder="Character name"/></label><label>Story role<input value={characterForm.role} onChange={e=>setCharacterForm({...characterForm,role:e.target.value})} placeholder="Detective, suspect, witness..."/></label></div><label>Motivation<input value={characterForm.motive} onChange={e=>setCharacterForm({...characterForm,motive:e.target.value})} placeholder="What do they want?"/></label><label>Secret / private knowledge<input value={characterForm.secret} onChange={e=>setCharacterForm({...characterForm,secret:e.target.value})} placeholder="What are they hiding or misunderstanding?"/></label><button className={styles.primaryButton}><Plus size={15}/> Add character</button></form></>}
          {tab==="plot" && <><div className={styles.panelHead}><div><div className={styles.kicker}>NARRATIVE SEQUENCE</div><h2>Plot architecture</h2><p>Build the reader&apos;s journey from the opening situation to the final explanation.</p></div><span className={styles.count}>{data.beats.length} BEATS</span></div><div className={styles.beatList}>{data.beats.map((beat,index)=><article className={styles.beat} key={beat.id}><div className={styles.beatNumber}>{String(index+1).padStart(2,"0")}</div><div><span>{beat.act}</span><h3>{beat.title}</h3><p>{beat.purpose}</p></div><button aria-label="Delete plot beat" onClick={()=>update({beats:data.beats.filter(x=>x.id!==beat.id)})}><Trash2 size={14}/></button></article>)}</div><form className={styles.addForm} onSubmit={addBeat}><h3><Plus size={16}/> Add a plot beat</h3><div className={styles.formGrid}><label>Beat title<input required value={beatForm.title} onChange={e=>setBeatForm({...beatForm,title:e.target.value})} placeholder="e.g. The first contradiction"/></label><label>Story stage<select value={beatForm.act} onChange={e=>setBeatForm({...beatForm,act:e.target.value})}><option>Opening</option><option>Disruption</option><option>Investigation</option><option>Complication</option><option>Turning point</option><option>Reveal</option><option>Resolution</option></select></label></div><label>Narrative purpose<input value={beatForm.purpose} onChange={e=>setBeatForm({...beatForm,purpose:e.target.value})} placeholder="What should this moment establish or change?"/></label><button className={styles.primaryButton}><Plus size={15}/> Add plot beat</button></form></>}
          {tab==="mystery" && <><div className={styles.panelHead}><div><div className={styles.kicker}>FAIR-PLAY DESIGN</div><h2>Clues & misdirection</h2><p>Plan what the reader sees, when they see it and how it pays off in the final explanation.</p></div><span className={styles.count}>{data.devices.length} ELEMENTS</span></div><div className={styles.deviceList}>{data.devices.map(item=><article className={styles.device} key={item.id}><div className={styles.deviceTop}><span className={item.kind==="clue"?styles.clueTag:item.kind==="misdirection"?styles.misdirectTag:styles.revealTag}>{item.kind==="clue"?"CLUE":item.kind==="misdirection"?"MISDIRECTION":"REVEAL"}</span><button aria-label="Delete mystery element" onClick={()=>update({devices:data.devices.filter(x=>x.id!==item.id)})}><Trash2 size={14}/></button></div><h3>{item.clue}</h3><p><b>Placement:</b> {item.placement||"Not planned"}</p><p><b>Payoff:</b> {item.payoff||"Not planned"}</p></article>)}</div><form className={styles.addForm} onSubmit={addDevice}><h3><Plus size={16}/> Add a mystery element</h3><label>Element<select value={deviceForm.kind} onChange={e=>setDeviceForm({...deviceForm,kind:e.target.value as Device["kind"]})}><option value="clue">Clue</option><option value="misdirection">Misdirection / red herring</option><option value="reveal">Final reveal detail</option></select></label><label>What is it?<input required value={deviceForm.clue} onChange={e=>setDeviceForm({...deviceForm,clue:e.target.value})} placeholder="Describe the fictional clue or detail"/></label><label>Where does it appear?<input value={deviceForm.placement} onChange={e=>setDeviceForm({...deviceForm,placement:e.target.value})} placeholder="Scene, chapter or moment"/></label><label>How does it pay off?<input value={deviceForm.payoff} onChange={e=>setDeviceForm({...deviceForm,payoff:e.target.value})} placeholder="How will the reader reinterpret it?"/></label><button className={styles.primaryButton}><Plus size={15}/> Add to design board</button></form><div className={styles.hint}><Lightbulb size={15}/> Aim for clues that are visible before the reveal and an explanation that accounts for the important facts without relying on arbitrary new information.</div></>}
          {tab==="notes" && <div className={styles.notesPanel}><div className={styles.kicker}>PRIVATE WRITER&apos;S NOTES</div><h2>Creative notebook</h2><p>Keep loose ideas, research questions and revisions in one place.</p><textarea value={data.notes} onChange={e=>update({notes:e.target.value})} placeholder="Draft ideas, questions, alternative endings..."/><div className={styles.saved}><Check size={14}/> Autosaved in this browser</div></div>}
        </div>
      </section>
      <footer className={styles.footer}>SLEUTHIVERSE · STORY WORKSHOP · A UNIVERSE OF CLUES, CASES & CURIOUS MINDS.</footer>
    </main>
  );
}
