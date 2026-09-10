import api from "./axios";

// مؤكد من مشروع شغال فعليًا: الحقول name, username, email, password, rePassword, dateOfBirth, gender
export const signup = (payload) => api.post("/users/signup", payload);

// مؤكد: email + password
export const signin = (payload) => api.post("/users/signin", payload);

// مؤكد: GET /users/profile-data - الرد بييجي متداخل: { data: { user: {...} } }
export const getProfile = () => api.get("/users/profile-data");

// الأربعة اللي تحت مش موجودين في المشروع المرجعي (يعني مفيش تأكيد 100% إن الـ API بيدعمهم)
// سايبينهم زي ما هما كتخمين منطقي - لو رجعوا 404 كلمني وهظبطهم فورًا

// عرض بروفايل مستخدم تاني
export const getUserProfile = (userId) => api.get(`/users/${userId}`);

// تعديل الاسم / البيانات الأساسية
export const updateProfileData = (payload) => api.put("/users/profile-data", payload);

// رفع صورة بروفايل جديدة (multipart) - لاحظ إن حقل الصورة "photo" مش "image" هنا
export const uploadProfilePhoto = (file) => {
  const formData = new FormData();
  formData.append("photo", file);
  return api.put("/users/upload-photo", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

// تغيير كلمة المرور
export const changePassword = (payload) => api.patch("/users/change-password", payload);
