import { useState } from "react";
import { createPost } from "../api/posts";
import { useAuth } from "../context/AuthContext";

export default function CreatePost({ onCreated }) {
  const { user } = useAuth();
  const [body, setBody] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function handleImageChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setImage(file);
    setPreview(URL.createObjectURL(file));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!body.trim() && !image) return;
    setLoading(true);
    setError("");
    try {
      const formData = new FormData();
      formData.append("body", body);
      if (image) formData.append("image", image);

      const res = await createPost(formData);
      const newPost = res.data?.data || res.data;
      onCreated?.(newPost);
      setBody("");
      setImage(null);
      setPreview(null);
    } catch (err) {
      setError(err.response?.data?.message || "حصل خطأ أثناء نشر البوست");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mb-4 rounded-xl2 border border-ink-100/60 bg-white p-3 shadow-card dark:border-ink-800 dark:bg-ink-800 sm:p-4">
      <div className="flex gap-2.5 sm:gap-3">
        <img
          src={user?.photo || "https://placehold.co/40x40"}
          alt=""
          className="h-9 w-9 shrink-0 rounded-full object-cover sm:h-10 sm:w-10"
        />
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="بتفكر في ايه؟"
          rows={2}
          className="flex-1 resize-none rounded-lg border border-ink-200 p-2 text-sm outline-none focus:border-brand-400 dark:border-ink-600 dark:bg-ink-900 dark:text-ink-100"
        />
      </div>

      {preview && (
        <img src={preview} alt="preview" className="mt-3 max-h-64 w-full rounded-lg object-cover" />
      )}

      {error && <p className="mt-2 text-sm text-red-500">{error}</p>}

      <div className="mt-3 flex items-center justify-between">
        <label className="cursor-pointer text-sm font-medium text-ink-500 hover:text-brand-600 dark:text-ink-400">
          📷 <span className="hidden sm:inline">إضافة صورة</span>
          <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
        </label>
        <button
          type="submit"
          disabled={loading || (!body.trim() && !image)}
          className="rounded-full bg-brand-500 px-5 py-1.5 text-sm font-medium text-white disabled:opacity-50"
        >
          {loading ? "بينشر..." : "نشر"}
        </button>
      </div>
    </form>
  );
}
