import api from "./axios";

// مؤكد: GET /posts/:postId/comments?page=&limit=
export const getComments = (postId, page = 1, limit = 10) =>
  api.get(`/posts/${postId}/comments`, { params: { page, limit } });

// مؤكد: POST /posts/:postId/comments كـ FormData بحقل "content" (+ صورة اختيارية بحقل "image")
export const addComment = (postId, { content, image }) => {
  const formData = new FormData();
  formData.append("content", content);
  if (image) formData.append("image", image);
  return api.post(`/posts/${postId}/comments`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

// ملحوظة: تعديل/حذف/لايك التعليق مش موجودين في الـ API الحقيقي حسب المشروع المرجعي،
// فمسيبناهمش في الواجهة عشان منضيفش زرار هيرجع 404.
