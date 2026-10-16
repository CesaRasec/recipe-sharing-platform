"use client";

import { signOut } from "@/app/actions/auth";

export function SignOutButton() {
  return (
    <form action={signOut}>
      <button
        type="submit"
        className="rounded-md px-3 py-2 text-stone-600 hover:bg-stone-100 hover:text-stone-900"
      >
        Sign out
      </button>
    </form>
  );
}
