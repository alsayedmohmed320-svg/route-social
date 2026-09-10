import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await login(form);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "بيانات الدخول غلط");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-ink-50 px-4 py-8 dark:bg-ink-950">
      <form onSubmit={handleSubmit} className="w-full max-w-sm rounded-xl2 border border-ink-100/60 bg-white p-5 shadow-card dark:border-ink-800 dark:bg-ink-800 sm:p-7">
        <h1 className="mb-6 text-center text-2xl font-bold text-brand-600">👋 تسجيل الدخول</h1>

        {error && (
          <p className="mb-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600 dark:bg-red-950/60 dark:text-red-300">{error}</p>
        )}

        <label className="mb-1 block text-sm font-medium text-ink-700 dark:text-ink-200">البريد الإلكتروني</label>
        <input
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          required
          className="mb-3 w-full rounded-lg border border-ink-200 px-3 py-2 outline-none focus:border-brand-400 dark:border-ink-600 dark:bg-ink-900 dark:text-ink-100"
        />

        <label className="mb-1 block text-sm font-medium text-ink-700 dark:text-ink-200">كلمة المرور</label>
        <input
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
          required
          className="mb-4 w-full rounded-lg border border-ink-200 px-3 py-2 outline-none focus:border-brand-400 dark:border-ink-600 dark:bg-ink-900 dark:text-ink-100"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-brand-500 py-2 font-medium text-white hover:bg-brand-600 disabled:opacity-50"
        >
          {loading ? "بيدخل... ⏳" : "🔓 دخول"}
        </button>

        <p className="mt-4 text-center text-sm text-ink-500 dark:text-ink-400">
          مالكش حساب؟{" "}
          <Link to="/signup" className="font-medium text-brand-600">
            اعمل حساب
          </Link>
        </p>
      </form>
    </div>
  );
}
