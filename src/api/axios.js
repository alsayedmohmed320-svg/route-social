import axios from "axios";

// عدّل الرابط ده لو الـ API اتغير، أو حطه في ملف .env باسم VITE_API_BASE_URL
const BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "https://route-posts.routemisr.com";

const api = axios.create({
  baseURL: BASE_URL,
});

// كل request بيتبعت، بنحط التوكن تلقائي لو موجود في localStorage
// المشروع المرجعي بيستخدم الاتنين (Authorization: Bearer و header اسمه token) في أماكن مختلفة،
// فبنبعتهم مع بعض عشان نضمن التوافق أيًّا كان الـ endpoint بيدور على إيه
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    config.headers.token = token;
  }
  return config;
});

// لو التوكن انتهى أو مرفوض، نمسحه ونرجع المستخدم لصفحة تسجيل الدخول
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("tokenExpiry");
      localStorage.removeItem("user");
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default api;
