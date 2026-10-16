import type { User } from "@supabase/supabase-js";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";
import type { Profile } from "@/lib/supabase/types";

function fallbackUsername(user: User) {
  if (typeof user.user_metadata.username === "string" && user.user_metadata.username.trim()) {
    return user.user_metadata.username.trim();
  }
  return user.email?.split("@")[0] || "cook";
}

function fallbackFullName(user: User) {
  if (typeof user.user_metadata.full_name === "string" && user.user_metadata.full_name.trim()) {
    return user.user_metadata.full_name.trim();
  }
  return fallbackUsername(user);
}

export async function getCurrentProfile(user: User): Promise<{
  profile: Profile | null;
  error: string | null;
}> {
  if (!isSupabaseConfigured()) {
    return { profile: null, error: "Supabase is not configured." };
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("id, username, full_name, created_at, updated_at, email, bio")
    .eq("id", user.id)
    .maybeSingle();

  if (error) {
    return { profile: null, error: error.message };
  }

  if (data) {
    return { profile: data, error: null };
  }

  const created = {
    id: user.id,
    username: fallbackUsername(user),
    full_name: fallbackFullName(user),
    email: user.email ?? "",
    bio: "",
  };

  const { data: inserted, error: insertError } = await supabase
    .from("profiles")
    .upsert(created, { onConflict: "id" })
    .select("id, username, full_name, created_at, updated_at, email, bio")
    .single();

  if (insertError) {
    return { profile: null, error: insertError.message };
  }

  return { profile: inserted, error: null };
}
