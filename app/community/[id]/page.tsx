import Link from "next/link";
import { notFound } from "next/navigation";
import { addComment } from "../actions";
import { createClient } from "@/lib/supabase/server";

type DiscussionComment = { id: string; body: string; created_at: string; parent_id: string | null; profiles?: { display_name: string }[] };

export default async function DiscussionDetailPage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ error?: string }> }) {
  const { error: message } = await searchParams;
  const { id } = await params;
  const supabase = await createClient();
  const [{ data: { user } }, { data: post }, { data: comments }] = await Promise.all([
    supabase.auth.getUser(),
    supabase.from("posts").select("id,title,body,spoiler,created_at,profiles(display_name),categories(name)").eq("id", id).maybeSingle(),
    supabase.from("comments").select("id,body,created_at,parent_id,profiles(display_name)").eq("post_id", id).order("created_at", { ascending: true }),
  ]);
  if (!post) notFound();

  return (
    <main className="product-page">
      <header className="product-topbar"><Link href="/" className="auth-brand">SLEUTHIVERSE <span>/ THE SOCIETY</span></Link><nav><Link href="/community">All discussions</Link><Link href="/challenges">Case challenges</Link></nav></header>
      <div className="product-content narrow-content">
        <Link href="/community" className="back-link">← Back to the reading room</Link>
        <article className="post-detail">
          <div className="product-eyebrow">{post.categories?.[0]?.name ?? "GENERAL DISCUSSION"}</div>
          <h1>{post.title}</h1>
          {post.spoiler ? <details className="spoiler-block" open><summary>Spoiler content</summary><p>{post.body}</p></details> : <p className="detail-body">{post.body}</p>}
          <div className="post-byline">Posted by {post.profiles?.[0]?.display_name ?? "Investigator"} · {new Date(post.created_at).toLocaleString()}</div>
        </article>
        {message && <p className="product-error">{message}</p>}
        <section className="comments-section">
          <h2>Discussion <span>{comments?.length ?? 0}</span></h2>
          {((comments ?? []) as DiscussionComment[]).map((comment) => <article className="comment-card" key={comment.id}><p>{comment.body}</p><small>{comment.profiles?.[0]?.display_name ?? "Investigator"} · {new Date(comment.created_at).toLocaleString()}</small></article>)}
          {user ? <form action={addComment} className="compose-card"><input type="hidden" name="postId" value={id}/><label>Add your perspective<textarea name="body" rows={4} maxLength={8000} required placeholder="Keep it thoughtful and mark spoilers in the main post..." /></label><button className="product-primary" type="submit">Add comment</button></form> : <div className="signin-prompt"><Link href="/login">Sign in</Link> to join the discussion.</div>}
        </section>
      </div>
    </main>
  );
}
