import { useState } from "react";
import { updateProfileData, changePassword } from "../api/auth";
import { useToast } from "../context/ToastContext";

export default function EditProfileModal({ user, onClose, onSaved }) {
  const { showToast } = useToast();
  const [tab, setTab] = useState("info"); // info | password
  const [name, setName] = useState(user.name || "");
  const [savingInfo, setSavingInfo] = useState(false);
  const [infoError, setInfoError] = useState("");

  const [passwords, setPasswords] = useState({ currentPassword: "", password: "", rePassword: "" });
  const [savingPassword, setSavingPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");

  async function handleSaveInfo(e) {
    e.preventDefault();
    setSavingInfo(true);
    setInfoError("");
    try {
      const res = await updateProfileData({ name });
      const updated = res.data?.data || res.data;
      onSaved({ ...user, ...updated, name });
      showToast("تم تحديث البيانات", "success");
    } catch (err) {
      setInfoError(err.response?.data?.message || "مقدرناش نحفظ الاسم دلوقتي");
    } finally {
      setSavingInfo(false);
    }
  }

  async function handleChangePassword(e) {
    e.preventDefault();
    if (passwords.password !== passwords.rePassword) {
      setPasswordError("كلمة المرور الجديدة وتأكيدها مش متطابقين");
      return;
    }
    setSavingPassword(true);
    setPasswordError("");
    try {
      await changePassword(passwords);
      setPasswords({ currentPassword: "", password: "", rePassword: "" });
      showToast("تم تغيير كلمة المرور بنجاح", "success");
    } catch (err) {
      setPasswordError(err.response?.data?.message || "مقدرناش نغيّر كلمة المرور، تأكد من الباسورد الحالي");
    } finally {
      setSavingPassword(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 sm:items-center sm:p-4">
      <div className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-t-xl2 bg-white p-4 shadow-card dark:bg-ink-800 sm:rounded-xl2 sm:p-5">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-base font-semibold text-ink-800 dark:text-ink-100">⚙️ تعديل البروفايل</h3>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full text-ink-400 hover:bg-ink-100 dark:text-ink-500 dark:hover:bg-ink-700"
          >
            ✕
          </button>
        </div>

        <div className="mb-4 flex gap-1 rounded-lg bg-ink-100 p-1 text-sm dark:bg-ink-900">
          <button
            onClick={() => setTab("info")}
            className={`flex-1 rounded-md py-1.5 font-medium transition ${
              tab === "info"
                ? "bg-white text-brand-600 shadow-soft dark:bg-ink-700 dark:text-brand-400"
                : "text-ink-500 dark:text-ink-400"
            }`}
          >
            👤 البيانات
          </button>
          <button
            onClick={() => setTab("password")}
            className={`flex-1 rounded-md py-1.5 font-medium transition ${
              tab === "password"
                ? "bg-white text-brand-600 shadow-soft dark:bg-ink-700 dark:text-brand-400"
                : "text-ink-500 dark:text-ink-400"
            }`}
          >
            🔒 كلمة المرور
          </button>
        </div>

        {tab === "info" ? (
          <form onSubmit={handleSaveInfo}>
            <label className="mb-1 block text-sm font-medium text-ink-700 dark:text-ink-200">الاسم</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="mb-3 w-full rounded-lg border border-ink-200 px-3 py-2 text-sm outline-none focus:border-brand-400 dark:border-ink-600 dark:bg-ink-900 dark:text-ink-100"
            />
            {infoError && <p className="mb-2 text-sm text-red-500">{infoError}</p>}
            <button
              type="submit"
              disabled={savingInfo || !name.trim()}
              className="w-full rounded-lg bg-brand-500 py-2 text-sm font-medium text-white hover:bg-brand-600 disabled:opacity-50"
            >
              {savingInfo ? "بيحفظ... ⏳" : "💾 حفظ التعديلات"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleChangePassword}>
            <label className="mb-1 block text-sm font-medium text-ink-700 dark:text-ink-200">كلمة المرور الحالية</label>
            <input
              type="password"
              value={passwords.currentPassword}
              onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })}
              required
              className="mb-3 w-full rounded-lg border border-ink-200 px-3 py-2 text-sm outline-none focus:border-brand-400 dark:border-ink-600 dark:bg-ink-900 dark:text-ink-100"
            />
            <label className="mb-1 block text-sm font-medium text-ink-700 dark:text-ink-200">كلمة المرور الجديدة</label>
            <input
              type="password"
              value={passwords.password}
              onChange={(e) => setPasswords({ ...passwords, password: e.target.value })}
              required
              className="mb-3 w-full rounded-lg border border-ink-200 px-3 py-2 text-sm outline-none focus:border-brand-400 dark:border-ink-600 dark:bg-ink-900 dark:text-ink-100"
            />
            <label className="mb-1 block text-sm font-medium text-ink-700 dark:text-ink-200">تأكيد كلمة المرور الجديدة</label>
            <input
              type="password"
              value={passwords.rePassword}
              onChange={(e) => setPasswords({ ...passwords, rePassword: e.target.value })}
              required
              className="mb-3 w-full rounded-lg border border-ink-200 px-3 py-2 text-sm outline-none focus:border-brand-400 dark:border-ink-600 dark:bg-ink-900 dark:text-ink-100"
            />

            {passwordError && <p className="mb-2 text-sm text-red-500">{passwordError}</p>}

            <button
              type="submit"
              disabled={savingPassword}
              className="w-full rounded-lg bg-brand-500 py-2 text-sm font-medium text-white hover:bg-brand-600 disabled:opacity-50"
            >
              {savingPassword ? "بيحفظ... ⏳" : "🔑 تغيير كلمة المرور"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
