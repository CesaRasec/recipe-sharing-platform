import Link from "next/link";
import { CommentForm } from "@/components/recipes/CommentForm";
import { CommentItem } from "@/components/recipes/CommentItem";
import type { RecipeCommentItem } from "@/lib/comments";

export function RecipeComments({
  recipeId,
  comments,
  error,
  currentUserId,
  recipeOwnerId,
}: {
  recipeId: string;
  comments: RecipeCommentItem[];
  error: string | null;
  currentUserId?: string | null;
  recipeOwnerId: string;
}) {
  return (
    <section aria-labelledby="comments-heading" className="flex flex-col gap-4">
      <h2 id="comments-heading" className="text-lg font-semibold">
        Comments ({comments.length})
      </h2>

      {error ? (
        <p className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          Could not load comments: {error}
        </p>
      ) : null}

      {comments.length === 0 && !error ? (
        <p className="text-sm text-stone-600">No comments yet.</p>
      ) : (
        <ul className="flex flex-col">
          {comments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              canEdit={currentUserId === comment.userId}
              canDelete={
                currentUserId === comment.userId ||
                currentUserId === recipeOwnerId
              }
            />
          ))}
        </ul>
      )}

      {currentUserId ? (
        <CommentForm recipeId={recipeId} />
      ) : (
        <p className="text-sm text-stone-600">
          <Link href="/" className="font-medium text-orange-800 hover:underline">
            Sign in
          </Link>{" "}
          to leave a comment.
        </p>
      )}
    </section>
  );
}
