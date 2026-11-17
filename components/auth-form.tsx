"use client";

import { useActionState } from "react";
import type { AuthState } from "@/app/auth/actions";

type Props = {
  action: (state: AuthState, formData: FormData) => Promise<AuthState>;
  mode: "login" | "signup";
  resendAction?: (state: AuthState, formData: FormData) => Promise<AuthState>;
};

export function AuthForm({ action, mode, resendAction }: Props) {
  const [state, formAction, pending] = useActionState(action, {});
  const [resendState, resendFormAction, resendPending] = useActionState(resendAction ?? (async () => ({})), {});
  return (
    <form action={formAction} className="auth-form">
      {mode === "signup" && (
        <label>Display name<input name="displayName" type="text" autoComplete="nickname" required maxLength={32} placeholder="How should members know you?" /></label>
      )}
      <label>Email address<input name="email" type="email" autoComplete="email" required placeholder="you@example.com" /></label>
      <label>Password<input name="password" type="password" autoComplete={mode === "login" ? "current-password" : "new-password"} required minLength={8} placeholder="At least 8 characters" /></label>
      {state.error && <p className="auth-error" role="alert">{state.error}</p>}
      <button type="submit" disabled={pending}>{pending ? "Please wait..." : mode === "login" ? "Sign in" : "Create account"}</button>
      {mode === "login" && resendAction && (
        <div className="resend-confirmation">
          <p>Haven&apos;t confirmed your email yet?</p>
          <button type="submit" formAction={resendFormAction} disabled={resendPending} className="auth-secondary-button">
            {resendPending ? "Sending..." : "Resend confirmation email"}
          </button>
          {resendState.error && <p className="auth-error" role="alert">{resendState.error}</p>}
          {resendState.success && <p className="auth-success" role="status">{resendState.success}</p>}
        </div>
      )}
    </form>
  );
}
