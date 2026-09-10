import { useRef, useState } from "react";
import CommentItem from "./CommentItem";
import { getComments, addComment } from "../api/comments";
import { useToast } from "../context/ToastContext";

export default function CommentsSection({ postId }) {
  const { showToast } = useToast();
  const [comments, setComments] = useState(null); // null = لسه متجابتش
  const [text, setText] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [posting, setPosting] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const fileInputRef = useRef(null);

  async function loadComments(nextPage = 1) {
    setLoading(true);
    try {
      const res = await getComments(postId, nextPage, 10);
      const data = res.data?.data || res.data;
      const list = Array.isArray(data) ? data : data.comments || [];
      setComments((prev) => (nextPage === 1 ? list : [...(prev || []), ...list]));
      setHasMore(list.length === 10);
      setPage(nextPage);
    } catch (err) {
      console.error(err);
      showToast("مقدرناش نجيب التعليقات دلوقتي", "error");
    } finally {
      setLoading(false);
    }
  }

  function handleOpen() {
    if (comments === null) loadComments(1);
  }

  function handleImageChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setImage(file);
    setPreview(URL.createObjectURL(file));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!text.trim() && !image) return;
    if (posting) return;
    setPosting(true);
    try {
      await addComment(postId, { content: text, image });
      setText("");
      setImage(null);
      setPreview(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      // نعيد تحميل التعليقات من أول صفحة عشان نضمن إننا شايفين شكل الرد الحقيقي من السيرفر
      await loadComments(1);
    } catch (err) {
      console.error(err);
      showToast("مقدرناش ننشر التعليق دلوقتي", "error");
    } finally {
      setPosting(false);
    }
  }

  return (
    <div className="mt-2 border-t border-ink-100 pt-2 dark:border-ink-700">
      {comments === null ? (
        <button onClick={handleOpen} className="text-sm font-medium text-ink-500 hover:text-brand-600 dark:text-ink-400">
          💬 عرض التعليقات
        </button>
      ) : (
        <>
          <div className="max-h-72 overflow-y-auto">
            {comments.length === 0 && (
              <p className="py-2 text-sm text-ink-400 dark:text-ink-500">لسه مفيش تعليقات، كن أول واحد يعلّق 🙂</p>
            )}
            {comments.map((c) => (
              <CommentItem key={c._id} comment={c} />
            ))}
          </div>
          {hasMore && (
            <button
              disabled={loading}
              onClick={() => loadComments(page + 1)}
              className="mt-1 text-xs font-medium text-brand-600 hover:underline"
            >
              {loading ? "بيحمّل... ⏳" : "⬇️ تحميل تعليقات أكتر"}
            </button>
          )}
        </>
      )}

      <form onSubmit={handleSubmit} className="mt-2">
        {preview && (
          <img src={preview} alt="preview" className="mb-2 max-h-32 rounded-lg object-cover" />
        )}
        <div className="flex items-center gap-1.5 sm:gap-2">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="اكتب تعليق... ✍️"
            className="min-w-0 flex-1 rounded-full border border-ink-200 px-3 py-1.5 text-sm outline-none focus:border-brand-400 dark:border-ink-600 dark:bg-ink-900 dark:text-ink-100 sm:px-4"
          />
          <label className="shrink-0 cursor-pointer text-lg" title="إضافة صورة">
            📷
            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
          </label>
          <button
            type="submit"
            disabled={posting || (!text.trim() && !image)}
            className="shrink-0 rounded-full bg-brand-500 px-3 py-1.5 text-sm font-medium text-white disabled:opacity-50 sm:px-4"
          >
            📤
          </button>
        </div>
      </form>
    </div>
  );
}
