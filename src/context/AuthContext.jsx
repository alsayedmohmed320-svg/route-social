import { createContext, useContext, useEffect, useRef, useState } from "react";
import { signin as signinApi, signup as signupApi, getProfile } from "../api/auth";

const AuthContext = createContext(null);

// مدة صلاحية الجلسة: 30 دقيقة من وقت تسجيل الدخول، حتى لو التاب فاضل مفتوح
const SESSION_DURATION_MS = 30 * 60 * 1000;

function saveSession(token) {
  localStorage.setItem("token", token);
  localStorage.setItem("tokenExpiry", String(Date.now() + SESSION_DURATION_MS));
}

function clearSession() {
  localStorage.removeItem("token");
  localStorage.removeItem("tokenExpiry");
  localStorage.removeItem("user");
}

function getRemainingSessionMs() {
  const expiry = Number(localStorage.getItem("tokenExpiry"));
  if (!expiry) return 0;
  return expiry - Date.now();
}

// الرد بتاع /users/profile-data بييجي متداخل: { message, data: { user: {...} } }
// الدالة دي بتسحب كائن اليوزر أيًّا كان شكل الرد عشان تفضل شغالة حتى لو الشكل اتغيّر شوية
function extractUser(resData) {
  return resData?.data?.user || resData?.user || resData?.data || resData;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });
  const [loading, setLoading] = useState(true);
  const logoutTimerRef = useRef(null);

  function scheduleAutoLogout(ms) {
    if (logoutTimerRef.current) clearTimeout(logoutTimerRef.current);
    logoutTimerRef.current = setTimeout(() => {
      clearSession();
      setUser(null);
    }, ms);
  }

  // لو فيه توكن محفوظ، بنتأكد الأول إن الـ 30 دقيقة لسه ما خلصتش قبل ما نجيب البروفايل
  useEffect(() => {
    const token = localStorage.getItem("token");
    const remaining = getRemainingSessionMs();

    if (!token || remaining <= 0) {
      clearSession();
      setUser(null);
      setLoading(false);
      return;
    }

    getProfile()
      .then((res) => {
        const profile = extractUser(res.data);
        setUser(profile);
        localStorage.setItem("user", JSON.stringify(profile));
      })
      .catch(() => {
        clearSession();
        setUser(null);
      })
      .finally(() => setLoading(false));

    // مؤقّت بيسجّل خروج تلقائي بمجرد ما الـ 30 دقيقة تخلص، حتى لو التاب فاضل مفتوح من غير ريفريش
    scheduleAutoLogout(remaining);
  }, []);

  // بعد تسجيل الدخول، رد الـ API غالبًا بيرجع التوكن بس من غير كل بيانات اليوزر،
  // فبنخزن التوكن الأول وبعدين نجيب البروفايل الكامل بـ /users/profile-data
  async function login(credentials) {
    const res = await signinApi(credentials);
    const token = res.data?.data?.token || res.data?.token;
    if (!token) throw new Error("لم يتم استلام رمز الدخول من السيرفر");
    saveSession(token);
    scheduleAutoLogout(SESSION_DURATION_MS);

    try {
      const profileRes = await getProfile();
      const profile = extractUser(profileRes.data);
      localStorage.setItem("user", JSON.stringify(profile));
      setUser(profile);
      return profile;
    } catch {
      // لو فشل جلب البروفايل بعد الدخول، على الأقل التوكن موجود وهيشتغل الـ app
      setUser({});
      return {};
    }
  }

  async function register(payload) {
    const res = await signupApi(payload);
    const token = res.data?.data?.token || res.data?.token;
    if (token) {
      saveSession(token);
      scheduleAutoLogout(SESSION_DURATION_MS);
      try {
        const profileRes = await getProfile();
        const profile = extractUser(profileRes.data);
        localStorage.setItem("user", JSON.stringify(profile));
        setUser(profile);
      } catch {
        setUser({});
      }
    }
    // لو السيرفر ميرجعش توكن مباشرة بعد التسجيل، الصفحة هتوجه المستخدم لتسجيل الدخول يدويًا
    return { token };
  }

  function logout() {
    if (logoutTimerRef.current) clearTimeout(logoutTimerRef.current);
    clearSession();
    setUser(null);
  }

  // بيتنادى من صفحة البروفايل بعد تعديل الاسم أو الصورة عشان كل الصفحات (النافبار، البوستات) تتحدث فورًا
  function updateUser(patch) {
    setUser((prev) => {
      const next = { ...prev, ...patch };
      localStorage.setItem("user", JSON.stringify(next));
      return next;
    });
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
