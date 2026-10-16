import { isSupabaseConfigured } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";

export type RecipeCommentItem = {
  id: string;
  recipeId: string;
  userId: string;
  author: string;
  body: string;
  createdAt: string;
  updatedAt: string;
  edited: boolean;
};

type CommentQueryRow = {
  id: string;
  recipe_id: string;
  user_id: string;
  body: string;
  created_at: string;
  updated_at: string;
  profiles:
    | {
        username: string;
        full_name: string;
      }
    | {
        username: string;
        full_name: string;
      }[]
    | null;
};

function profileName(profiles: CommentQueryRow["profiles"]): string {
  const profile = Array.isArray(profiles) ? profiles[0] : profiles;
  return profile?.full_name || profile?.username || "Unknown cook";
}

export async function getRecipeComments(recipeId: string): Promise<{
  comments: RecipeCommentItem[];
  error: string | null;
}> {
  if (!isSupabaseConfigured()) {
    return { comments: [], error: "Supabase is not configured." };
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("comments")
    .select(
      "id, recipe_id, user_id, body, created_at, updated_at, profiles!user_id ( username, full_name )",
    )
    .eq("recipe_id", recipeId)
    .order("created_at", { ascending: true });

  if (error) {
    return { comments: [], error: error.message };
  }

  return {
    comments: ((data ?? []) as CommentQueryRow[]).map((row) => {
      const createdAt = row.created_at;
      const updatedAt = row.updated_at;
      return {
        id: row.id,
        recipeId: row.recipe_id,
        userId: row.user_id,
        author: profileName(row.profiles),
        body: row.body,
        createdAt,
        updatedAt,
        edited: Boolean(updatedAt && createdAt && updatedAt > createdAt),
      };
    }),
    error: null,
  };
}
