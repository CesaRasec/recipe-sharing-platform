import { isSupabaseConfigured } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";

export type RecipeCard = {
  id: string;
  title: string;
  author: string;
  cookingTime: string;
  difficulty: string;
  category: string;
};

type RecipeQueryRow = {
  id: string;
  title: string;
  cooking_time: string;
  difficulty: string;
  category: string;
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

function profileName(
  profiles: RecipeQueryRow["profiles"],
): string {
  const profile = Array.isArray(profiles) ? profiles[0] : profiles;
  return profile?.full_name || profile?.username || "Unknown cook";
}

export async function getLatestRecipes(): Promise<{
  recipes: RecipeCard[];
  error: string | null;
  configured: boolean;
}> {
  if (!isSupabaseConfigured()) {
    return { recipes: [], error: null, configured: false };
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("recipes")
    .select(
      "id, title, cooking_time, difficulty, category, profiles!user_id ( username, full_name )",
    )
    .order("created_at", { ascending: false });

  if (error) {
    return { recipes: [], error: error.message, configured: true };
  }

  const recipes = ((data ?? []) as RecipeQueryRow[]).map((recipe) => ({
    id: recipe.id,
    title: recipe.title,
    author: profileName(recipe.profiles),
    cookingTime: recipe.cooking_time,
    difficulty: recipe.difficulty,
    category: recipe.category,
  }));

  return { recipes, error: null, configured: true };
}
