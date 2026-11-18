"use client";

import Link from "next/link";
import { ArrowRight, BookOpen, Clock3, Feather, FileSearch, Fingerprint, Library, Network, PenTool, ShieldCheck, Sparkles, Users } from "lucide-react";
import styles from "./tools.module.css";

const groups = [
  {
    eyebrow: "READ · ANALYSE · DEDUCE",
    title: "Investigation Desk",
    description: "Work with an existing novel, fictional case or mystery challenge. Organise what the text gives you, then build and test your interpretation.",
    href: "/desk",
    action: "Open investigation desk",
    tone: "green",
    tools: [
      ["Timeline", "Arrange events and compare accounts.", Clock3],
      ["Character records", "Track roles, statements and connections.", Users],
      ["Clue register", "Separate observations from interpretations.", FileSearch],
      ["Deduction notebook", "Keep hypotheses and unanswered questions.", BookOpen],
    ],
  },
  {
    eyebrow: "IMAGINE · DESIGN · CONSTRUCT",
    title: "Story Workshop",
    description: "Build an original mystery from the ground up. Develop its setting, cast, relationships, plot structure, clue placement and solution logic.",
    href: "/workshop",
    action: "Open story workshop",
    tone: "wine",
    tools: [
      ["World bible", "Record setting, rules, history and atmosphere.", Library],
      ["Character web", "Design roles, motives and relationships.", Network],
      ["Plot architecture", "Plan chronology, turning points and reveals.", PenTool],
      ["Mystery design", "Track clues, red herrings and the final explanation.", Sparkles],
    ],
  },
];

export default function ToolsPage() {
  return (
    <main className={styles.shell}>
      <header className={styles.header}>
        <Link href="/" className={styles.brand}><Fingerprint size={23}/> SLEUTHIVERSE <span>/ THE SOCIETY</span></Link>
        <nav><Link href="/">Society home</Link><Link href="/community">Community</Link><Link href="/challenges">Case room</Link></nav>
      </header>
      <section className={styles.hero}>
        <div className={styles.eyebrow}>THE SOCIETY TOOLROOM · PRIVATE WORKSPACES</div>
        <h1>Two ways to follow<br/>a <em>thread.</em></h1>
        <p>Study the mysteries that already exist, or create one of your own. Each workspace has its own tools and saves multiple projects in this browser.</p>
      </section>
      <section className={styles.groups}>
        {groups.map((group, index) => (
          <article className={`${styles.group} ${styles[group.tone]}`} key={group.title}>
            <div className={styles.groupTop}><span>0{index + 1} / WORKSPACE</span><span>{group.eyebrow}</span></div>
            <div className={styles.groupMain}>
              <div><div className={styles.groupIcon}>{index === 0 ? <FileSearch size={25}/> : <Feather size={25}/>}</div><h2>{group.title}</h2><p>{group.description}</p><Link href={group.href} className={styles.action}>{group.action} <ArrowRight size={16}/></Link></div>
              <div className={styles.toolList}>{group.tools.map(([name, detail, Icon]) => { const ToolIcon = Icon as typeof Clock3; return <div className={styles.tool} key={name as string}><ToolIcon size={17}/><div><strong>{name as string}</strong><span>{detail as string}</span></div></div>; })}</div>
            </div>
          </article>
        ))}
      </section>
      <section className={styles.note}><ShieldCheck size={18}/><p><strong>Your work stays yours.</strong> Guest projects are saved locally in this browser. Sign-in and cloud sync can be connected later, without blocking the tools.</p></section>
      <footer className={styles.footer}>SLEUTHIVERSE · A UNIVERSE OF CLUES, CASES & CURIOUS MINDS.</footer>
    </main>
  );
}
