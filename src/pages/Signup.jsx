import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Signup() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    rePassword: "",
    dateOfBirth: "",
    gender: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function validate() {
    if (form.name.trim().length < 3 || form.name.trim().length > 10) {
      return "الاسم لازم يكون بين 3 و10 حروف";
    }
    if (form.password.length < 4) {
      return "كلمة المرور لازم تكون 4 أحرف على الأقل";
    }
    if (form.password !== form.rePassword) {
      return "كلمة المرور وتأكيدها مش متطابقين";
    }
    if (form.dateOfBirth) {
      const age = new Date().getFullYear() - new Date(form.dateOfBirth).getFullYear();
      if (age < 20) return "لازم يكون عمرك 20 سنة على الأقل";
    }
    return "";
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }
    setLoading(true);
    setError("");
    try {
      const result = await register(form);
      if (result?.token) {
        navigate("/");
      } else {
        // لو السيرفر ميرجعش توكن مباشرة، نوجه المستخدم يسجل دخول يدوي
        navigate("/login");
      }
    } catch (err) {
      const apiError = err.response?.data;
      setError(
        apiError?.errors?.join(" - ") || apiError?.message || "حصل خطأ أثناء التسجيل"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-ink-50 px-4 py-6 dark:bg-ink-950 sm:py-10">
      <form onSubmit={handleSubmit} className="w-full max-w-md rounded-xl2 border border-ink-100/60 bg-white p-5 shadow-card dark:border-ink-800 dark:bg-ink-800 sm:p-7">
        <h1 className="mb-6 text-center text-2xl font-bold text-brand-600">✨ إنشاء حساب</h1>

        {error && (
          <p className="mb-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600 dark:bg-red-950/60 dark:text-red-300">{error}</p>
        )}

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-ink-700 dark:text-ink-200">الاسم</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              maxLength={10}
              className="w-full rounded-lg border border-ink-200 px-3 py-2 outline-none focus:border-brand-400 dark:border-ink-600 dark:bg-ink-900 dark:text-ink-100"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-ink-700 dark:text-ink-200">اسم المستخدم</label>
            <input
              name="username"
              value={form.username}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-ink-200 px-3 py-2 outline-none focus:border-brand-400 dark:border-ink-600 dark:bg-ink-900 dark:text-ink-100"
            />
          </div>
        </div>

        <label className="mb-1 mt-3 block text-sm font-medium text-ink-700 dark:text-ink-200">البريد الإلكتروني</label>
        <input
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          required
          className="mb-3 w-full rounded-lg border border-ink-200 px-3 py-2 outline-none focus:border-brand-400 dark:border-ink-600 dark:bg-ink-900 dark:text-ink-100"
        />

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-ink-700 dark:text-ink-200">كلمة المرور</label>
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-ink-200 px-3 py-2 outline-none focus:border-brand-400 dark:border-ink-600 dark:bg-ink-900 dark:text-ink-100"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-ink-700 dark:text-ink-200">تأكيد كلمة المرور</label>
            <input
              name="rePassword"
              type="password"
              value={form.rePassword}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-ink-200 px-3 py-2 outline-none focus:border-brand-400 dark:border-ink-600 dark:bg-ink-900 dark:text-ink-100"
            />
          </div>
        </div>

        <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-ink-700 dark:text-ink-200">تاريخ الميلاد</label>
            <input
              name="dateOfBirth"
              type="date"
              value={form.dateOfBirth}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-ink-200 px-3 py-2 outline-none focus:border-brand-400 dark:border-ink-600 dark:bg-ink-900 dark:text-ink-100"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-ink-700 dark:text-ink-200">النوع</label>
            <select
              name="gender"
              value={form.gender}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-ink-200 px-3 py-2 outline-none focus:border-brand-400 dark:border-ink-600 dark:bg-ink-900 dark:text-ink-100"
            >
              <option value="">اختر</option>
              <option value="male">ذكر</option>
              <option value="female">أنثى</option>
            </select>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="mt-5 w-full rounded-lg bg-brand-500 py-2 font-medium text-white hover:bg-brand-600 disabled:opacity-50"
        >
          {loading ? "بيسجل... ⏳" : "🚀 تسجيل"}
        </button>

        <p className="mt-4 text-center text-sm text-ink-500 dark:text-ink-400">
          عندك حساب بالفعل؟{" "}
          <Link to="/login" className="font-medium text-brand-600">
            سجل دخول
          </Link>
        </p>
      </form>
    </div>
  );
}
