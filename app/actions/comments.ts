"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getAuthUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

export type CommentFormState = {
  error: string | null;
  resetKey: number;
};

const maxCommentLength = 2000;

function readString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function revalidateComments(recipeId: string) {
  revalidatePath(`/recipes/${recipeId}`);
}

export async function createComment(
  _prevState: CommentFormState,
  formData: FormData,
): Promise<CommentFormState> {
  const user = await getAuthUser();
  if (!user) {
    redirect("/");
  }

  const recipeId = readString(formData, "recipe_id");
  const body = readString(formData, "body");

  if (!recipeId) {
    return { error: "Missing recipe.", resetKey: 0 };
  }

  if (!body) {
    return { error: "Write a comment before posting.", resetKey: 0 };
  }

  if (body.length > maxCommentLength) {
    return {
      error: `Comments must be ${maxCommentLength} characters or fewer.`,
      resetKey: 0,
    };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("comments").insert({
    user_id: user.id,
    recipe_id: recipeId,
    body,
  });

  if (error) {
    return { error: error.message, resetKey: 0 };
  }

  revalidateComments(recipeId);
  return { error: null, resetKey: Date.now() };
}

export async function updateComment(
  _prevState: CommentFormState,
  formData: FormData,
): Promise<CommentFormState> {
  const user = await getAuthUser();
  if (!user) {
    redirect("/");
  }

  const commentId = readString(formData, "id");
  const recipeId = readString(formData, "recipe_id");
  const body = readString(formData, "body");

  if (!commentId || !recipeId) {
    return { error: "Missing comment.", resetKey: 0 };
  }

  if (!body) {
    return { error: "Write a comment before saving.", resetKey: 0 };
  }

  if (body.length > maxCommentLength) {
    return {
      error: `Comments must be ${maxCommentLength} characters or fewer.`,
      resetKey: 0,
    };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("comments")
    .update({ body })
    .eq("id", commentId)
    .eq("user_id", user.id);

  if (error) {
    return { error: error.message, resetKey: 0 };
  }

  revalidateComments(recipeId);
  return { error: null, resetKey: Date.now() };
}

export async function deleteComment(formData: FormData) {
  const user = await getAuthUser();
  if (!user) {
    redirect("/");
  }

  const commentId = readString(formData, "id");
  const recipeId = readString(formData, "recipe_id");
  if (!commentId || !recipeId) {
    return;
  }

  const supabase = await createClient();
  await supabase.from("comments").delete().eq("id", commentId);

  revalidateComments(recipeId);
}
