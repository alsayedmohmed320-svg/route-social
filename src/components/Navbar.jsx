import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import ThemeToggle from "./ThemeToggle";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <nav className="sticky top-0 z-10 flex items-center justify-between border-b border-ink-100 bg-white/90 px-3 py-2.5 backdrop-blur transition-colors dark:border-ink-800 dark:bg-ink-900/90 sm:px-4">
      <Link to="/" className="shrink-0 text-base font-bold text-brand-600 sm:text-lg">
        Route <span className="hidden text-ink-800 dark:text-ink-100 sm:inline">Social</span>
      </Link>
      {user && (
        <div className="flex min-w-0 items-center gap-1 sm:gap-2">
          <ThemeToggle />
          <Link
            to="/profile"
            className="flex min-w-0 items-center gap-2 rounded-full py-1 pl-1 pr-2 hover:bg-ink-100 dark:hover:bg-ink-800 sm:pr-3"
          >
            <span className="hidden max-w-[6rem] truncate text-sm font-medium text-ink-700 dark:text-ink-200 sm:inline">
              {user.name || "حسابي"}
            </span>
            <img
              src={user.photo || "https://placehold.co/32x32?text=%20"}
              alt="صورتي"
              className="h-8 w-8 shrink-0 rounded-full object-cover ring-1 ring-ink-200 dark:ring-ink-700"
            />
          </Link>
          <button
            onClick={handleLogout}
            aria-label="تسجيل خروج"
            className="shrink-0 rounded-lg bg-ink-100 px-2.5 py-1.5 text-xs font-medium text-ink-700 hover:bg-ink-200 dark:bg-ink-800 dark:text-ink-200 dark:hover:bg-ink-700 sm:px-3 sm:text-sm"
          >
            <span className="sm:hidden">⏻</span>
            <span className="hidden sm:inline">تسجيل خروج</span>
          </button>
        </div>
      )}
    </nav>
  );
}
