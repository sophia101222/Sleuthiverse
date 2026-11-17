import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(new URL("/dashboard", requestUrl.origin));
    }
  }

  return NextResponse.redirect(
    new URL("/login?message=The%20confirmation%20link%20could%20not%20be%20verified.%20Please%20try%20again.", requestUrl.origin),
  );
}
