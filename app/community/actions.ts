"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type CommunityState = { error?: string };

export async function createPost(_prev: CommunityState, formData: FormData): Promise<CommunityState> {
  const title = String(formData.get("title") ?? "").trim();
  const body = String(formData.get("body") ?? "").trim();
  const categoryId = String(formData.get("categoryId") ?? "");
  const spoiler = formData.get("spoiler") === "on";

  if (title.length < 3 || title.length > 180 || body.length < 1 || body.length > 20000) {
    return { error: "Add a title (3–180 characters) and a post (up to 20,000 characters)." };
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Sign in before starting a discussion." };

  const { error } = await supabase.from("posts").insert({
    author_id: user.id,
    category_id: categoryId || null,
    title,
    body,
    spoiler,
    status: "published",
  });

  if (error) return { error: "Your discussion could not be published. Please try again." };
  redirect("/community");
}

export async function addComment(_prev: CommunityState, formData: FormData): Promise<CommunityState> {
  const postId = String(formData.get("postId") ?? "");
  const body = String(formData.get("body") ?? "").trim();
  if (!postId || !body || body.length > 8000) return { error: "Write a comment of up to 8,000 characters." };

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Sign in to join the discussion." };

  const { error } = await supabase.from("comments").insert({ post_id: postId, author_id: user.id, body });
  if (error) return { error: "Your comment could not be added. Please try again." };
  redirect(`/community/${postId}`);
}
