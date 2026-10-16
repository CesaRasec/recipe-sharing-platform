"use client";

import { useActionState } from "react";
import {
  createComment,
  type CommentFormState,
} from "@/app/actions/comments";

const initialState: CommentFormState = { error: null, resetKey: 0 };

const fieldClassName =
  "mt-1 w-full rounded-md border border-stone-300 bg-white px-3 py-2 text-sm outline-none ring-orange-700 placeholder:text-stone-400 focus:ring-2";

export function CommentForm({ recipeId }: { recipeId: string }) {
  const [state, formAction, pending] = useActionState(createComment, initialState);

  return (
    <form key={state.resetKey} action={formAction} className="flex flex-col gap-3">
      <input type="hidden" name="recipe_id" value={recipeId} />
      {state.error ? (
        <p
          className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800"
          role="alert"
        >
          {state.error}
        </p>
      ) : null}
      <div>
        <label htmlFor="comment-body" className="text-sm font-medium">
          Add a comment
        </label>
        <textarea
          id="comment-body"
          name="body"
          required
          rows={3}
          maxLength={2000}
          placeholder="What did you think of this recipe?"
          className={fieldClassName}
        />
      </div>
      <button
        type="submit"
        disabled={pending}
        className="self-start rounded-md bg-orange-700 px-4 py-2 text-sm font-medium text-white hover:bg-orange-800 disabled:opacity-60"
      >
        {pending ? "Posting…" : "Post comment"}
      </button>
    </form>
  );
}
