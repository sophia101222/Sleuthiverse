import Link from "next/link";
import { redirect } from "next/navigation";
import { createPost } from "./actions";
import { createClient } from "@/lib/supabase/server";

export default async function CommunityPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const { error: message } = await searchParams;
  const supabase = await createClient();
  const [{ data: { user } }, { data: categories }, { data: posts, error }] = await Promise.all([
    supabase.auth.getUser(),
    supabase.from("categories").select("id,name").order("sort_order"),
    supabase.from("posts")
      .select("id,title,body,spoiler,created_at,profiles(display_name),categories(name)")
      .eq("status", "published")
      .order("created_at", { ascending: false })
      .limit(40),
  ]);

  return (
    <main className="product-page">
      <header className="product-topbar">
        <Link href="/" className="auth-brand">SLEUTHIVERSE <span>/ THE SOCIETY</span></Link>
        <nav><Link href="/challenges">Case challenges</Link><Link href="/dashboard">{user ? "My desk" : "Sign in"}</Link></nav>
      </header>
      <div className="product-content">
        <div className="product-eyebrow">THE READING ROOM / COMMUNITY</div>
        <h1>Ideas are better <em>shared.</em></h1>
        <p className="product-lead">Discuss detective fiction, compare interpretations and exchange theories. Mark spoilers so other readers can enjoy the reveal at their own pace.</p>

        {message && <p className="product-error">{message}</p>}
        {user ? (
          <form action={createPost} className="compose-card">
            <h2>Start a conversation</h2>
            <label>Title<input name="title" required minLength={3} maxLength={180} placeholder="What would you like to discuss?" /></label>
            <label>Category<select name="categoryId" defaultValue=""><option value="">General discussion</option>{(categories ?? []).map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</select></label>
            <label>Your post<textarea name="body" required maxLength={20000} rows={5} placeholder="Share your question, interpretation or theory..." /></label>
            <label className="inline-check"><input type="checkbox" name="spoiler" /> This post contains spoilers</label>
            <button className="product-primary" type="submit">Publish discussion</button>
          </form>
        ) : (
          <div className="signin-prompt">Want to start a discussion? <Link href="/login">Sign in</Link> or <Link href="/signup">create an account</Link>.</div>
        )}

        <div className="feed-heading"><h2>Recent discussions</h2><span>{posts?.length ?? 0} POSTS</span></div>
        {error && <p className="product-error">The discussion feed could not be loaded. Please refresh and try again.</p>}
        <div className="post-feed">
          {(posts ?? []).map((post: any) => (
            <article className="post-card" key={post.id}>
              <div className="post-meta"><span>{post.categories?.[0]?.name ?? "General discussion"}</span><span>{new Date(post.created_at).toLocaleDateString("en-CA", { month: "short", day: "numeric" })}</span></div>
              <h3><Link href={`/community/${post.id}`}>{post.title}</Link></h3>
              {post.spoiler ? <details className="spoiler-block"><summary>Spoiler content — reveal</summary><p>{post.body}</p></details> : <p>{post.body}</p>}
              <div className="post-byline">Posted by {post.profiles?.[0]?.display_name ?? "Investigator"}</div>
            </article>
          ))}
          {!error && (posts ?? []).length === 0 && <div className="empty-feed">No discussions yet. Start the first conversation.</div>}
        </div>
      </div>
    </main>
  );
}
