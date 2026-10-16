"use client";

import Link from "next/link";
import type { ChangeEvent } from "react";
import {
  RECIPE_DIFFICULTIES,
  type RecipeDifficulty,
} from "@/lib/recipe-options";

const fieldClassName =
  "w-full rounded-md border border-stone-300 bg-white px-3 py-2 text-sm outline-none ring-orange-700 placeholder:text-stone-400 focus:ring-2";

function submitOnChange(event: ChangeEvent<HTMLSelectElement>) {
  event.currentTarget.form?.requestSubmit();
}

function difficultyLabel(value: RecipeDifficulty) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

export function RecipeSearchForm({
  query,
  category,
  difficulty,
  categories,
}: {
  query: string;
  category: string;
  difficulty: string;
  categories: string[];
}) {
  const hasFilters = Boolean(query || category || difficulty);
  const categoryOptions = category && !categories.includes(category)
    ? [category, ...categories]
    : categories;

  return (
    <form
      action="/dashboard"
      method="get"
      role="search"
      className="flex w-full flex-col gap-3 lg:flex-row lg:items-end"
    >
      <div className="min-w-0 flex-1">
        <label className="sr-only" htmlFor="recipe-search">
          Search recipes
        </label>
        <input
          id="recipe-search"
          name="q"
          type="search"
          defaultValue={query}
          placeholder="Search by title, category, or instructions"
          className={fieldClassName}
        />
      </div>
      <div className="w-full lg:w-44">
        <label className="sr-only" htmlFor="recipe-category">
          Category
        </label>
        <select
          id="recipe-category"
          name="category"
          defaultValue={category}
          onChange={submitOnChange}
          className={fieldClassName}
        >
          <option value="">All categories</option>
          {categoryOptions.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </div>
      <div className="w-full lg:w-40">
        <label className="sr-only" htmlFor="recipe-difficulty">
          Difficulty
        </label>
        <select
          id="recipe-difficulty"
          name="difficulty"
          defaultValue={difficulty}
          onChange={submitOnChange}
          className={fieldClassName}
        >
          <option value="">All difficulties</option>
          {RECIPE_DIFFICULTIES.map((item) => (
            <option key={item} value={item}>
              {difficultyLabel(item)}
            </option>
          ))}
        </select>
      </div>
      <div className="flex gap-2">
        <button
          type="submit"
          className="rounded-md bg-orange-700 px-4 py-2 text-sm font-medium text-white hover:bg-orange-800"
        >
          Search
        </button>
        {hasFilters ? (
          <Link
            href="/dashboard"
            className="rounded-md border border-stone-300 px-4 py-2 text-sm font-medium text-stone-700 hover:bg-stone-100"
          >
            Clear
          </Link>
        ) : null}
      </div>
    </form>
  );
}
