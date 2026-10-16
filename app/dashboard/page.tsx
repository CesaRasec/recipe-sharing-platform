import { Suspense } from "react";
import { redirect } from "next/navigation";
import { RecipeCard } from "@/components/RecipeCard";
import { RecipeSearchForm } from "@/components/recipes/RecipeSearchForm";
import {
  DashboardFeedSkeleton,
  DashboardFiltersSkeleton,
} from "@/components/ui/Skeleton";
import { getAuthUser } from "@/lib/auth";
import { getRecipeLikes, likeSummaryFor } from "@/lib/likes";
import type { RecipeLikeSummary } from "@/lib/likes";
import { isRecipeDifficulty } from "@/lib/recipe-options";
import {
  getCommunityRecipes,
  getMyRecipes,
  getRecipeCategories,
} from "@/lib/recipes";
import type { RecipeCard as RecipeCardData } from "@/lib/recipes";

type DashboardSearchParams = Promise<{
  q?: string | string[];
  category?: string | string[];
  difficulty?: string | string[];
}>;

function firstParam(value?: string | string[]) {
  return typeof value === "string" ? value.trim() : "";
}

function RecipeGrid({
  recipes,
  likes,
  emptyMessage,
}: {
  recipes: RecipeCardData[];
  likes: Record<string, RecipeLikeSummary>;
  emptyMessage: string;
}) {
  if (recipes.length === 0) {
    return <p className="text-sm text-stone-600">{emptyMessage}</p>;
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

async function DashboardResults({
  userId,
  searchParams,
}: {
  userId: string;
  searchParams: DashboardSearchParams;
}) {
  const params = await searchParams;
  const query = firstParam(params.q);
  const category = firstParam(params.category);
  const difficultyRaw = firstParam(params.difficulty).toLowerCase();
  const difficulty = isRecipeDifficulty(difficultyRaw) ? difficultyRaw : "";
  const filters = { search: query, category, difficulty };
  const hasFilters = Boolean(query || category || difficulty);

  const [community, mine, categories] = await Promise.all([
    getCommunityRecipes(userId, filters),
    getMyRecipes(userId, filters),
    getRecipeCategories(),
  ]);
  const recipeIds = [...mine.recipes, ...community.recipes].map(
    (recipe) => recipe.id,
  );
  const likes = await getRecipeLikes(recipeIds, userId);
  const loadError = community.error ?? mine.error;

  return (
    <>
      <RecipeSearchForm
        key={`${query}|${category}|${difficulty}`}
        query={query}
        category={category}
        difficulty={difficulty}
        categories={categories}
      />

      {hasFilters ? (
        <p className="text-sm text-stone-600">
          Showing
          {query ? (
            <>
              {" "}
              results for <span className="font-medium">{query}</span>
            </>
          ) : (
            " recipes"
          )}
          {category ? (
            <>
              {" "}
              in <span className="font-medium">{category}</span>
            </>
          ) : null}
          {difficulty ? (
            <>
              {" "}
              at <span className="font-medium">{difficulty}</span> difficulty
            </>
          ) : null}
        </p>
      ) : null}

      {loadError ? (
        <p className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          Could not load recipes: {loadError}
        </p>
      ) : null}

      <section aria-labelledby="my-recipes-heading" className="flex flex-col gap-4">
        <h2 id="my-recipes-heading" className="text-lg font-semibold">
          Your recipes
        </h2>
        <RecipeGrid
          recipes={mine.recipes}
          likes={likes}
          emptyMessage={
            hasFilters
              ? "No matches in your recipes."
              : "You have not published a recipe yet. Use Share a recipe or My recipes to add one."
          }
        />
      </section>

      <section aria-labelledby="community-recipes-heading" className="flex flex-col gap-4">
        <h2 id="community-recipes-heading" className="text-lg font-semibold">
          From other cooks
        </h2>
        <RecipeGrid
          recipes={community.recipes}
          likes={likes}
          emptyMessage={
            hasFilters
              ? "No matches from other cooks."
              : "No recipes from other users yet. When someone else shares a recipe, it will show up here."
          }
        />
      </section>
    </>
  );
}

function DashboardResultsFallback() {
  return (
    <>
      <DashboardFiltersSkeleton />
      <DashboardFeedSkeleton />
    </>
  );
}

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: DashboardSearchParams;
}) {
  const user = await getAuthUser();
  if (!user) {
    redirect("/");
  }

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-10 px-6 py-10">
      <section className="flex max-w-xl flex-col gap-2">
        <h1 className="text-3xl font-semibold tracking-tight">Dashboard</h1>
        <p className="text-base leading-7 text-stone-600">
          Your recipes and dishes shared by other cooks.
        </p>
      </section>

      <Suspense fallback={<DashboardResultsFallback />}>
        <DashboardResults userId={user.id} searchParams={searchParams} />
      </Suspense>
    </main>
  );
}
