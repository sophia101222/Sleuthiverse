"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, BookOpen, CalendarClock, Check, ClipboardList, FilePlus2, Fingerprint, Lightbulb, Plus, RotateCcw, Trash2, Users } from "lucide-react";
import styles from "./desk.module.css";

type EventItem = { id: string; time: string; title: string; detail: string };
type Person = { id: string; name: string; role: string; notes: string };
type Clue = { id: string; title: string; source: string; interpretation: string; status: "open" | "verified" | "question" };
type DeskData = { events: EventItem[]; people: Person[]; clues: Clue[]; notes: string };

const starter: DeskData = {
  events: [
    { id: "e1", time: "18:00", title: "Guests arrive", detail: "All four guests are welcomed into the house." },
    { id: "e2", time: "19:15", title: "The lights go out", detail: "A brief power interruption is reported by everyone." },
    { id: "e3", time: "19:40", title: "The study is discovered", detail: "The host is found missing from the gathering; the study door is locked." },
  ],
  people: [
    { id: "p1", name: "Evelyn Ashford", role: "House guest", notes: "Claims to have remained in the drawing room after dinner." },
    { id: "p2", name: "Dr. Rowan Bell", role: "Family friend", notes: "Says the clocks stopped during the power interruption." },
    { id: "p3", name: "Arthur Finch", role: "Secretary", notes: "Was the last person to speak with the host." },
  ],
  clues: [
    { id: "c1", title: "Three different clock times", source: "Hall, study and kitchen clocks", interpretation: "Establish which clock, if any, is reliable.", status: "open" },
    { id: "c2", title: "A damp envelope", source: "On the desk", interpretation: "Its presence may help establish when the study was last visited.", status: "question" },
    { id: "c3", title: "A torn guest list", source: "Drawing-room wastebasket", interpretation: "Compare the names with the arrival accounts.", status: "verified" },
  ],
  notes: "Working theory:\nThe timeline may be more useful than any single statement. Keep observed facts separate from interpretations.\n\nQuestions to test:\n- Which clock was checked most recently?\n- Do the guests agree on the order of events?",
};

type Tab = "timeline" | "people" | "clues" | "notes";

