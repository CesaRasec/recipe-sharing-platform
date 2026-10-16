"use client";

import { deleteRecipe } from "@/app/actions/recipes";

export function DeleteRecipeButton({
  recipeId,
  title,
}: {
  recipeId: string;
  title: string;
}) {
  return (
    <form
      action={deleteRecipe}
      onSubmit={(event) => {
        if (!window.confirm(`Delete “${title}”? This cannot be undone.`)) {
          event.preventDefault();
        }
      }}
    >
      <input type="hidden" name="id" value={recipeId} />
      <button
        type="submit"
        className="rounded-md px-3 py-2 text-sm font-medium text-red-700 hover:bg-red-50"
      >
        Delete
      </button>
    </form>
  );
}
