export default function PostSkeleton() {
  return (
    <div className="mb-4 rounded-xl2 border border-ink-100/60 bg-white p-4 shadow-card dark:border-ink-800 dark:bg-ink-800">
      <div className="flex items-center gap-2.5">
        <div className="skeleton h-11 w-11 rounded-full" />
        <div className="space-y-2">
          <div className="skeleton h-3 w-28 rounded" />
          <div className="skeleton h-2.5 w-16 rounded" />
        </div>
      </div>
      <div className="mt-4 space-y-2">
        <div className="skeleton h-3 w-full rounded" />
        <div className="skeleton h-3 w-4/5 rounded" />
      </div>
      <div className="skeleton mt-3 h-48 w-full rounded-lg" />
    </div>
  );
}
