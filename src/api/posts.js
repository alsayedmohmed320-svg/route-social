import api from "./axios";

// endpoint الفيد الحقيقي: GET /posts?limit=&page=&sort=-createdAt (مؤكد من مشروع شغال فعليًا)
export const getFeed = (page = 1, limit = 10) =>
  api.get(`/posts`, { params: { page, limit, sort: "-createdAt" } });

export const createPost = (formData) =>
  api.post(`/posts`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const updatePost = (postId, formData) =>
  api.put(`/posts/${postId}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

// توجل لايك/أنلايك ببوست واحد (مؤكد): PUT /posts/:id/like من غير body
export const toggleLike = (postId) => api.put(`/posts/${postId}/like`, {});

export const deletePost = (postId) => api.delete(`/posts/${postId}`);

// بوستات مستخدم معين (مؤكد): GET /users/:userId/posts
export const getUserPosts = (userId, page = 1, limit = 10) =>
  api.get(`/users/${userId}/posts`, { params: { page, limit } });

// الميزتين دول مش موجودين في المشروع المرجعي، سايبينهم لو الـ API بيدعمهم فعلاً
export const toggleBookmark = (postId) => api.put(`/posts/${postId}/bookmark`);
export const sharePost = (postId) => api.post(`/posts/${postId}/share`);
