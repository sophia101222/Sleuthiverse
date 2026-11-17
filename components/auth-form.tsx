"use client";

import { useActionState } from "react";
import type { AuthState } from "@/app/auth/actions";

type Props = {
  action: (state: AuthState, formData: FormData) => Promise<AuthState>;
  mode: "login" | "signup";
};

export function AuthForm({ action, mode }: Props) {
  const [state, formAction, pending] = useActionState(action, {});
  return (
    <form action={formAction} className="auth-form">
      {mode === "signup" && (
        <label>Display name<input name="displayName" type="text" autoComplete="nickname" required maxLength={32} placeholder="How should members know you?" /></label>
      )}
      <label>Email address<input name="email" type="email" autoComplete="email" required placeholder="you@example.com" /></label>
      <label>Password<input name="password" type="password" autoComplete={mode === "login" ? "current-password" : "new-password"} required minLength={8} placeholder="At least 8 characters" /></label>
      {state.error && <p className="auth-error" role="alert">{state.error}</p>}
      <button type="submit" disabled={pending}>{pending ? "Please wait..." : mode === "login" ? "Sign in" : "Create account"}</button>
    </form>
  );
}
