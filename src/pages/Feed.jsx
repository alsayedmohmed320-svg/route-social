import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import CreatePost from "../components/CreatePost";
import PostCard from "../components/PostCard";
import PostSkeleton from "../components/PostSkeleton";
import { getFeed } from "../api/posts";
import { useToast } from "../context/ToastContext";

export default function Feed() {
  const { showToast } = useToast();
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState("");

  async function loadPosts(nextPage = 1) {
    nextPage === 1 ? setLoading(true) : setLoadingMore(true);
    setError("");
    try {
      const res = await getFeed(nextPage, 10);
      const data = res.data?.data || res.data;
      const list = Array.isArray(data) ? data : data.posts || [];
      setPosts((prev) => (nextPage === 1 ? list : [...prev, ...list]));
      setHasMore(list.length === 10);
      setPage(nextPage);
    } catch (err) {
      setError("مقدرناش نجيب المنشورات دلوقتي، حاول تاني");
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }

  useEffect(() => {
    loadPosts(1);
  }, []);

  function handleDeleted(postId) {
    setPosts((prev) => prev.filter((p) => p._id !== postId));
    showToast("تم حذف المنشور", "success");
  }

  function handleUpdated(updatedPost) {
    setPosts((prev) => prev.map((p) => (p._id === updatedPost._id ? { ...p, ...updatedPost } : p)));
    showToast("تم تعديل المنشور", "success");
  }

  return (
    <div className="min-h-screen bg-ink-100 dark:bg-ink-950">
      <Navbar />
      <main className="mx-auto max-w-xl px-3 py-4 sm:px-4 sm:py-6">
        <CreatePost
          onCreated={(newPost) => {
            setPosts((prev) => [newPost, ...prev]);
            showToast("تم نشر المنشور", "success");
          }}
        />

        {error && (
          <p className="mb-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600 dark:bg-red-950/60 dark:text-red-300">
            {error}
          </p>
        )}

        {loading ? (
          <>
            <PostSkeleton />
            <PostSkeleton />
          </>
        ) : (
          <>
            {posts.map((post) => (
              <PostCard
                key={post._id}
                post={post}
                onDeleted={handleDeleted}
                onUpdated={handleUpdated}
              />
            ))}

            {posts.length === 0 && !error && (
              <div className="py-16 text-center text-ink-400 dark:text-ink-500">
                <p className="text-3xl">📭</p>
                <p className="mt-2 text-sm">لسه مفيش منشورات، ابدأ أنت الأول</p>
              </div>
            )}

            {hasMore && posts.length > 0 && (
              <button
                onClick={() => loadPosts(page + 1)}
                disabled={loadingMore}
                className="mx-auto mt-1 block rounded-full border border-ink-100 bg-white px-5 py-2 text-sm font-medium text-brand-600 shadow-soft transition hover:bg-brand-50 disabled:opacity-50 dark:border-ink-700 dark:bg-ink-800 dark:text-brand-400 dark:hover:bg-ink-700"
              >
                {loadingMore ? "بيحمّل..." : "تحميل منشورات أكتر"}
              </button>
            )}
          </>
        )}
      </main>
    </div>
  );
}
