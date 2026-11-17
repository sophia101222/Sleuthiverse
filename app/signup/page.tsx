import Link from "next/link";
import { signUp } from "@/app/auth/actions";
import { AuthForm } from "@/components/auth-form";

export default function SignupPage() {
  return (
    <main className="auth-shell">
      <section className="auth-card">
        <Link href="/" className="auth-brand">SLEUTHIVERSE <span>/ THE SOCIETY</span></Link>
        <p className="auth-kicker">MEMBERSHIP APPLICATION</p>
        <h1>Find your place in the <em>mystery.</em></h1>
        <p className="auth-intro">Create an account to save cases, share theories and build your own investigation desk.</p>
        <AuthForm action={signUp} mode="signup" />
        <p className="auth-switch">Already a member? <Link href="/login">Sign in</Link></p>
      </section>
    </main>
  );
}
