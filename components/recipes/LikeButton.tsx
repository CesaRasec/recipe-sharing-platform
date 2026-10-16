"use client";

import { useFormStatus } from "react-dom";
import { toggleRecipeLike } from "@/app/actions/likes";

function LikeSubmit({ liked, count }: { liked: boolean; count: number }) {
  const { pending } = useFormStatus();
  const label = liked ? "Unlike" : "Like";

  return (
    <button
      type="submit"
      disabled={pending}
      aria-pressed={liked}
      aria-label={`${label} this recipe. ${count} likes`}
      className={`rounded-md px-3 py-1.5 text-sm font-medium disabled:opacity-60 ${
        liked
          ? "bg-orange-100 text-orange-800 hover:bg-orange-200"
          : "border border-stone-300 text-stone-700 hover:bg-stone-100"
      }`}
    >
      {liked ? "Liked" : "Like"}
      <span className="ml-1 tabular-nums text-stone-600">({count})</span>
    </button>
  );
}

export function LikeButton({
  recipeId,
  liked,
  count,
}: {
  recipeId: string;
  liked: boolean;
  count: number;
}) {
  return (
    <form action={toggleRecipeLike}>
      <input type="hidden" name="recipe_id" value={recipeId} />
      <LikeSubmit liked={liked} count={count} />
    </form>
  );
}

export function LikeCount({ count }: { count: number }) {
  return (
    <p className="text-sm text-stone-600">
      {count} {count === 1 ? "like" : "likes"}
    </p>
  );
}
