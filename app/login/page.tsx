import Link from "next/link";
import { signIn, resendConfirmation } from "@/app/auth/actions";
import { AuthForm } from "@/components/auth-form";

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ message?: string }> }) {
  const { message } = await searchParams;
  return (
    <main className="auth-shell">
      <section className="auth-card">
        <Link href="/" className="auth-brand">SLEUTHIVERSE <span>/ THE SOCIETY</span></Link>
        <p className="auth-kicker">WELCOME BACK, INVESTIGATOR</p>
        <h1>Return to the <em>case files.</em></h1>
        <p className="auth-intro">Sign in to continue your discussions, investigations and creative work.</p>
        {message && <p className="auth-success">{message}</p>}
        <AuthForm action={signIn} mode="login" resendAction={resendConfirmation} />
        <p className="auth-switch">New to the society? <Link href="/signup">Create an account</Link></p>
      </section>
    </main>
  );
}
