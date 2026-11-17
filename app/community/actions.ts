"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function createPost(formData: FormData): Promise<void> {
  const title = String(formData.get("title") ?? "").trim();
  const body = String(formData.get("body") ?? "").trim();
  const categoryId = String(formData.get("categoryId") ?? "");
  const spoiler = formData.get("spoiler") === "on";

  if (title.length < 3 || title.length > 180 || body.length < 1 || body.length > 20000) {
    redirect("/community?error=Please%20check%20the%20title%20and%20post%20length.");
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { error } = await supabase.from("posts").insert({
    author_id: user.id,
    category_id: categoryId || null,
    title,
    body,
    spoiler,
    status: "published",
  });

  if (error) redirect("/community?error=Your%20discussion%20could%20not%20be%20published.");
  redirect("/community");
}

export async function addComment(formData: FormData): Promise<void> {
  const postId = String(formData.get("postId") ?? "");
  const body = String(formData.get("body") ?? "").trim();
  if (!postId || !body || body.length > 8000) {
    redirect(`/community/${postId}?error=Write%20a%20comment%20of%20up%20to%208%2C000%20characters.`);
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { error } = await supabase.from("comments").insert({ post_id: postId, author_id: user.id, body });
  if (error) redirect(`/community/${postId}?error=Your%20comment%20could%20not%20be%20added.`);
  redirect(`/community/${postId}`);
}
