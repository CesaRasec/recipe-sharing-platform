"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getRequestOrigin } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

export type AuthFormState = {
  error: string | null;
  message: string | null;
};

function readString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function emailPrefix(email: string) {
  return email.split("@")[0] || "cook";
}

async function ensureProfile(input: {
  id: string;
  email: string;
  username: string;
  fullName: string;
}) {
  const supabase = await createClient();
  const { error } = await supabase.from("profiles").upsert(
    {
      id: input.id,
      username: input.username,
      full_name: input.fullName,
      email: input.email,
      bio: "",
    },
    { onConflict: "id" },
  );

  if (error && !error.message.toLowerCase().includes("duplicate")) {
    return error.message;
  }

  return null;
}

export async function signUp(
  _prevState: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const email = readString(formData, "email");
  const password = readString(formData, "password");
  const username = readString(formData, "username");
  const fullName = readString(formData, "full_name");

  if (!email || !password || !username || !fullName) {
    return { error: "Please fill in all fields.", message: null };
  }

  if (password.length < 6) {
    return {
      error: "Password must be at least 6 characters.",
      message: null,
    };
  }

  const supabase = await createClient();
  const origin = await getRequestOrigin();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        username,
        full_name: fullName,
      },
      emailRedirectTo: `${origin}/auth/callback`,
    },
  });

  if (error) {
    return { error: error.message, message: null };
  }

  if (data.user?.identities && data.user.identities.length === 0) {
    return {
      error: "An account with this email already exists. Try signing in.",
      message: null,
    };
  }

  if (data.session && data.user) {
    const profileError = await ensureProfile({
      id: data.user.id,
      email,
      username,
      fullName,
    });
    if (profileError) {
      return { error: profileError, message: null };
    }

    revalidatePath("/", "layout");
    redirect("/dashboard");
  }

  return {
    error: null,
    message: "Check your email to confirm your account, then sign in.",
  };
}

export async function signIn(
  _prevState: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const email = readString(formData, "email");
  const password = readString(formData, "password");

  if (!email || !password) {
    return { error: "Please enter your email and password.", message: null };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: error.message, message: null };
  }

  if (data.user) {
    const username =
      (typeof data.user.user_metadata.username === "string" &&
        data.user.user_metadata.username) ||
      emailPrefix(email);
    const fullName =
      (typeof data.user.user_metadata.full_name === "string" &&
        data.user.user_metadata.full_name) ||
      username;

    await ensureProfile({
      id: data.user.id,
      email: data.user.email ?? email,
      username,
      fullName,
    });
  }

  revalidatePath("/", "layout");
  redirect("/dashboard");
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/");
}
