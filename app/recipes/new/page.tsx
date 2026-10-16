import { redirect } from "next/navigation";
import { RecipeForm } from "@/components/recipes/RecipeForm";
import { getAuthUser } from "@/lib/auth";

export default async function NewRecipePage() {
  const user = await getAuthUser();
  if (!user) {
    redirect("/");
  }

  return (
    <main className="mx-auto flex w-full max-w-xl flex-1 flex-col gap-6 px-6 py-10">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold tracking-tight">Share a recipe</h1>
        <p className="text-sm text-stone-600">
          Publish a recipe so other cooks can find it on the dashboard.
        </p>
      </div>
      <RecipeForm />
    </main>
  );
}
