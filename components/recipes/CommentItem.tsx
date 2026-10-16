"use client";

import { useActionState, useEffect, useState } from "react";
import {
  deleteComment,
  updateComment,
  type CommentFormState,
} from "@/app/actions/comments";
import type { RecipeCommentItem } from "@/lib/comments";

const initialState: CommentFormState = { error: null, resetKey: 0 };

const fieldClassName =
  "mt-1 w-full rounded-md border border-stone-300 bg-white px-3 py-2 text-sm outline-none ring-orange-700 focus:ring-2";

function formatCommentDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }
  return date.toLocaleString("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export function CommentItem({
  comment,
  canEdit,
  canDelete,
}: {
  comment: RecipeCommentItem;
  canEdit: boolean;
  canDelete: boolean;
}) {
  const [editing, setEditing] = useState(false);
  const [state, formAction, pending] = useActionState(updateComment, initialState);

  useEffect(() => {
    if (state.resetKey) {
      setEditing(false);
    }
  }, [state.resetKey]);

  return (
    <li className="flex flex-col gap-2 border-b border-stone-200 py-4 last:border-b-0">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <p className="text-sm font-medium">{comment.author}</p>
        <p className="text-xs text-stone-500">
          {formatCommentDate(comment.createdAt)}
          {comment.edited ? " · Edited" : ""}
        </p>
      </div>

      {editing ? (
        <form action={formAction} className="flex flex-col gap-2">
          <input type="hidden" name="id" value={comment.id} />
          <input type="hidden" name="recipe_id" value={comment.recipeId} />
          {state.error ? (
            <p
              className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800"
              role="alert"
            >
              {state.error}
            </p>
          ) : null}
          <label className="sr-only" htmlFor={`edit-comment-${comment.id}`}>
            Edit comment
          </label>
          <textarea
            id={`edit-comment-${comment.id}`}
            name="body"
            required
            rows={3}
            maxLength={2000}
            defaultValue={comment.body}
            className={fieldClassName}
          />
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={pending}
              className="rounded-md bg-orange-700 px-3 py-1.5 text-sm font-medium text-white hover:bg-orange-800 disabled:opacity-60"
            >
              {pending ? "Saving…" : "Save"}
            </button>
            <button
              type="button"
              onClick={() => setEditing(false)}
              className="rounded-md px-3 py-1.5 text-sm font-medium text-stone-700 hover:bg-stone-100"
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <p className="whitespace-pre-wrap text-sm leading-6 text-stone-700">
          {comment.body}
        </p>
      )}

      {!editing && (canEdit || canDelete) ? (
        <div className="flex flex-wrap gap-2">
          {canEdit ? (
            <button
              type="button"
              onClick={() => setEditing(true)}
              className="text-sm font-medium text-orange-800 hover:underline"
            >
              Edit
            </button>
          ) : null}
          {canDelete ? (
            <form
              action={deleteComment}
              onSubmit={(event) => {
                if (!window.confirm("Delete this comment?")) {
                  event.preventDefault();
                }
              }}
            >
              <input type="hidden" name="id" value={comment.id} />
              <input type="hidden" name="recipe_id" value={comment.recipeId} />
              <button
                type="submit"
                className="text-sm font-medium text-red-700 hover:underline"
              >
                Delete
              </button>
            </form>
          ) : null}
        </div>
      ) : null}
    </li>
  );
}
