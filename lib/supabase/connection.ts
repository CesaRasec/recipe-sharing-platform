import { isSupabaseConfigured } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";

export type SupabaseConnectionTest = {
  configured: boolean;
  ok: boolean;
  message: string;
};

export async function testSupabaseConnection(): Promise<SupabaseConnectionTest> {
  if (!isSupabaseConfigured()) {
    return {
      configured: false,
      ok: false,
      message:
        "Supabase env vars were not found. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY (or the publishable key) to .env, then restart npm run dev.",
    };
  }

  try {
    const supabase = await createClient();
    const { error, count } = await supabase
      .from("recipes")
      .select("id", { count: "exact", head: true });

    if (error) {
      return {
        configured: true,
        ok: false,
        message: `Reached Supabase, but the recipes query failed: ${error.message}`,
      };
    }

    const recipeCount = count ?? 0;
    return {
      configured: true,
      ok: true,
      message:
        recipeCount === 0
          ? "Connected to Supabase. The recipes table is reachable and currently empty."
          : `Connected to Supabase. Found ${recipeCount} recipe${recipeCount === 1 ? "" : "s"}.`,
    };
  } catch (error) {
    const detail =
      error instanceof Error ? error.message : "Unknown connection error";
    return {
      configured: true,
      ok: false,
      message: `Could not create a Supabase client: ${detail}`,
    };
  }
}
