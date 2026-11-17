"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type ChallengeState = { error?: string };

export async function createChallenge(_prev: ChallengeState, formData: FormData): Promise<ChallengeState> {
  const title = String(formData.get("title") ?? "").trim();
  const premise = String(formData.get("premise") ?? "").trim();
  const answer = String(formData.get("answer") ?? "").trim();
  const category = String(formData.get("category") ?? "Other");
  const difficulty = String(formData.get("difficulty") ?? "Intermediate");

  if (title.length < 3 || title.length > 180 || premise.length < 20 || premise.length > 12000 || answer.length < 1 || answer.length > 12000) {
    return { error: "Add a title, a premise of at least 20 characters, and a solution." };
  }
  if (!["Beginner", "Intermediate", "Advanced"].includes(difficulty)) return { error: "Choose a valid difficulty." };

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Sign in to publish a case challenge." };

  const { data: challenge, error } = await supabase.from("challenges").insert({
    author_id: user.id, title, premise, category, difficulty, status: "published",
  }).select("id").single();

  if (error || !challenge) return { error: "The challenge could not be published. Please try again." };

  const { error: answerError } = await supabase.from("challenge_answers").insert({
    challenge_id: challenge.id, answer,
  });
  if (answerError) {
    await supabase.from("challenges").delete().eq("id", challenge.id);
    return { error: "The case was not published because its private solution could not be saved." };
  }
  redirect("/challenges");
}

export async function submitTheory(_prev: ChallengeState, formData: FormData): Promise<ChallengeState> {
  const challengeId = String(formData.get("challengeId") ?? "");
  const body = String(formData.get("body") ?? "").trim();
  const visibility = String(formData.get("visibility") ?? "private");
  if (!challengeId || !body || body.length > 12000 || !["private", "public"].includes(visibility)) return { error: "Check your theory and try again." };

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Sign in to submit a theory." };

  const { error } = await supabase.from("theories").insert({
    challenge_id: challengeId, author_id: user.id, body, visibility,
  });
  if (error) return { error: "Your theory could not be saved. Please try again." };
  redirect(`/challenges/${challengeId}`);
}
