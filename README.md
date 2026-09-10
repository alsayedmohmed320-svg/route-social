# Route Social — مشروع React زي فيسبوك مبسّط

مبني بـ **React + Vite + Tailwind CSS**، وبيتكلم مع الـ API بتاعك:
`https://route-posts.routemisr.com`

## المميزات

- تسجيل دخول / إنشاء حساب (name, username, email, password, rePassword, dateOfBirth, gender)
- عرض المنشورات (Feed) مع تحميل صفحات إضافية (Load more) وشكل Skeleton أثناء التحميل
- إنشاء منشور جديد (نص + صورة اختيارية)
- **تعديل وحذف المنشور** (بيظهر زرار الخيارات بس لصاحب المنشور)
- إعجاب / إلغاء إعجاب على المنشور (Like / Unlike) بتحديث فوري (optimistic update)
- عرض التعليقات على كل منشور + إضافة تعليق جديد (نص + صورة اختيارية)
- **صفحة بروفايل** (`/profile`) بتعرض بياناتك ومنشوراتك، مع تعديل الاسم والصورة الشخصية وتغيير كلمة المرور
- عرض بروفايل أي مستخدم تاني (`/profile/:userId`) بشكل للقراءة بس، عن طريق الضغط على اسم أو صورة صاحب أي منشور
- ديزاين مودرن مينيمال بألوان هادية وخط IBM Plex Sans Arabic
- **ريسبونسيف بالكامل** (موبايل / تابلت / ديسكتوب) — المودالز بتتحول لـ bottom-sheet على الموبايل، والنصوص والصور بتتأقلم مع حجم الشاشة
- **Dark Mode** كامل مع زرار تبديل في الـ Navbar، بيحفظ اختيارك في `localStorage` وبيحترم إعداد نظام تشغيلك لأول مرة
- **إشعارات Toast** بدل الرسائل الثابتة (نجاح نشر/تعديل/حذف بوست، فشل لايك أو تعليق، إلخ)

## التشغيل

```bash
cd route-social
npm install
cp .env.example .env
npm run dev
```

المشروع هيشتغل على `http://localhost:5173`.

## مصدر معلومات الـ API

بعد ما بعتلي مشروع React تاني شغال فعليًا على نفس الـ API، قدرت أتأكد من شكل الـ endpoints والـ responses الحقيقية بالظبط بدل التخمين. الجدول ده بيوضح الفرق بين اللي كان متخمّن الأول واللي اتأكد فعليًا:

### ✅ مؤكدة 100% (من مشروع شغال فعليًا على نفس الـ API)

| الميزة | Endpoint | ملاحظات |
|---|---|---|
| تسجيل دخول | `POST /users/signin` | `{ email, password }` |
| تسجيل حساب | `POST /users/signup` | `{ name, username, email, password, rePassword, dateOfBirth, gender }` — الاسم من 3 لـ 10 حروف، الباسورد 4 حروف فأكتر، العمر 20 سنة فأكتر |
| بيانات البروفايل | `GET /users/profile-data` | الرد متداخل: `{ data: { user: {...} } }` |
| الفيد | `GET /posts?page=&limit=&sort=-createdAt` | مفيش `/posts/feed` |
| بوستات مستخدم | `GET /users/:userId/posts` | مش `/posts/user/:id` |
| إنشاء بوست | `POST /posts` | FormData: `body`, `image` (اختياري) |
| تعديل بوست | `PUT /posts/:postId` | FormData: نفس حقول الإنشاء |
| حذف بوست | `DELETE /posts/:postId` | - |
| لايك/أنلايك بوست | `PUT /posts/:postId/like` | زرار واحد بيعمل toggle، من غير endpoint منفصل للـ unlike |
| تعليقات البوست | `GET /posts/:postId/comments?page=&limit=` | - |
| إضافة تعليق | `POST /posts/:postId/comments` | FormData: `content` (مش `text`)، `image` اختياري |

**أهم حاجة اتغيّرت في شكل البيانات:** البوست فيه حقل اسمه `user` (مش `author`) وفيه `photo` (مش `profilePhoto`)، والتعليق فيه `commentCreator` (مش `author`) و`content` (مش `text`). ومفيش حقل `isLiked` جاهز من السيرفر — بنحدده إحنا بمقارنة الـ user id بتاعك مع مصفوفة `likes` اللي جوه كل بوست.

**هيدر التوكن:** المشروع المرجعي استخدم `Authorization: Bearer <token>` في بعض الأماكن و header مخصص اسمه `token` في أماكن تانية، فبنبعتهم الاتنين مع كل request عشان نضمن التوافق.

### ⚠️ لسه تخمين (مفيش تأكيد منها في المشروع المرجعي)

مفيش فيه صفحة تعديل بروفايل أو تغيير باسورد أصلاً، فالـ endpoints دي اتسابت زي ما هي كتخمين منطقي. لو حصل معاهم 404، دي أماكنهم بالظبط:

| الميزة | الملف | الـ endpoint المفترض |
|---|---|---|
| تعديل الاسم | `src/api/auth.js` → `updateProfileData` | `PUT /users/profile-data` |
| رفع صورة بروفايل | `src/api/auth.js` → `uploadProfilePhoto` | `PUT /users/upload-photo` (حقل `photo`) |
| بروفايل مستخدم تاني | `src/api/auth.js` → `getUserProfile` | `GET /users/:userId` |
| تغيير كلمة المرور | `src/api/auth.js` → `changePassword` | `PATCH /users/change-password` |

لو حصل خطأ في أي منهم، افتح Network tab وابعتلي الـ Request URL والـ Response body، وهظبطهم فورًا.

**ملحوظة:** شلت ميزة الـ like على التعليقات نفسها من النسخة دي، لأن المشروع المرجعي مفيهوش الميزة دي أصلاً ومفيش تأكيد إن الـ API بيدعمها — أحسن نتجنب زرار هيرجع 404 بدل ما نضيفه على أساس تخمين.

## هيكل المشروع

```
src/
  api/          # كل نداءات الـ API (axios) - auth, posts, comments
  context/      # AuthContext لإدارة حالة تسجيل الدخول في كل الأب
  components/   # عناصر قابلة لإعادة الاستخدام (PostCard, LikeButton, CommentsSection...)
  pages/        # الصفحات (Login, Signup, Feed, Profile)
```

## نصايح للتوسعة

- زرار **Bookmark** و **Share** موجودين في `src/api/posts.js` (`toggleBookmark`, `sharePost`) بس لسه مش متأكد منهم ومش متوصلين بواجهة.
- **Notifications**: لو الـ API بيدعمها، ممكن تضيف صفحة/جرس إشعارات لاحقًا بنفس الباترن المستخدم هنا.
