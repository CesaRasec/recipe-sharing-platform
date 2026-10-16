"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getAuthUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

function readString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function revalidateLikes(recipeId: string) {
  revalidatePath("/dashboard");
  revalidatePath("/recipes/mine");
  revalidatePath(`/recipes/${recipeId}`);
}

export async function toggleRecipeLike(formData: FormData) {
  const user = await getAuthUser();
  if (!user) {
    redirect("/");
  }

  const recipeId = readString(formData, "recipe_id");
  if (!recipeId) {
    return;
  }

  const supabase = await createClient();
  const { data: existing } = await supabase
    .from("recipe_likes")
    .select("id")
    .eq("recipe_id", recipeId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (existing) {
    await supabase
      .from("recipe_likes")
      .delete()
      .eq("id", existing.id)
      .eq("user_id", user.id);
  } else {
    const { error } = await supabase.from("recipe_likes").insert({
      user_id: user.id,
      recipe_id: recipeId,
    });

    if (error && error.code !== "23505") {
      return;
    }
  }

  revalidateLikes(recipeId);
}
