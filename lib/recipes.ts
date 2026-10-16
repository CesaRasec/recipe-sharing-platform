import {
  isRecipeDifficulty,
  type RecipeListFilters,
} from "@/lib/recipe-options";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";

export type { RecipeListFilters } from "@/lib/recipe-options";
export {
  isRecipeDifficulty,
  RECIPE_DIFFICULTIES,
} from "@/lib/recipe-options";

export type RecipeCard = {
  id: string;
  title: string;
  author: string;
  cookingTime: string;
  difficulty: string;
  category: string;
  imageUrl: string | null;
};

export type RecipeDetail = RecipeCard & {
  userId: string;
  ingredients: string[];
  instructions: string;
  cookingTimeMinutes: number;
};

type RecipeQueryRow = {
  id: string;
  user_id: string;
  title: string;
  cooking_time: number | string;
  difficulty: string;
  category: string;
  image_url?: string | null;
  ingredients?: string[] | string | null;
  instructions?: string | null;
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

const recipeSelect =
  "id, user_id, title, cooking_time, difficulty, category, image_url, ingredients, instructions, profiles!user_id ( username, full_name )";

function profileName(profiles: RecipeQueryRow["profiles"]): string {
  const profile = Array.isArray(profiles) ? profiles[0] : profiles;
  return profile?.full_name || profile?.username || "Unknown cook";
}

export function formatCookingTime(value: number | string) {
  const minutes = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(minutes)) {
    return String(value);
  }
  return `${minutes} min`;
}

export function cookingTimeMinutes(value: number | string) {
  const minutes = typeof value === "number" ? value : Number(value);
  return Number.isFinite(minutes) ? minutes : 1;
}

export function toIngredientList(value: unknown) {
  if (Array.isArray(value)) {
    return value
      .map((item) => (typeof item === "string" ? item.trim() : ""))
      .filter(Boolean);
  }

  if (typeof value === "string") {
    return value
      .split(/\r?\n|,/)
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return [];
}

function toCard(recipe: RecipeQueryRow): RecipeCard {
  return {
    id: recipe.id,
    title: recipe.title,
    author: profileName(recipe.profiles),
    cookingTime: formatCookingTime(recipe.cooking_time),
    difficulty: recipe.difficulty,
    category: recipe.category,
    imageUrl: recipe.image_url ?? null,
  };
}

function toIlikePattern(raw: string) {
  const cleaned = raw.replace(/[%_,.()]/g, " ").replace(/\s+/g, " ").trim();
  if (!cleaned) {
    return null;
  }
  return `%${cleaned}%`;
}

async function fetchRecipes(filter: {
  equalsUserId?: string;
  notEqualsUserId?: string;
  search?: string;
  category?: string;
  difficulty?: string;
}): Promise<{
  recipes: RecipeCard[];
  error: string | null;
  configured: boolean;
}> {
  if (!isSupabaseConfigured()) {
    return { recipes: [], error: null, configured: false };
  }

  const supabase = await createClient();
  let query = supabase
    .from("recipes")
    .select(
      "id, user_id, title, cooking_time, difficulty, category, image_url, profiles!user_id ( username, full_name )",
    )
    .order("created_at", { ascending: false });

  if (filter.equalsUserId) {
    query = query.eq("user_id", filter.equalsUserId);
  }
  if (filter.notEqualsUserId) {
    query = query.neq("user_id", filter.notEqualsUserId);
  }

  const pattern = filter.search ? toIlikePattern(filter.search) : null;
  if (pattern) {
    query = query.or(
      `title.ilike.${pattern},category.ilike.${pattern},instructions.ilike.${pattern}`,
    );
  }

  const category = filter.category?.trim();
  if (category) {
    query = query.eq("category", category);
  }

  const difficulty = filter.difficulty?.trim().toLowerCase();
  if (difficulty && isRecipeDifficulty(difficulty)) {
    query = query.eq("difficulty", difficulty);
  }

  const { data, error } = await query;

  if (error) {
    return { recipes: [], error: error.message, configured: true };
  }

  return {
    recipes: ((data ?? []) as RecipeQueryRow[]).map(toCard),
    error: null,
    configured: true,
  };
}

export async function getCommunityRecipes(
  userId: string,
  filters: RecipeListFilters = {},
) {
  return fetchRecipes({ notEqualsUserId: userId, ...filters });
}

export async function getMyRecipes(
  userId: string,
  filters: RecipeListFilters = {},
) {
  return fetchRecipes({ equalsUserId: userId, ...filters });
}

export async function getRecipeCategories(): Promise<string[]> {
  if (!isSupabaseConfigured()) {
    return [];
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("recipes")
    .select("category")
    .order("category", { ascending: true });

  if (error || !data) {
    return [];
  }

  return [
    ...new Set(
      data
        .map((row) => row.category?.trim())
        .filter((category): category is string => Boolean(category)),
    ),
  ];
}

export async function getRecipeById(id: string): Promise<{
  recipe: RecipeDetail | null;
  error: string | null;
}> {
  if (!isSupabaseConfigured()) {
    return { recipe: null, error: "Supabase is not configured." };
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("recipes")
    .select(recipeSelect)
    .eq("id", id)
    .maybeSingle();

  if (error) {
    return { recipe: null, error: error.message };
  }

  if (!data) {
    return { recipe: null, error: null };
  }

  const row = data as RecipeQueryRow;
  return {
    recipe: {
      ...toCard(row),
      userId: row.user_id,
      ingredients: toIngredientList(row.ingredients),
      instructions: row.instructions?.trim() || "No instructions yet.",
      cookingTimeMinutes: cookingTimeMinutes(row.cooking_time),
    },
    error: null,
  };
}
