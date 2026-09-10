import { useState } from "react";
import { updatePost } from "../api/posts";

export default function EditPostModal({ post, onClose, onSaved }) {
  const [body, setBody] = useState(post.body || "");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(post.image || null);
  const [removeImage, setRemoveImage] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function handleImageChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setImage(file);
    setRemoveImage(false);
    setPreview(URL.createObjectURL(file));
  }

  function handleRemoveImage() {
    setImage(null);
    setPreview(null);
    setRemoveImage(true);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const formData = new FormData();
      formData.append("body", body);
      if (image) formData.append("image", image);
      if (removeImage) formData.append("removeImage", "true");

      const res = await updatePost(post._id, formData);
      const updated = res.data?.data || res.data;
      onSaved({ ...post, ...updated, body, image: removeImage ? null : updated?.image || preview });
    } catch (err) {
      setError(err.response?.data?.message || "مقدرناش نحفظ التعديل دلوقتي");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 sm:items-center sm:p-4">
      <div className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-t-xl2 bg-white p-5 shadow-card dark:bg-ink-800 sm:rounded-xl2">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-base font-semibold text-ink-800 dark:text-ink-100">تعديل المنشور</h3>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full text-ink-400 hover:bg-ink-100 dark:text-ink-500 dark:hover:bg-ink-700"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={4}
            className="w-full resize-none rounded-lg border border-ink-200 p-3 text-sm outline-none focus:border-brand-400 dark:border-ink-600 dark:bg-ink-900 dark:text-ink-100"
          />

          {preview && (
            <div className="relative mt-3">
              <img src={preview} alt="preview" className="max-h-56 w-full rounded-lg object-cover" />
              <button
                type="button"
                onClick={handleRemoveImage}
                className="absolute left-2 top-2 rounded-full bg-black/60 px-2 py-1 text-xs text-white"
              >
                إزالة الصورة
              </button>
            </div>
          )}

          {error && <p className="mt-2 text-sm text-red-500">{error}</p>}

          <div className="mt-3 flex flex-col-reverse items-stretch justify-between gap-3 sm:flex-row sm:items-center">
            <label className="cursor-pointer text-sm font-medium text-ink-500 hover:text-brand-600 dark:text-ink-400">
              📷 {preview ? "تغيير الصورة" : "إضافة صورة"}
              <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
            </label>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 rounded-lg px-4 py-2 text-sm font-medium text-ink-600 hover:bg-ink-100 dark:text-ink-300 dark:hover:bg-ink-700 sm:flex-none"
              >
                إلغاء
              </button>
              <button
                type="submit"
                disabled={loading || !body.trim()}
                className="flex-1 rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white hover:bg-brand-600 disabled:opacity-50 sm:flex-none"
              >
                {loading ? "بيحفظ..." : "حفظ"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
