"use client";

import { useActionState } from "react";
import { updateProfile, type ProfileFormState } from "@/app/actions/profiles";
import type { Profile } from "@/lib/supabase/types";

const initialState: ProfileFormState = { error: null, message: null };

const fieldClassName =
  "mt-1 w-full rounded-md border border-stone-300 bg-white px-3 py-2 text-sm outline-none ring-orange-700 placeholder:text-stone-400 focus:ring-2";

export function ProfileForm({ profile }: { profile: Profile }) {
  const [state, formAction, pending] = useActionState(updateProfile, initialState);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      {state.error ? (
        <p
          className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800"
          role="alert"
        >
          {state.error}
        </p>
      ) : null}
      {state.message ? (
        <p
          className="rounded-md border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-900"
          role="status"
        >
          {state.message}
        </p>
      ) : null}
      <div>
        <label htmlFor="email" className="text-sm font-medium">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          value={profile.email}
          readOnly
          className={`${fieldClassName} bg-stone-100 text-stone-500`}
        />
      </div>
      <div>
        <label htmlFor="username" className="text-sm font-medium">
          Username
        </label>
        <input
          id="username"
          name="username"
          type="text"
          required
          maxLength={40}
          defaultValue={profile.username}
          className={fieldClassName}
        />
      </div>
      <div>
        <label htmlFor="full_name" className="text-sm font-medium">
          Full name
        </label>
        <input
          id="full_name"
          name="full_name"
          type="text"
          required
          maxLength={80}
          defaultValue={profile.full_name}
          className={fieldClassName}
        />
      </div>
      <div>
        <label htmlFor="bio" className="text-sm font-medium">
          Bio
        </label>
        <textarea
          id="bio"
          name="bio"
          rows={4}
          maxLength={500}
          defaultValue={profile.bio ?? ""}
          className={fieldClassName}
        />
      </div>
      <button
        type="submit"
        disabled={pending}
        className="rounded-md bg-orange-700 px-3 py-2 text-sm font-medium text-white hover:bg-orange-800 disabled:opacity-60"
      >
        {pending ? "Saving…" : "Save profile"}
      </button>
    </form>
  );
}
