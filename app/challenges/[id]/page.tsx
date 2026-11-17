import Link from "next/link";
import { notFound } from "next/navigation";
import { submitTheory } from "../actions";
import { createClient } from "@/lib/supabase/server";

export default async function ChallengeDetailPage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ error?: string }> }) {
  const { error: message } = await searchParams;
  const { id } = await params;
  const supabase = await createClient();
  const [{ data: { user } }, { data: challenge }, { data: theories }, { data: officialAnswer }] = await Promise.all([
    supabase.auth.getUser(),
    supabase.from("challenges").select("id,title,premise,category,difficulty,created_at,author_id,profiles(display_name)").eq("id", id).maybeSingle(),
    supabase.from("theories").select("id,author_id,body,visibility,created_at,profiles(display_name)").eq("challenge_id", id).order("created_at", { ascending: false }),
    supabase.from("challenge_answers").select("answer").eq("challenge_id", id).maybeSingle(),
  ]);
  if (!challenge) notFound();
  const visibleTheories = (theories ?? []).filter((theory: any) => theory.visibility === "public" || theory.author_id === user?.id);

  return (
    <main className="product-page">
      <header className="product-topbar"><Link href="/" className="auth-brand">SLEUTHIVERSE <span>/ THE SOCIETY</span></Link><nav><Link href="/challenges">All cases</Link><Link href="/community">Community</Link></nav></header>
      <div className="product-content narrow-content">
        <Link href="/challenges" className="back-link">← Back to case room</Link>
        <article className="post-detail challenge-detail">
          <div className="product-eyebrow">{challenge.category} / {challenge.difficulty}</div>
          <h1>{challenge.title}</h1>
          <p className="detail-body">{challenge.premise}</p>
          <div className="post-byline">Case opened by {challenge.profiles?.[0]?.display_name ?? "Investigator"} · {new Date(challenge.created_at).toLocaleDateString()}</div>
          {user?.id === challenge.author_id && officialAnswer?.answer && <details className="spoiler-block author-answer"><summary>Your private official solution</summary><p>{officialAnswer.answer}</p></details>}
        </article>
        {message && <p className="product-error">{message}</p>}
        <section className="comments-section">
          <h2>Your deduction</h2>
          {user ? <form action={submitTheory} className="compose-card"><input type="hidden" name="challengeId" value={id}/><label>Record your theory<textarea name="body" required maxLength={12000} rows={6} placeholder="Explain which clues support your conclusion and how they fit together..." /></label><label>Visibility<select name="visibility" defaultValue="private"><option value="private">Private — only I can see this</option><option value="public">Public — share with the society</option></select></label><button className="product-primary" type="submit">Save deduction</button></form> : <div className="signin-prompt"><Link href="/login">Sign in</Link> to save your deduction.</div>}
          <div className="feed-heading"><h2>Shared deductions</h2><span>{visibleTheories.filter((t: any) => t.visibility === "public").length} PUBLIC</span></div>
          {visibleTheories.filter((t: any) => t.visibility === "public" || t.author_id === user?.id).map((theory: any) => <article className="comment-card" key={theory.id}><div className="post-meta"><span>{theory.visibility === "public" ? "SHARED THEORY" : "YOUR PRIVATE NOTE"}</span><span>{new Date(theory.created_at).toLocaleDateString()}</span></div><p>{theory.body}</p><small>{theory.profiles?.[0]?.display_name ?? "Investigator"}</small></article>)}
        </section>
      </div>
    </main>
  );
}
