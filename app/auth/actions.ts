"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type AuthState = { error?: string; success?: string };

export async function signIn(_prev: AuthState, formData: FormData): Promise<AuthState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  if (!email || !password) return { error: "Enter your email and password." };

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    if (error.message.toLowerCase().includes("email not confirmed")) {
      return { error: "Your email address has not been confirmed yet. Use the button below to resend the confirmation email." };
    }
    return { error: "We couldn't sign you in. Check your email and password, then try again." };
  }

  redirect("/dashboard");
}

export async function resendConfirmation(_prev: AuthState, formData: FormData): Promise<AuthState> {
  const email = String(formData.get("email") ?? "").trim();
  if (!email) return { error: "Enter your email address first." };

  const supabase = await createClient();
  const { error } = await supabase.auth.resend({
    type: "signup",
    email,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"}/auth/callback`,
    },
  });

  if (error) return { error: "We couldn't resend the email right now. Please wait a little and try again." };
  return { success: "If this account still needs confirmation, a new email has been sent. Check your inbox and spam folder." };
}

export async function signUp(_prev: AuthState, formData: FormData): Promise<AuthState> {
  const displayName = String(formData.get("displayName") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!displayName || !email || password.length < 8) {
    return { error: "Add a display name, a valid email, and a password of at least 8 characters." };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { display_name: displayName },
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"}/auth/callback`,
    },
  });

  if (error) return { error: "We couldn't create your account. Check the details and try again." };
  if (data.session) redirect("/dashboard");
  redirect("/login?message=Check%20your%20email%20to%20confirm%20your%20account.");
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}
