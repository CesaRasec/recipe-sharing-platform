import { notFound, redirect } from "next/navigation";
import { DeleteRecipeButton } from "@/components/recipes/DeleteRecipeButton";
import { RecipeForm } from "@/components/recipes/RecipeForm";
import { getAuthUser } from "@/lib/auth";
import { getRecipeById } from "@/lib/recipes";

export default async function EditRecipePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await getAuthUser();
  if (!user) {
    redirect("/");
  }

  const { id } = await params;
  const { recipe, error } = await getRecipeById(id);

  if (error) {
    return (
      <main className="mx-auto w-full max-w-xl flex-1 px-6 py-10">
        <p className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          Could not load this recipe: {error}
        </p>
      </main>
    );
  }

  if (!recipe) {
    notFound();
  }

  if (recipe.userId !== user.id) {
    redirect("/recipes/mine");
  }

  return (
    <main className="mx-auto flex w-full max-w-xl flex-1 flex-col gap-6 px-6 py-10">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold tracking-tight">Edit recipe</h1>
        <p className="text-sm text-stone-600">
          Update the details or replace the photo, then save.
        </p>
      </div>
      <RecipeForm recipe={recipe} />
      <DeleteRecipeButton recipeId={recipe.id} title={recipe.title} />
    </main>
  );
}
