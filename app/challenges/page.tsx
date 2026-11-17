import Link from "next/link";
import { createChallenge } from "./actions";
import { createClient } from "@/lib/supabase/server";

export default async function ChallengesPage() {
  const supabase = await createClient();
  const [{ data: { user } }, { data: challenges }] = await Promise.all([
    supabase.auth.getUser(),
    supabase.from("challenges").select("id,title,premise,category,difficulty,created_at,profiles(display_name)").eq("status", "published").order("created_at", { ascending: false }).limit(40),
  ]);

  return (
    <main className="product-page">
      <header className="product-topbar"><Link href="/" className="auth-brand">SLEUTHIVERSE <span>/ THE SOCIETY</span></Link><nav><Link href="/community">Community</Link><Link href="/dashboard">{user ? "My desk" : "Sign in"}</Link></nav></header>
      <div className="product-content">
        <div className="product-eyebrow">THE CASE ROOM / MYSTERY CHALLENGES</div>
        <h1>Every clue has a <em>story.</em></h1>
        <p className="product-lead">Solve fictional mysteries, compare deductions and publish your own fair-play cases. Solutions remain private from solvers.</p>
        {user ? (
          <details className="compose-disclosure"><summary>Publish a new challenge</summary>
            <form action={createChallenge} className="compose-card">
              <label>Case title<input name="title" required minLength={3} maxLength={180} placeholder="A title that invites a closer look" /></label>
              <label>Category<input name="category" maxLength={60} defaultValue="Classic clues" /></label>
              <label>Difficulty<select name="difficulty" defaultValue="Intermediate"><option>Beginner</option><option>Intermediate</option><option>Advanced</option></select></label>
              <label>Case premise<textarea name="premise" required minLength={20} maxLength={12000} rows={7} placeholder="Describe the fictional setting, characters, timeline and clues. Keep it solvable from the information provided." /></label>
              <label>Official solution (only you can read this)<textarea name="answer" required maxLength={12000} rows={4} placeholder="Explain the solution and how the clues support it." /></label>
              <button className="product-primary" type="submit">Publish case</button>
            </form>
          </details>
        ) : <div className="signin-prompt">Have a mystery to share? <Link href="/login">Sign in</Link> or <Link href="/signup">create an account</Link>.</div>}
        <div className="feed-heading"><h2>Open cases</h2><span>{challenges?.length ?? 0} CASES</span></div>
        <div className="challenge-feed">
          {(challenges ?? []).map((item: any) => <article className="challenge-card" key={item.id}>
            <div className="post-meta"><span>{item.category}</span><span>{item.difficulty}</span></div>
            <h3><Link href={`/challenges/${item.id}`}>{item.title}</Link></h3>
            <p>{item.premise}</p>
            <div className="post-byline">Created by {item.profiles?.display_name ?? "Investigator"} · {new Date(item.created_at).toLocaleDateString()}</div>
          </article>)}
          {(challenges ?? []).length === 0 && <div className="empty-feed">No published challenges yet. Be the first to open a case.</div>}
        </div>
      </div>
    </main>
  );
}
