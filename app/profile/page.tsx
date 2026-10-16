import { redirect } from "next/navigation";
import { ProfileForm } from "@/components/profile/ProfileForm";
import { FavoriteRecipeGrid } from "@/components/recipes/FavoriteRecipeGrid";
import { getAuthUser } from "@/lib/auth";
import { getCurrentProfile } from "@/lib/profiles";

export default async function ProfilePage() {
  const user = await getAuthUser();
  if (!user) {
    redirect("/");
  }

  const { profile, error } = await getCurrentProfile(user);

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-10 px-6 py-10">
      <div className="flex max-w-xl flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-semibold tracking-tight">Edit profile</h1>
          <p className="text-sm text-stone-600">
            Update how other cooks see you. Email comes from your account and
            cannot be changed here.
          </p>
        </div>
        {error || !profile ? (
          <p className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
            {error ?? "Could not load your profile."}
          </p>
        ) : (
          <ProfileForm profile={profile} />
        )}
      </div>

      <section
        id="favorites"
        aria-labelledby="favorites-heading"
        className="flex flex-col gap-4"
      >
        <div className="flex flex-col gap-2">
          <h2 id="favorites-heading" className="text-lg font-semibold">
            Favorites
          </h2>
          <p className="text-sm text-stone-600">
            Recipes you have liked with this profile.
          </p>
        </div>
        <FavoriteRecipeGrid userId={user.id} />
      </section>
    </main>
  );
}
