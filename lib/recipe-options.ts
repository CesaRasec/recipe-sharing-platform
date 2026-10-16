export const RECIPE_DIFFICULTIES = ["easy", "medium", "hard"] as const;

export type RecipeDifficulty = (typeof RECIPE_DIFFICULTIES)[number];

export type RecipeListFilters = {
  search?: string;
  category?: string;
  difficulty?: string;
};

export function isRecipeDifficulty(value: string): value is RecipeDifficulty {
  return RECIPE_DIFFICULTIES.includes(value as RecipeDifficulty);
}
