"use client";

import Image from "next/image";
import { useActionState } from "react";
import { createRecipe, updateRecipe, type RecipeFormState } from "@/app/actions/recipes";
import type { RecipeDetail } from "@/lib/recipes";

const initialState: RecipeFormState = { error: null };

const fieldClassName =
  "mt-1 w-full rounded-md border border-stone-300 bg-white px-3 py-2 text-sm outline-none ring-orange-700 placeholder:text-stone-400 focus:ring-2";

export function RecipeForm({ recipe }: { recipe?: RecipeDetail }) {
  const action = recipe ? updateRecipe : createRecipe;
  const [state, formAction, pending] = useActionState(action, initialState);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      {recipe ? <input type="hidden" name="id" value={recipe.id} /> : null}
      {state.error ? (
        <p
          className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800"
          role="alert"
        >
          {state.error}
        </p>
      ) : null}
      <div>
        <label htmlFor="title" className="text-sm font-medium">
          Title
        </label>
        <input
          id="title"
          name="title"
          type="text"
          required
          maxLength={120}
          defaultValue={recipe?.title}
          className={fieldClassName}
        />
      </div>
      <div>
        <label htmlFor="category" className="text-sm font-medium">
          Category
        </label>
        <input
          id="category"
          name="category"
          type="text"
          required
          placeholder="Dinner, dessert, soup…"
          maxLength={40}
          defaultValue={recipe?.category}
          className={fieldClassName}
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="cooking_time" className="text-sm font-medium">
            Cooking time (minutes)
          </label>
          <input
            id="cooking_time"
            name="cooking_time"
            type="number"
            required
            min={1}
            max={1440}
            defaultValue={recipe?.cookingTimeMinutes}
            className={fieldClassName}
          />
        </div>
        <div>
          <label htmlFor="difficulty" className="text-sm font-medium">
            Difficulty
          </label>
          <select
            id="difficulty"
            name="difficulty"
            required
            defaultValue={recipe?.difficulty ?? "easy"}
            className={fieldClassName}
          >
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>
      </div>
      <div>
        <label htmlFor="image" className="text-sm font-medium">
          Photo
        </label>
        {recipe?.imageUrl ? (
          <div className="relative mt-1 h-28 overflow-hidden rounded-md bg-orange-100">
            <Image
              src={recipe.imageUrl}
              alt=""
              fill
              sizes="(max-width: 768px) 100vw, 576px"
              className="object-cover"
            />
          </div>
        ) : null}
        <input
          id="image"
          name="image"
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          className={`${fieldClassName} file:mr-3 file:rounded-md file:border-0 file:bg-stone-100 file:px-3 file:py-1 file:text-sm`}
        />
        <p className="mt-1 text-xs text-stone-500">
          Optional. JPG, PNG, WEBP, or GIF up to 2 MB.
        </p>
      </div>
      <div>
        <label htmlFor="ingredients" className="text-sm font-medium">
          Ingredients
        </label>
        <textarea
          id="ingredients"
          name="ingredients"
          required
          rows={6}
          placeholder={"One ingredient per line\n2 eggs\n1 cup flour"}
          defaultValue={recipe?.ingredients.join("\n")}
          className={fieldClassName}
        />
      </div>
      <div>
        <label htmlFor="instructions" className="text-sm font-medium">
          Instructions
        </label>
        <textarea
          id="instructions"
          name="instructions"
          required
          rows={8}
          defaultValue={
            recipe?.instructions === "No instructions yet." ? "" : recipe?.instructions
          }
          className={fieldClassName}
        />
      </div>
      <button
        type="submit"
        disabled={pending}
        className="rounded-md bg-orange-700 px-3 py-2 text-sm font-medium text-white hover:bg-orange-800 disabled:opacity-60"
      >
        {pending ? "Saving…" : recipe ? "Save changes" : "Publish recipe"}
      </button>
    </form>
  );
}
