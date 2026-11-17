import Link from "next/link";
import { redirect } from "next/navigation";
import { signOut } from "@/app/auth/actions";
import { createClient } from "@/lib/supabase/server";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const displayName = user.user_metadata?.display_name || user.email?.split("@")[0] || "Investigator";

  return (
    <main className="member-shell">
      <header className="member-topbar">
        <Link href="/" className="auth-brand">SLEUTHIVERSE <span>/ THE SOCIETY</span></Link>
        <form action={signOut}><button className="signout-button">Sign out</button></form>
      </header>
      <section className="member-content">
        <p className="auth-kicker">PRIVATE MEMBER AREA</p>
        <h1>Welcome back, <em>{displayName}.</em></h1>
        <p>Your membership is active. This is the foundation of your personal Sleuthiverse workspace.</p>
        <div className="member-grid">
          <article><span>01 / YOUR PROFILE</span><h2>Member profile</h2><p>Your account is connected. Profile editing and public member pages are next.</p></article>
          <article><span>02 / CASE FILES</span><h2>Saved investigations</h2><p>Case bookmarks and personal notes will appear here once the case room is connected.</p></article>
          <article><span>03 / YOUR DESK</span><h2>Creative workspace</h2><p>Your private timelines, character records and clue notebooks will live here.</p></article>
        </div>
        <Link href="/" className="back-home">Return to the society →</Link>
      </section>
    </main>
  );
}
