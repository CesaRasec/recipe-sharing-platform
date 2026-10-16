import Link from "next/link";
import { redirect } from "next/navigation";
import { DeleteRecipeButton } from "@/components/recipes/DeleteRecipeButton";
import { getAuthUser } from "@/lib/auth";
import { getMyRecipes } from "@/lib/recipes";

export default async function MyRecipesPage() {
  const user = await getAuthUser();
  if (!user) {
    redirect("/");
  }

  const { recipes, error } = await getMyRecipes(user.id);

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6 px-6 py-10">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold tracking-tight">My recipes</h1>
        <p className="text-sm text-stone-600">
          Choose a recipe to update, or share a new one.
        </p>
      </div>

      {error ? (
        <p className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          Could not load your recipes: {error}
        </p>
      ) : null}

      {recipes.length === 0 && !error ? (
        <p className="text-sm text-stone-600">
          You have not published a recipe yet.{" "}
          <Link href="/recipes/new" className="font-medium text-orange-800 hover:underline">
            Share a recipe
          </Link>
        </p>
      ) : (
        <ul className="divide-y divide-stone-200 rounded-lg border border-stone-200 bg-white">
          {recipes.map((recipe) => (
            <li key={recipe.id} className="flex flex-wrap items-center justify-between gap-3 px-4 py-3">
              <div>
                <p className="font-medium">{recipe.title}</p>
                <p className="text-sm text-stone-500">
                  {recipe.category} · {recipe.cookingTime} · {recipe.difficulty}
                </p>
              </div>
              <div className="flex gap-2 text-sm font-medium">
                <Link
                  href={`/recipes/${recipe.id}`}
                  className="rounded-md px-3 py-2 text-stone-600 hover:bg-stone-100"
                >
                  View
                </Link>
                <Link
                  href={`/recipes/${recipe.id}/edit`}
                  className="rounded-md bg-orange-700 px-3 py-2 text-white hover:bg-orange-800"
                >
                  Edit
                </Link>
                <DeleteRecipeButton recipeId={recipe.id} title={recipe.title} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
