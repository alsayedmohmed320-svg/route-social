import { useState } from "react";
import { Link } from "react-router-dom";
import LikeButton from "./LikeButton";
import CommentsSection from "./CommentsSection";
import PostOptionsMenu from "./PostOptionsMenu";
import EditPostModal from "./EditPostModal";
import ConfirmDialog from "./ConfirmDialog";
import { toggleLike, deletePost } from "../api/posts";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

// بيتأكد هل المستخدم الحالي عامل لايك بالفعل، عن طريق فحص وجود الـ id بتاعه
// جوه مصفوفة likes اللي بترجع من السيرفر (مصفوفة ids أو objects حسب الحالة)
function checkIsLiked(likes, currentUserId) {
  if (!currentUserId || !Array.isArray(likes)) return false;
  return likes.some((item) => (typeof item === "string" ? item === currentUserId : item?._id === currentUserId));
}

export default function PostCard({ post, onDeleted, onUpdated }) {
  const { user: currentUser } = useAuth();
  const { showToast } = useToast();
  const author = post.user || {};
  const [isLiked, setIsLiked] = useState(checkIsLiked(post.likes, currentUser?._id));
  const [likesCount, setLikesCount] = useState(post.likesCount ?? post.likes?.length ?? 0);
  const [editing, setEditing] = useState(false);
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const isOwner = Boolean(currentUser?._id && author?._id && currentUser._id === author._id);

  async function handleToggleLike() {
    setIsLiked((prev) => !prev);
    setLikesCount((prev) => (isLiked ? prev - 1 : prev + 1));
    try {
      await toggleLike(post._id);
    } catch (err) {
      setIsLiked((prev) => !prev);
      setLikesCount((prev) => (isLiked ? prev + 1 : prev - 1));
      showToast("مقدرناش نسجل الإعجاب دلوقتي", "error");
    }
  }

  async function handleDelete() {
    setDeleting(true);
    try {
      await deletePost(post._id);
      onDeleted?.(post._id);
    } catch (err) {
      setConfirmingDelete(false);
      setDeleting(false);
      showToast("مقدرناش نحذف المنشور دلوقتي", "error");
    }
  }

  return (
    <article className="mb-4 rounded-xl2 border border-ink-100/60 bg-white p-3 shadow-card dark:border-ink-800 dark:bg-ink-800 sm:p-4">
      <div className="flex items-center justify-between gap-2">
        <Link to={author?._id ? `/profile/${author._id}` : "#"} className="flex min-w-0 items-center gap-2 sm:gap-2.5">
          <img
            src={author?.photo || "https://placehold.co/40x40?text=%20"}
            alt={author?.name || "مستخدم"}
            className="h-9 w-9 shrink-0 rounded-full object-cover ring-1 ring-ink-100 dark:ring-ink-700 sm:h-11 sm:w-11"
          />
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-ink-800 dark:text-ink-100">
              {author?.name || "مستخدم"}
            </p>
            <p className="text-xs text-ink-400 dark:text-ink-500">
              {post.createdAt
                ? new Date(post.createdAt).toLocaleString("ar-EG", {
                    day: "numeric",
                    month: "short",
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : ""}
            </p>
          </div>
        </Link>

        {isOwner && (
          <PostOptionsMenu onEdit={() => setEditing(true)} onDelete={() => setConfirmingDelete(true)} />
        )}
      </div>

      {post.body && (
        <p className="mt-3 whitespace-pre-line break-words leading-relaxed text-ink-800 dark:text-ink-100">
          {post.body}
        </p>
      )}

      {post.image && (
        <img
          src={post.image}
          alt=""
          className="mt-3 max-h-72 w-full rounded-lg border border-ink-100 object-cover dark:border-ink-700 sm:max-h-[28rem]"
        />
      )}

      <div className="mt-3 flex items-center gap-4 border-t border-ink-100 pt-2 dark:border-ink-700">
        <LikeButton isLiked={isLiked} likesCount={likesCount} onToggle={handleToggleLike} />
        {typeof post.commentsCount === "number" && (
          <span className="text-sm text-ink-400 dark:text-ink-500">{post.commentsCount} تعليق</span>
        )}
      </div>

      <CommentsSection postId={post._id} />

      {editing && (
        <EditPostModal
          post={post}
          onClose={() => setEditing(false)}
          onSaved={(updated) => {
            setEditing(false);
            onUpdated?.(updated);
          }}
        />
      )}

      {confirmingDelete && (
        <ConfirmDialog
          title="حذف المنشور"
          message="متأكد إنك عايز تحذف المنشور ده؟ الخطوة دي مينفعش نرجع فيها."
          confirmLabel={deleting ? "بيحذف..." : "حذف"}
          danger
          onConfirm={handleDelete}
          onCancel={() => setConfirmingDelete(false)}
        />
      )}
    </article>
  );
}
