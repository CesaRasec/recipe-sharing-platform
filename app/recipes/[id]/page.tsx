import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { DeleteRecipeButton } from "@/components/recipes/DeleteRecipeButton";
import { LikeButton, LikeCount } from "@/components/recipes/LikeButton";
import { RecipeComments } from "@/components/recipes/RecipeComments";
import { getAuthUser } from "@/lib/auth";
import { getRecipeComments } from "@/lib/comments";
import { getRecipeLikes, likeSummaryFor } from "@/lib/likes";
import { getRecipeById } from "@/lib/recipes";

export default async function RecipeDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [{ recipe, error }, user] = await Promise.all([
    getRecipeById(id),
    getAuthUser(),
  ]);

  if (error) {
    return (
      <main className="mx-auto w-full max-w-2xl flex-1 px-6 py-10">
        <p className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          Could not load this recipe: {error}
        </p>
      </main>
    );
  }

  if (!recipe) {
    notFound();
  }

  const [likesMap, commentsResult] = await Promise.all([
    getRecipeLikes([recipe.id], user?.id),
    getRecipeComments(recipe.id),
  ]);
  const likes = likeSummaryFor(likesMap, recipe.id);

  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-8 px-6 py-10">
      <header className="flex flex-col gap-2">
        <p className="text-sm text-stone-500">{recipe.category}</p>
        <h1 className="text-3xl font-semibold tracking-tight">{recipe.title}</h1>
        <p className="text-sm text-stone-600">
          {recipe.author} · {recipe.cookingTime} · {recipe.difficulty}
        </p>
        {user ? (
          <LikeButton
            recipeId={recipe.id}
            liked={likes.liked}
            count={likes.count}
          />
        ) : (
          <LikeCount count={likes.count} />
        )}
        {user?.id === recipe.userId ? (
          <div className="flex flex-wrap items-center gap-2">
            <Link
              href={`/recipes/${recipe.id}/edit`}
              className="text-sm font-medium text-orange-800 hover:underline"
            >
              Edit recipe
            </Link>
            <DeleteRecipeButton recipeId={recipe.id} title={recipe.title} />
          </div>
        ) : null}
      </header>
      {recipe.imageUrl ? (
        <div className="relative h-56 overflow-hidden rounded-lg bg-orange-100">
          <Image
            src={recipe.imageUrl}
            alt=""
            fill
            sizes="(max-width: 768px) 100vw, 672px"
            className="object-cover"
            priority
          />
        </div>
      ) : null}

      <section className="flex flex-col gap-3">
        <h2 className="text-lg font-semibold">Ingredients</h2>
        {recipe.ingredients.length > 0 ? (
          <ul className="list-disc space-y-1 pl-5 text-sm leading-6 text-stone-700">
            {recipe.ingredients.map((ingredient, index) => (
              <li key={`${ingredient}-${index}`}>{ingredient}</li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-stone-600">No ingredients listed.</p>
        )}
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-lg font-semibold">Instructions</h2>
        <p className="whitespace-pre-wrap text-sm leading-7 text-stone-700">
          {recipe.instructions}
        </p>
      </section>

      <RecipeComments
        recipeId={recipe.id}
        comments={commentsResult.comments}
        error={commentsResult.error}
        currentUserId={user?.id}
        recipeOwnerId={recipe.userId}
      />
    </main>
  );
}
