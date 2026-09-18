import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="border-b border-stone-200 bg-white">
      <div className="mx-auto flex w-full max-w-5xl flex-wrap items-center justify-between gap-3 px-6 py-4">
        <p className="text-lg font-semibold tracking-tight">
          <Link href="/" className="hover:text-orange-800">
            Recipe Share
          </Link>
        </p>
        <div className="flex items-center gap-3 text-sm font-medium">
          <button
            type="button"
            className="rounded-md px-3 py-2 text-stone-600 hover:bg-stone-100 hover:text-stone-900"
          >
            Sign in
          </button>
          <button
            type="button"
            className="rounded-md bg-orange-700 px-3 py-2 text-white hover:bg-orange-800"
          >
            Share a recipe
          </button>
        </div>
      </div>
    </header>
  );
}