export default function InvestigationDeskPage() {
  const [data, setData] = useState<DeskData>(starter);
  const [tab, setTab] = useState<Tab>("timeline");
  const [ready, setReady] = useState(false);
  const [eventForm, setEventForm] = useState({ time: "", title: "", detail: "" });
  const [personForm, setPersonForm] = useState({ name: "", role: "", notes: "" });
  const [clueForm, setClueForm] = useState({ title: "", source: "", interpretation: "" });

  useEffect(() => {
    try {
      const saved = localStorage.getItem("sleuthiverse-investigation-desk-v1");
      if (saved) setData({ ...starter, ...JSON.parse(saved) });
    } catch { /* Ignore invalid local demo data and keep the sample case. */ }
    setReady(true);
  }, []);

  useEffect(() => {
    if (ready) localStorage.setItem("sleuthiverse-investigation-desk-v1", JSON.stringify(data));
  }, [data, ready]);

  const sortedEvents = useMemo(() => [...data.events].sort((a, b) => a.time.localeCompare(b.time)), [data.events]);
  const update = (key: keyof DeskData, value: DeskData[keyof DeskData]) => setData(current => ({ ...current, [key]: value }));

  function addEvent(e: React.FormEvent) {
    e.preventDefault();
    if (!eventForm.title.trim()) return;
    update("events", [...data.events, { ...eventForm, id: crypto.randomUUID() }]);
    setEventForm({ time: "", title: "", detail: "" });
  }
  function addPerson(e: React.FormEvent) {
    e.preventDefault();
    if (!personForm.name.trim()) return;
    update("people", [...data.people, { ...personForm, id: crypto.randomUUID() }]);
    setPersonForm({ name: "", role: "", notes: "" });
  }
  function addClue(e: React.FormEvent) {
    e.preventDefault();
    if (!clueForm.title.trim()) return;
    update("clues", [...data.clues, { ...clueForm, id: crypto.randomUUID(), status: "open" }]);
    setClueForm({ title: "", source: "", interpretation: "" });
  }
  function reset() {
    if (window.confirm("Restore the sample case? Your current demo notes will be replaced.")) setData(starter);
  }

  const tabs: { id: Tab; label: string; icon: typeof CalendarClock }[] = [
    { id: "timeline", label: "Timeline", icon: CalendarClock },
    { id: "people", label: "People", icon: Users },
    { id: "clues", label: "Clue board", icon: Lightbulb },
    { id: "notes", label: "Notebook", icon: ClipboardList },
  ];

  return (
    <main className={styles.shell}>
      <header className={styles.header}>
        <Link href="/" className={styles.brand}><Fingerprint size={23}/> SLEUTHIVERSE <span>/ THE SOCIETY</span></Link>
        <div className={styles.headerRight}><span className={styles.guest}><i/> GUEST MODE</span><Link href="/" className={styles.back}><ArrowLeft size={15}/> Society home</Link></div>
      </header>
      <section className={styles.intro}>
        <div className={styles.kicker}>PRIVATE WORKSPACE · DEMO CASE 001</div>
        <h1>The <em>investigation</em> desk.</h1>
        <p>A working space for fictional cases. Organise events, keep track of people, and separate evidence from interpretation.</p>
        <div className={styles.caseMeta}><span>CASE FILE / 001</span><b>THE ASHFORD HOUSE MYSTERY</b><span>LOCAL DEMO DATA</span></div>
      </section>
      <section className={styles.workspace}>
        <aside className={styles.side}>
          <div className={styles.sideTitle}>CASE MATERIALS</div>
          {tabs.map(({ id, label, icon: Icon }) => <button key={id} onClick={() => setTab(id)} className={tab === id ? styles.activeTab : styles.tab}><Icon size={17}/>{label}<span>{id === "timeline" ? data.events.length : id === "people" ? data.people.length : id === "clues" ? data.clues.length : "✎"}</span></button>)}
          <div className={styles.sideHint}><BookOpen size={16}/><p>Demo data is saved in this browser only. It is not published or shared.</p></div>
          <button className={styles.reset} onClick={reset}><RotateCcw size={14}/> Restore sample case</button>
        </aside>
        <div className={styles.panel}>
          {tab === "timeline" && <>
            <div className={styles.panelHead}><div><div className={styles.kicker}>SEQUENCE OF EVENTS</div><h2>Case timeline</h2><p>Record what happened and when. Sort by time to spot gaps.</p></div><span className={styles.count}>{data.events.length} EVENTS</span></div>
            <div className={styles.timeline}>{sortedEvents.map((item) => <article className={styles.event} key={item.id}><div className={styles.time}>{item.time || "—"}</div><div className={styles.eventLine}><i/></div><div className={styles.eventBody}><h3>{item.title}</h3><p>{item.detail}</p><button aria-label="Delete event" onClick={() => update("events", data.events.filter(x => x.id !== item.id))}><Trash2 size={14}/></button></div></article>)}</div>
            <form className={styles.addForm} onSubmit={addEvent}><h3><FilePlus2 size={16}/> Add an event</h3><div className={styles.formGrid}><label>Time<input type="time" value={eventForm.time} onChange={e=>setEventForm({...eventForm,time:e.target.value})}/></label><label>Event title<input required value={eventForm.title} onChange={e=>setEventForm({...eventForm,title:e.target.value})} placeholder="What happened?"/></label></div><label>Details<input value={eventForm.detail} onChange={e=>setEventForm({...eventForm,detail:e.target.value})} placeholder="Source, witness or context"/></label><button className={styles.addButton}><Plus size={15}/> Add to timeline</button></form>
          </>}
          {tab === "people" && <>
            <div className={styles.panelHead}><div><div className={styles.kicker}>PERSON INDEX</div><h2>People & statements</h2><p>Keep character information and attributed statements in one place.</p></div><span className={styles.count}>{data.people.length} RECORDS</span></div>
            <div className={styles.peopleGrid}>{data.people.map(person=><article className={styles.person} key={person.id}><div className={styles.personIcon}><Users size={18}/></div><div><span>{person.role || "UNSPECIFIED ROLE"}</span><h3>{person.name}</h3><p>{person.notes || "No notes yet."}</p></div><button aria-label="Delete person" onClick={()=>update("people",data.people.filter(x=>x.id!==person.id))}><Trash2 size={14}/></button></article>)}</div>
            <form className={styles.addForm} onSubmit={addPerson}><h3><Plus size={16}/> Add a person</h3><div className={styles.formGrid}><label>Name<input required value={personForm.name} onChange={e=>setPersonForm({...personForm,name:e.target.value})} placeholder="Character name"/></label><label>Role<input value={personForm.role} onChange={e=>setPersonForm({...personForm,role:e.target.value})} placeholder="Witness, guest, detective..."/></label></div><label>Notes / statements<input value={personForm.notes} onChange={e=>setPersonForm({...personForm,notes:e.target.value})} placeholder="Record attributed information"/></label><button className={styles.addButton}><Plus size={15}/> Add person</button></form>
          </>}
          {tab === "clues" && <>
            <div className={styles.panelHead}><div><div className={styles.kicker}>EVIDENCE REGISTER</div><h2>Clue board</h2><p>Track observations separately from your current interpretation.</p></div><span className={styles.count}>{data.clues.length} CLUES</span></div>
            <div className={styles.clueList}>{data.clues.map(clue=><article className={styles.clue} key={clue.id}><div className={styles.clueTop}><span>CLUE / {clue.id.slice(0,5).toUpperCase()}</span><select aria-label="Clue status" value={clue.status} onChange={e=>update("clues",data.clues.map(x=>x.id===clue.id?{...x,status:e.target.value as Clue["status"]}:x))}><option value="open">Open</option><option value="question">Needs review</option><option value="verified">Verified observation</option></select><button aria-label="Delete clue" onClick={()=>update("clues",data.clues.filter(x=>x.id!==clue.id))}><Trash2 size={14}/></button></div><h3>{clue.title}</h3><p><b>Source:</b> {clue.source || "Not recorded"}</p><p><b>Interpretation:</b> {clue.interpretation || "Not recorded"}</p></article>)}</div>
            <form className={styles.addForm} onSubmit={addClue}><h3><Plus size={16}/> Register a clue</h3><label>Observation<input required value={clueForm.title} onChange={e=>setClueForm({...clueForm,title:e.target.value})} placeholder="What was noticed?"/></label><label>Source<input value={clueForm.source} onChange={e=>setClueForm({...clueForm,source:e.target.value})} placeholder="Where did it come from?"/></label><label>Interpretation<input value={clueForm.interpretation} onChange={e=>setClueForm({...clueForm,interpretation:e.target.value})} placeholder="What might it mean?"/></label><button className={styles.addButton}><Plus size={15}/> Add clue</button></form>
          </>}
          {tab === "notes" && <div className={styles.notesPanel}><div className={styles.kicker}>PRIVATE FIELD NOTES</div><h2>Investigator&apos;s notebook</h2><p>Draft theories, questions and connections. Label speculation clearly.</p><textarea value={data.notes} onChange={e=>update("notes",e.target.value)} placeholder="Start writing your notes..."/><div className={styles.saved}><Check size={14}/> Autosaved in this browser</div></div>}
        </div>
      </section>
      <footer className={styles.footer}>SLEUTHIVERSE · A UNIVERSE OF CLUES, CASES & CURIOUS MINDS.</footer>
    </main>
  );
}
