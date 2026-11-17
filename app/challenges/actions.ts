"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function createChallenge(formData: FormData): Promise<void> {
  const title = String(formData.get("title") ?? "").trim();
  const premise = String(formData.get("premise") ?? "").trim();
  const answer = String(formData.get("answer") ?? "").trim();
  const category = String(formData.get("category") ?? "Other");
  const difficulty = String(formData.get("difficulty") ?? "Intermediate");

  if (title.length < 3 || title.length > 180 || premise.length < 20 || premise.length > 12000 || answer.length < 1 || answer.length > 12000) {
    redirect("/challenges?error=Please%20check%20the%20case%20title%2C%20premise%20and%20solution.");
  }
  if (!["Beginner", "Intermediate", "Advanced"].includes(difficulty)) {
    redirect("/challenges?error=Choose%20a%20valid%20difficulty.");
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: challenge, error } = await supabase.from("challenges").insert({
    author_id: user.id, title, premise, category, difficulty, status: "published",
  }).select("id").single();

  if (error || !challenge) redirect("/challenges?error=The%20challenge%20could%20not%20be%20published.");

  const { error: answerError } = await supabase.from("challenge_answers").insert({
    challenge_id: challenge.id, answer,
  });
  if (answerError) {
    await supabase.from("challenges").delete().eq("id", challenge.id);
    redirect("/challenges?error=The%20private%20solution%20could%20not%20be%20saved.");
  }
  redirect("/challenges");
}

export async function submitTheory(formData: FormData): Promise<void> {
  const challengeId = String(formData.get("challengeId") ?? "");
  const body = String(formData.get("body") ?? "").trim();
  const visibility = String(formData.get("visibility") ?? "private");
  if (!challengeId || !body || body.length > 12000 || !["private", "public"].includes(visibility)) {
    redirect(`/challenges/${challengeId}?error=Check%20your%20theory%20and%20try%20again.`);
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { error } = await supabase.from("theories").insert({
    challenge_id: challengeId, author_id: user.id, body, visibility,
  });
  if (error) redirect(`/challenges/${challengeId}?error=Your%20theory%20could%20not%20be%20saved.`);
  redirect(`/challenges/${challengeId}`);
}
