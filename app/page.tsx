import { getLatestRecipes } from "@/lib/recipes";
import { testSupabaseConnection } from "@/lib/supabase/connection";

export default async function Home() {
  const connection = await testSupabaseConnection();
  const { recipes, error, configured } = await getLatestRecipes();

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-10 px-6 py-10">
      <p
        role="status"
        className={`rounded-md border px-4 py-3 text-sm ${
          connection.ok
            ? "border-green-200 bg-green-50 text-green-900"
            : "border-amber-200 bg-amber-50 text-amber-900"
        }`}
      >
        <span className="font-medium">Supabase: </span>
        {connection.message}
      </p>
      <section className="flex max-w-xl flex-col gap-3">
        <h1 className="text-3xl font-semibold tracking-tight">
          Simple recipes from home cooks
        </h1>
        <p className="text-base leading-7 text-stone-600">
          Browse what people are cooking, then share a recipe of your own.
        </p>
      </section>

      <search className="flex flex-col gap-3 sm:flex-row">
        <label className="sr-only" htmlFor="recipe-search">
          Search recipes
        </label>
        <input
          id="recipe-search"
          name="q"
          type="search"
          placeholder="Search by name or ingredient"
          className="w-full rounded-md border border-stone-300 bg-white px-3 py-2 text-sm outline-none ring-orange-700 placeholder:text-stone-400 focus:ring-2"
        />
        <button
          type="button"
          className="rounded-md border border-stone-300 bg-white px-4 py-2 text-sm font-medium text-stone-700 hover:bg-stone-100"
        >
          Search
        </button>
      </search>

      <section aria-labelledby="latest-recipes-heading" className="flex flex-col gap-4">
        <h2 id="latest-recipes-heading" className="text-lg font-semibold">
          Latest recipes
        </h2>
        {!configured ? (
          <p className="rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
            Add your Supabase URL and anon or publishable key to{" "}
            <code className="font-mono">.env</code> or{" "}
            <code className="font-mono">.env.local</code>, then restart the
            dev server.
          </p>
        ) : null}
        {error ? (
          <p className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
            Could not load recipes: {error}
          </p>
        ) : null}
        {configured && !error && recipes.length === 0 ? (
          <p className="text-sm text-stone-600">
            No recipes yet. Add a row in the Supabase Table Editor to see it
            here.
          </p>
        ) : null}
        {recipes.length > 0 ? (
          <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {recipes.map((recipe) => (
              <li key={recipe.id}>
                <article className="flex h-full flex-col rounded-lg border border-stone-200 bg-white p-4">
                  <div
                    aria-hidden="true"
                    className="mb-4 h-28 rounded-md bg-orange-100"
                  />
                  <h3 className="text-base font-semibold">{recipe.title}</h3>
                  <p className="mt-1 text-sm text-stone-600">
                    {recipe.author} · {recipe.cookingTime} · {recipe.difficulty}
                  </p>
                  <p className="mt-3">
                    <span className="rounded-full bg-stone-100 px-2 py-0.5 text-xs text-stone-600">
                      {recipe.category}
                    </span>
                  </p>
                </article>
              </li>
            ))}
          </ul>
        ) : null}
      </section>
    </main>
  );
}
