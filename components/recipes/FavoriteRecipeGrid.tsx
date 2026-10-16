import { RecipeCard } from "@/components/RecipeCard";
import { getRecipeLikes, likeSummaryFor } from "@/lib/likes";
import { getLikedRecipes } from "@/lib/recipes";

export async function FavoriteRecipeGrid({ userId }: { userId: string }) {
  const { recipes, error } = await getLikedRecipes(userId);
  const likes = await getRecipeLikes(
    recipes.map((recipe) => recipe.id),
    userId,
  );

  if (error) {
    return (
      <p className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
        Could not load favorites: {error}
      </p>
    );
  }

  if (recipes.length === 0) {
    return (
      <p className="text-sm text-stone-600">
        You have not liked a recipe yet. Open the dashboard and tap Like to save
        it here.
      </p>
    );
  }

  return (
    <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {recipes.map((recipe) => (
        <li key={recipe.id}>
          <RecipeCard
            recipe={recipe}
            likes={likeSummaryFor(likes, recipe.id)}
            canLike
          />
        </li>
      ))}
    </ul>
  );
}
