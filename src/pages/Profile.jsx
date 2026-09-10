import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import PostCard from "../components/PostCard";
import PostSkeleton from "../components/PostSkeleton";
import AvatarUploader from "../components/AvatarUploader";
import EditProfileModal from "../components/EditProfileModal";
import { useAuth } from "../context/AuthContext";
import { getUserProfile } from "../api/auth";
import { getUserPosts } from "../api/posts";

export default function Profile() {
  const { userId } = useParams();
  const { user: me, updateUser } = useAuth();
  const isOwnProfile = !userId || userId === me?._id;

  const [profile, setProfile] = useState(isOwnProfile ? me : null);
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [loadingProfile, setLoadingProfile] = useState(!isOwnProfile);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    if (isOwnProfile) {
      setProfile(me);
      return;
    }
    setLoadingProfile(true);
    getUserProfile(userId)
      .then((res) => setProfile(res.data?.data || res.data))
      .catch(() => setProfile(null))
      .finally(() => setLoadingProfile(false));
  }, [userId, isOwnProfile, me]);

  useEffect(() => {
    const targetId = isOwnProfile ? me?._id : userId;
    if (!targetId) return;
    loadPosts(targetId, 1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId, me?._id]);

  async function loadPosts(targetId, nextPage) {
    setLoadingPosts(true);
    try {
      const res = await getUserPosts(targetId, nextPage, 10);
      const data = res.data?.data || res.data;
      const list = Array.isArray(data) ? data : data.posts || [];
      setPosts((prev) => (nextPage === 1 ? list : [...prev, ...list]));
      setHasMore(list.length === 10);
      setPage(nextPage);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingPosts(false);
    }
  }

  function handleProfileUpdated(updated) {
    setProfile(updated);
    setEditing(false);
    if (isOwnProfile) updateUser(updated);
  }

  function handlePhotoUploaded(url) {
    setProfile((prev) => ({ ...prev, photo: url }));
    if (isOwnProfile) updateUser({ photo: url });
  }

  if (loadingProfile) {
    return (
      <div className="min-h-screen bg-ink-100 dark:bg-ink-950">
        <Navbar />
        <p className="py-16 text-center text-ink-400 dark:text-ink-500">⏳ بيحمّل البروفايل...</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-ink-100 dark:bg-ink-950">
        <Navbar />
        <p className="py-16 text-center text-ink-400 dark:text-ink-500">😕 المستخدم مش موجود</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ink-100 dark:bg-ink-950">
      <Navbar />
      <main className="mx-auto max-w-xl px-3 py-4 sm:px-4 sm:py-6">
        {/* بطاقة البروفايل */}
        <div className="mb-4 overflow-hidden rounded-xl2 border border-ink-100/60 bg-white shadow-card dark:border-ink-800 dark:bg-ink-800">
          <div className="h-24 bg-gradient-to-l from-brand-400 to-brand-600" />
          <div className="-mt-12 flex flex-col items-start gap-3 px-4 pb-4 sm:flex-row sm:items-end sm:justify-between sm:px-5 sm:pb-5">
            <AvatarUploader
              photo={profile.photo}
              editable={isOwnProfile}
              onUploaded={handlePhotoUploaded}
            />
            {isOwnProfile && (
              <button
                onClick={() => setEditing(true)}
                className="rounded-full border border-ink-200 bg-white px-4 py-1.5 text-sm font-medium text-ink-700 shadow-soft hover:bg-ink-50 dark:border-ink-600 dark:bg-ink-700 dark:text-ink-200 dark:hover:bg-ink-600 sm:mb-1"
              >
                ✏️ تعديل البروفايل
              </button>
            )}
          </div>
          <div className="px-4 pb-4 sm:px-5 sm:pb-5">
            <h1 className="text-lg font-bold text-ink-900 dark:text-ink-100">{profile.name || "مستخدم"}</h1>
            {isOwnProfile && profile.email && (
              <p className="text-sm text-ink-400 dark:text-ink-500">{profile.email}</p>
            )}
            <p className="mt-1 text-sm text-ink-500 dark:text-ink-400">{posts.length > 0 ? `📝 ${posts.length} منشور` : ""}</p>
          </div>
        </div>

        {/* منشورات المستخدم */}
        {loadingPosts && posts.length === 0 ? (
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
                onDeleted={(id) => setPosts((prev) => prev.filter((p) => p._id !== id))}
                onUpdated={(updated) =>
                  setPosts((prev) => prev.map((p) => (p._id === updated._id ? { ...p, ...updated } : p)))
                }
              />
            ))}

            {posts.length === 0 && (
              <div className="py-16 text-center text-ink-400 dark:text-ink-500">
                <p className="text-3xl">🗒️</p>
                <p className="mt-2 text-sm">لسه مفيش منشورات هنا</p>
              </div>
            )}

            {hasMore && posts.length > 0 && (
              <button
                onClick={() => loadPosts(isOwnProfile ? me._id : userId, page + 1)}
                className="mx-auto mt-1 block w-full max-w-xs rounded-full border border-ink-100 bg-white px-5 py-2 text-sm font-medium text-brand-600 shadow-soft hover:bg-brand-50 dark:border-ink-700 dark:bg-ink-800 dark:hover:bg-ink-700 sm:w-auto"
              >
                ⬇️ تحميل منشورات أكتر
              </button>
            )}
          </>
        )}
      </main>

      {editing && (
        <EditProfileModal
          user={profile}
          onClose={() => setEditing(false)}
          onSaved={handleProfileUpdated}
        />
      )}
    </div>
  );
}
