import { useEffect, useRef, useState } from "react";

export default function PostOptionsMenu({ onEdit, onDelete }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label="خيارات المنشور"
        className="flex h-8 w-8 items-center justify-center rounded-full text-ink-400 transition hover:bg-ink-100 hover:text-ink-600 dark:text-ink-500 dark:hover:bg-ink-700 dark:hover:text-ink-200"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
          <circle cx="5" cy="12" r="2" />
          <circle cx="12" cy="12" r="2" />
          <circle cx="19" cy="12" r="2" />
        </svg>
      </button>

      {open && (
        <div className="absolute left-0 top-9 z-20 w-36 overflow-hidden rounded-xl border border-ink-100 bg-white shadow-card dark:border-ink-700 dark:bg-ink-800">
          <button
            onClick={() => {
              setOpen(false);
              onEdit();
            }}
            className="block w-full px-4 py-2.5 text-right text-sm text-ink-700 hover:bg-ink-50 dark:text-ink-200 dark:hover:bg-ink-700"
          >
            ✏️ تعديل المنشور
          </button>
          <button
            onClick={() => {
              setOpen(false);
              onDelete();
            }}
            className="block w-full px-4 py-2.5 text-right text-sm text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/40"
          >
            🗑️ حذف المنشور
          </button>
        </div>
      )}
    </div>
  );
}
