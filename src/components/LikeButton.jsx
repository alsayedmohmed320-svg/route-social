import { useState } from "react";

export default function LikeButton({ isLiked, likesCount, onToggle, disabled }) {
  const [pending, setPending] = useState(false);

  async function handleClick() {
    if (pending || disabled) return;
    setPending(true);
    try {
      await onToggle();
    } finally {
      setPending(false);
    }
  }

  return (
    <button
      onClick={handleClick}
      disabled={pending || disabled}
      className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition ${
        isLiked
          ? "bg-brand-50 text-brand-600 dark:bg-brand-900/40 dark:text-brand-400"
          : "text-ink-600 hover:bg-ink-100 dark:text-ink-300 dark:hover:bg-ink-700"
      }`}
    >
      <span>{isLiked ? "❤️" : "🤍"}</span>
      <span>{isLiked ? "متعجب" : "إعجاب"}</span>
      {likesCount > 0 && <span className="text-ink-400 dark:text-ink-500">· {likesCount}</span>}
    </button>
  );
}
