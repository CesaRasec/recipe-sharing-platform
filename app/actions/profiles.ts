"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getAuthUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

export type ProfileFormState = {
  error: string | null;
  message: string | null;
};

function readString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

export async function updateProfile(
  _prevState: ProfileFormState,
  formData: FormData,
): Promise<ProfileFormState> {
  const user = await getAuthUser();
  if (!user) {
    redirect("/");
  }

  const username = readString(formData, "username");
  const fullName = readString(formData, "full_name");
  const bio = readString(formData, "bio");

  if (!username || !fullName) {
    return { error: "Username and full name are required.", message: null };
  }

  if (username.length > 40 || fullName.length > 80) {
    return { error: "Username or full name is too long.", message: null };
  }

  if (bio.length > 500) {
    return { error: "Bio must be 500 characters or fewer.", message: null };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("profiles")
    .update({
      username,
      full_name: fullName,
      bio: bio || null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", user.id);

  if (error) {
    if (error.message.toLowerCase().includes("duplicate") || error.code === "23505") {
      return { error: "That username is already taken.", message: null };
    }
    return { error: error.message, message: null };
  }

  await supabase.auth.updateUser({
    data: {
      username,
      full_name: fullName,
    },
  });

  revalidatePath("/", "layout");
  revalidatePath("/profile");
  revalidatePath("/dashboard");

  return { error: null, message: "Profile saved." };
}
