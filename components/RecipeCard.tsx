import Image from "next/image";
import Link from "next/link";
import { LikeButton } from "@/components/recipes/LikeButton";
import type { RecipeLikeSummary } from "@/lib/likes";
import type { RecipeCard as RecipeCardData } from "@/lib/recipes";

export function RecipeCard({
  recipe,
  likes,
  canLike = false,
}: {
  recipe: RecipeCardData;
  likes?: RecipeLikeSummary;
  canLike?: boolean;
}) {
  return (
    <article className="flex h-full flex-col rounded-lg border border-stone-200 bg-white p-4">
      <Link href={`/recipes/${recipe.id}`} className="flex flex-1 flex-col">
        <div className="relative mb-4 h-28 overflow-hidden rounded-md bg-orange-100">
          {recipe.imageUrl ? (
            <Image
              src={recipe.imageUrl}
              alt=""
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover"
            />
          ) : null}
        </div>
        <h3 className="text-base font-semibold hover:text-orange-800">
          {recipe.title}
        </h3>
        <p className="mt-1 text-sm text-stone-600">
          {recipe.author} · {recipe.cookingTime} · {recipe.difficulty}
        </p>
        <p className="mt-3">
          <span className="rounded-full bg-stone-100 px-2 py-0.5 text-xs text-stone-600">
            {recipe.category}
          </span>
        </p>
      </Link>
      {likes ? (
        <div className="mt-4 border-t border-stone-100 pt-3">
          {canLike ? (
            <LikeButton
              recipeId={recipe.id}
              liked={likes.liked}
              count={likes.count}
            />
          ) : (
            <p className="text-sm text-stone-600">
              {likes.count} {likes.count === 1 ? "like" : "likes"}
            </p>
          )}
        </div>
      ) : null}
    </article>
  );
}
