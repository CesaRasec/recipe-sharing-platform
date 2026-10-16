import { redirect } from "next/navigation";
import { FavoriteRecipeGrid } from "@/components/recipes/FavoriteRecipeGrid";
import { getAuthUser } from "@/lib/auth";

export default async function FavoritesPage() {
  const user = await getAuthUser();
  if (!user) {
    redirect("/");
  }

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-8 px-6 py-10">
      <section className="flex max-w-xl flex-col gap-2">
        <h1 className="text-3xl font-semibold tracking-tight">Favorites</h1>
        <p className="text-base leading-7 text-stone-600">
          Recipes this profile has liked. Unlike a recipe to remove it from the
          list.
        </p>
      </section>
      <FavoriteRecipeGrid userId={user.id} />
    </main>
  );
}
