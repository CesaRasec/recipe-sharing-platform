import { isSupabaseConfigured } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";

export type RecipeLikeSummary = {
  count: number;
  liked: boolean;
};

const emptyLike: RecipeLikeSummary = { count: 0, liked: false };

export async function getRecipeLikes(
  recipeIds: string[],
  userId?: string | null,
): Promise<Record<string, RecipeLikeSummary>> {
  const summaries: Record<string, RecipeLikeSummary> = {};
  for (const id of recipeIds) {
    summaries[id] = { count: 0, liked: false };
  }

  if (recipeIds.length === 0 || !isSupabaseConfigured()) {
    return summaries;
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("recipe_likes")
    .select("recipe_id, user_id")
    .in("recipe_id", recipeIds);

  if (error || !data) {
    return summaries;
  }

  for (const row of data) {
    const current = summaries[row.recipe_id] ?? { count: 0, liked: false };
    current.count += 1;
    if (userId && row.user_id === userId) {
      current.liked = true;
    }
    summaries[row.recipe_id] = current;
  }

  return summaries;
}

export function likeSummaryFor(
  likes: Record<string, RecipeLikeSummary>,
  recipeId: string,
): RecipeLikeSummary {
  return likes[recipeId] ?? emptyLike;
}
