import { Suspense } from "react";
import Link from "next/link";
import { SignOutButton } from "@/components/auth/SignOutButton";
import { SiteHeaderSkeleton } from "@/components/ui/Skeleton";
import { getAuthUser } from "@/lib/auth";

async function SiteHeaderNav() {
  const user = await getAuthUser();
  const displayName =
    (typeof user?.user_metadata.username === "string" &&
      user.user_metadata.username) ||
    user?.email ||
    null;

  return (
    <>
      <p className="text-lg font-semibold tracking-tight">
        <Link href={user ? "/dashboard" : "/"} className="hover:text-orange-800">
          Recipe Share
        </Link>
      </p>
      <nav className="flex items-center gap-3 text-sm font-medium">
        {user ? (
          <>
            <Link
              href="/dashboard"
              className="rounded-md px-3 py-2 text-stone-600 hover:bg-stone-100 hover:text-stone-900"
            >
              Dashboard
            </Link>
            <Link
              href="/recipes/mine"
              className="rounded-md px-3 py-2 text-stone-600 hover:bg-stone-100 hover:text-stone-900"
            >
              My recipes
            </Link>
            <Link
              href="/favorites"
              className="rounded-md px-3 py-2 text-stone-600 hover:bg-stone-100 hover:text-stone-900"
            >
              Favorites
            </Link>
            <Link
              href="/profile"
              className="rounded-md px-3 py-2 text-stone-600 hover:bg-stone-100 hover:text-stone-900"
            >
              {displayName ?? "Profile"}
            </Link>
            <SignOutButton />
            <Link
              href="/recipes/new"
              className="rounded-md bg-orange-700 px-3 py-2 text-white hover:bg-orange-800"
            >
              Share a recipe
            </Link>
          </>
        ) : (
          <>
            <Link
              href="/login"
              className="rounded-md px-3 py-2 text-stone-600 hover:bg-stone-100 hover:text-stone-900"
            >
              Sign in
            </Link>
            <Link
              href="/signup"
              className="rounded-md bg-orange-700 px-3 py-2 text-white hover:bg-orange-800"
            >
              Sign up
            </Link>
          </>
        )}
      </nav>
    </>
  );
}

export function SiteHeader() {
  return (
    <header className="border-b border-stone-200 bg-white">
      <div className="mx-auto flex w-full max-w-5xl flex-wrap items-center justify-between gap-3 px-6 py-4">
        <Suspense
          fallback={
            <>
              <p className="text-lg font-semibold tracking-tight">
                <Link href="/" className="hover:text-orange-800">
                  Recipe Share
                </Link>
              </p>
              <SiteHeaderSkeleton />
            </>
          }
        >
          <SiteHeaderNav />
        </Suspense>
      </div>
    </header>
  );
}
