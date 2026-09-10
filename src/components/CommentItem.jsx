export default function CommentItem({ comment }) {
  const creator = comment.commentCreator || {};
  return (
    <div className="flex gap-2 border-b border-ink-100 py-2 last:border-0 dark:border-ink-700">
      <img
        src={creator.photo || "https://placehold.co/32x32?text=%20"}
        alt=""
        className="h-7 w-7 shrink-0 rounded-full object-cover sm:h-8 sm:w-8"
      />
      <div className="min-w-0 flex-1 rounded-2xl bg-ink-100 px-3 py-2 dark:bg-ink-700">
        <p className="truncate text-sm font-semibold text-ink-800 dark:text-ink-100">
          {creator.name || "مستخدم"}
        </p>
        {comment.content && (
          <p className="break-words text-sm text-ink-700 dark:text-ink-200">{comment.content}</p>
        )}
        {comment.image && (
          <img src={comment.image} alt="" className="mt-2 max-h-40 rounded-lg object-cover" />
        )}
      </div>
    </div>
  );
}
