import { useRef, useState } from "react";
import { uploadProfilePhoto } from "../api/auth";
import { useToast } from "../context/ToastContext";

export default function AvatarUploader({ photo, onUploaded, editable }) {
  const { showToast } = useToast();
  const inputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(null);

  async function handleChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setPreview(URL.createObjectURL(file));
    setUploading(true);
    try {
      const res = await uploadProfilePhoto(file);
      const data = res.data?.data || res.data;
      onUploaded?.(data.photo || data.user?.photo || preview);
      showToast("تم تحديث الصورة الشخصية", "success");
    } catch (err) {
      console.error(err);
      showToast("مقدرناش نرفع الصورة دلوقتي", "error");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="relative h-20 w-20 shrink-0 sm:h-24 sm:w-24">
      <img
        src={preview || photo || "https://placehold.co/96x96?text=%20"}
        alt="الصورة الشخصية"
        className="h-20 w-20 rounded-full border-4 border-white object-cover shadow-card dark:border-ink-800 sm:h-24 sm:w-24"
      />
      {editable && (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="absolute bottom-0 left-0 flex h-8 w-8 items-center justify-center rounded-full bg-brand-500 text-white shadow-soft hover:bg-brand-600"
          aria-label="تغيير الصورة الشخصية"
        >
          {uploading ? "…" : "📷"}
        </button>
      )}
      <input ref={inputRef} type="file" accept="image/*" onChange={handleChange} className="hidden" />
    </div>
  );
}
