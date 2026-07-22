# 🚀 NexAI - Free AI SaaS Platform

একটি সম্পূর্ণ AI SaaS প্ল্যাটফর্ম যা চ্যাটজিপিটি এবং জেমিনির মতো কাজ করে। **সবকিছু বিনামূল্যে** এবং **Netlify তে ডিপ্লয় করা যায়**।

## ✨ ফিচার

### AI জেনারেটর (Hashtag & Emoji সাপোর্ট সহ)
- 💬 **AI Chat** - স্মার্ট চ্যাট অ্যাসিস্ট্যান্ট
- ✍️ **Content Writer** - যেকোনো কন্টেন্ট তৈরি করুন
- 📝 **Blog Generator** - সম্পূর্ণ ব্লগ পোস্ট
- 💻 **Code Generator** - যেকোনো ভাষায় কোড
- 🌍 **Language Translator** - ২৫+ ভাষায় অনুবাদ
- ✓ **Grammar Checker** - বানান ও ব্যাকরণ চেক
- 📧 **Email Generator** - পেশাদার ইমেইল
- 👍 **Facebook Post** - সোশ্যাল মিডিয়া পোস্ট
- 📸 **Instagram Caption** - ট্রেন্ডি ক্যাপশন
- 🎬 **YouTube Script** - ভিডিও স্ক্রিপ্ট
- 📄 **Document Summarizer** - ডকুমেন্ট সংক্ষিপ্ত করুন

### অন্যান্য ফিচার
- 🔐 সম্পূর্ণ অথেন্টিকেশন (Email + Google)
- 📊 ব্যবহার ট্র্যাকিং এবং অ্যানালিটিক্স
- 🌙 Dark/Light মোড
- 📱 সম্পূর্ণ মোবাইল রেসপন্সিভ
- 🔒 JWT নিরাপত্তা
- ⚡ অতি দ্রুত পারফরমেন্স

## 🛠️ টেক স্ট্যাক

```
Frontend:  Next.js 15 + React + TypeScript + Tailwind CSS
Backend:   Next.js API Routes + Netlify Functions
Database:  Supabase (PostgreSQL) - বিনামূল্যে
AI API:    Hugging Face - বিনামূল্যে
Auth:      Supabase Auth + Google OAuth
Email:     Resend - বিনামূল্যে (১০০০/মাস)
Storage:   Supabase Storage - বিনামূল্যে
Hosting:   Netlify - বিনামূল্যে
```

## 📋 প্রয়োজনীয় জিনিস

আপনার যা দরকার:
- GitHub অ্যাকাউন্ট (বিনামূল্যে)
- Supabase অ্যাকাউন্ট (বিনামূল্যে)
- Netlify অ্যাকাউন্ট (বিনামূল্যে)
- Hugging Face অ্যাকাউন্ট (বিনামূল্যে API)
- Google OAuth (বিনামূল্যে)
- Resend অ্যাকাউন্ট (বিনামূল্যে ইমেইল)

## 🚀 দ্রুত শুরু করুন (5 মিনিট)

### ধাপ 1: GitHub রেপো ক্লোন করুন

```bash
git clone https://github.com/YOUR_USERNAME/nexai.git
cd nexai
```

### ধাপ 2: প্যাকেজ ইনস্টল করুন

```bash
npm install
```

### ধাপ 3: পরিবেশ ভেরিয়েবল সেটআপ করুন

`.env.local` ফাইল তৈরি করুন এবং এটি কপি করুন:

```env
# ========== SUPABASE (বিনামূল্যে) ==========
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
DATABASE_URL=postgresql://user:password@host:5432/nexai

# ========== HUGGING FACE API (বিনামূল্যে) ==========
NEXT_PUBLIC_HF_API_KEY=hf_your_key_here
HF_API_ENDPOINT=https://api-inference.huggingface.co/models

# ========== JWT SECRET ==========
JWT_SECRET=your-super-secret-key-change-this

# ========== EMAIL (Resend - বিনামূল্যে) ==========
RESEND_API_KEY=re_your_key_here

# ========== GOOGLE OAUTH ==========
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret

# ========== APPLICATION ==========
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=NexAI
NODE_ENV=development
```

### ধাপ 4: ডাটাবেস সেটআপ করুন

```bash
npx prisma db push
npx prisma generate
npx prisma db seed   # প্রথম Admin অ্যাকাউন্ট তৈরি করে (.env এ ADMIN_EMAIL/ADMIN_PASSWORD সেট করুন)
```

**Admin লগইন তথ্য (ডিফল্ট, `.env` এ পরিবর্তন করুন):**
```
ইমেইল: admin@nexai.app
পাসওয়ার্ড: Admin@123456
```
⚠️ প্রথম লগইনের পরেই পাসওয়ার্ড পরিবর্তন করুন।

### ধাপ 5: ডেভেলপমেন্ট সার্ভার চালান

```bash
npm run dev
```

ব্রাউজার খুলুন: `http://localhost:3000` 🎉

---

## 🔧 পরিবেশ ভেরিয়েবল - বিস্তারিত গাইড

### Supabase সেটআপ (বিনামূল্যে)

1. [supabase.com](https://supabase.com) এ যান
2. "New Project" ক্লিক করুন
3. নতুন প্রজেক্ট তৈরি করুন
4. "Settings" → "API" এ যান
5. `Project URL` এবং `anon public key` কপি করুন

```
NEXT_PUBLIC_SUPABASE_URL = Project URL
NEXT_PUBLIC_SUPABASE_ANON_KEY = anon public key
SUPABASE_SERVICE_ROLE_KEY = service role secret
DATABASE_URL = PostgreSQL Connection String
```

### Hugging Face API সেটআপ (বিনামূল্যে)

1. [huggingface.co](https://huggingface.co) এ যান
2. Sign up করুন
3. "Settings" → "Access Tokens" এ যান
4. নতুন token তৈরি করুন (read access)
5. Token কপি করুন

```
NEXT_PUBLIC_HF_API_KEY = আপনার token
```

### Google OAuth সেটআপ (বিনামূল্যে)

1. [Google Cloud Console](https://console.cloud.google.com) এ যান
2. নতুন প্রজেক্ট তৈরি করুন
3. "OAuth 2.0 Client IDs" তৈরি করুন
4. Client ID এবং Secret কপি করুন

```
GOOGLE_CLIENT_ID = আপনার Client ID
GOOGLE_CLIENT_SECRET = আপনার Secret
```

### Resend ইমেইল সেটআপ (বিনামূল্যে)

1. [resend.com](https://resend.com) এ যান
2. Sign up করুন
3. "API Keys" থেকে API key কপি করুন

```
RESEND_API_KEY = আপনার API key
```

---

## 🌐 Netlify এ ডিপ্লয় করুন (বিনামূল্যে)

### অপশন 1: GitHub সংযোগের মাধ্যমে (সহজতম)

1. [netlify.com](https://netlify.com) এ যান
2. "New site from Git" ক্লিক করুন
3. আপনার GitHub রেপো নির্বাচন করুন
4. Build command: `npm run build`
5. Publish directory: `.next`
6. "Deploy" ক্লিক করুন

### অপশন 2: Netlify CLI এর মাধ্যমে

```bash
# Netlify CLI ইনস্টল করুন
npm install -g netlify-cli

# Netlify এ লগইন করুন
netlify login

# ডিপ্লয় করুন
netlify deploy --prod
```

### অপশন 3: ড্র্যাগ-ড্রপ (দ্রুততম)

```bash
# বিল্ড করুন
npm run build

# .next ফোল্ডার ডিপ্লয় করুন
# Netlify তে ড্র্যাগ-ড্রপ করুন
```

### Environment Variables Netlify তে যোগ করুন

1. Netlify ড্যাশবোর্ড → Site settings
2. "Build & deploy" → "Environment"
3. আপনার সব `.env` ভেরিয়েবল যোগ করুন

```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
DATABASE_URL=...
NEXT_PUBLIC_HF_API_KEY=...
JWT_SECRET=...
RESEND_API_KEY=...
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
NEXT_PUBLIC_SITE_URL=https://your-app.netlify.app
```

---

## 🎯 Hashtag এবং Emoji ফিচার ব্যবহার করুন

যেকোনো AI generator এ hashtag এবং emoji যুক্ত করার অপশন:

```javascript
// উদাহরণ: Instagram Caption Generator
const caption = await generateInstagramCaption({
  topic: "আমার নতুন পণ্য লঞ্চ",
  hashtags: true,      // ✅ Hashtag যোগ করুন
  emojis: true,        // ✅ Emoji যোগ করুন
  language: "bn"       // 🇧🇩 বাংলায় তৈরি করুন
});

// আউটপুট:
// "আমার নতুন পণ্য আজই লাইভ! 🎉🚀 
// এটি আপনার জীবন বদলে দেবে। #নতুনপণ্য #উদ্ভাবন"
```

---

## 📊 ডেটাবেস স্কিমা

```sql
-- মূল টেবিল
users              -- ব্যবহারকারী
chats              -- কথোপকথন
messages           -- বার্তা
generated_contents -- তৈরি করা কন্টেন্ট
translations       -- অনুবাদ
documents          -- আপলোড করা ফাইল
usages             -- ব্যবহার ট্র্যাকিং
subscriptions      -- সাবস্ক্রিপশন
admin_settings     -- অ্যাডমিন সেটিংস
analytics          -- বিশ্লেষণ ডেটা
```

---

## 🔐 নিরাপত্তা বৈশিষ্ট্য

✅ JWT Authentication
✅ Password Hashing (bcryptjs)
✅ CORS Protection
✅ Rate Limiting
✅ Input Validation
✅ SQL Injection প্রতিরোধ
✅ XSS প্রতিরোধ
✅ CSRF Protection

---

## 📁 ফোল্ডার স্ট্রাকচার

```
nexai/
├── public/                 # স্ট্যাটিক ফাইল
├── src/
│   ├── app/               # Next.js পেজ এবং API
│   ├── components/        # React কম্পোনেন্ট
│   ├── services/          # ব্যবসায়িক লজিক
│   ├── lib/              # ইউটিলিটি ফাংশন
│   ├── hooks/            # React hooks
│   ├── types/            # TypeScript types
│   └── middleware/       # কাস্টম মিডলওয়্যার
├── prisma/
│   └── schema.prisma     # ডেটাবেস স্কিমা
├── netlify.toml          # Netlify কনফিগ
├── package.json
├── tsconfig.json
├── tailwind.config.js
└── next.config.js
```

---

## 🎨 কাস্টমাইজেশন

### লোগো পরিবর্তন করুন
`public/logo.svg` প্রতিস্থাপন করুন

### রঙ পরিবর্তন করুন
`tailwind.config.js` এ রঙ পরিবর্তন করুন

### AI মডেল পরিবর্তন করুন
`src/services/ai.service.ts` এ মডেল নাম পরিবর্তন করুন

### নতুন Tool যোগ করুন
1. `src/lib/constants.ts` এ tool যোগ করুন
2. `src/components/ai-tools/` এ কম্পোনেন্ট তৈরি করুন
3. `src/app/api/ai/` এ API route তৈরি করুন

---

## 🐛 Troubleshooting

### সমস্যা: API Key কাজ করছে না

**সমাধান:**
```bash
# পরিবেশ ভেরিয়েবল পুনরায় চেক করুন
cat .env.local

# Netlify এ পুনরায় ডিপ্লয় করুন
git push origin main
```

### সমস্যা: ডাটাবেস সংযোগ ব্যর্থ

**সমাধান:**
```bash
# DATABASE_URL চেক করুন
echo $DATABASE_URL

# Prisma রিসেট করুন
npx prisma migrate reset
```

### সমস্যা: Hugging Face API ধীর

**সমাধান:**
- মডেল পরিবর্তন করুন (ছোট মডেল দ্রুত)
- কোনো অপটিমাইজড মডেল ব্যবহার করুন

---

## 📚 ডকুমেন্টেশন

- [Next.js Docs](https://nextjs.org/docs)
- [Supabase Docs](https://supabase.com/docs)
- [Prisma Docs](https://www.prisma.io/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Hugging Face API](https://huggingface.co/docs/hub/api)

---

## 💬 সাপোর্ট

সমস্যা হলে:
1. GitHub Issues এ প্রশ্ন করুন
2. Discord সার্ভারে যোগ দিন
3. ইমেইল করুন: support@nexai.app

---

## 📄 লাইসেন্স

MIT License - স্বাধীন ব্যবহার, পরিবর্তন এবং বিতরণের জন্য

---

## ✅ চূড়ান্ত Deployment Checklist

Netlify তে লাইভ করার আগে এই লিস্ট চেক করুন:

### ১. অ্যাকাউন্ট এবং API Key
- [ ] Supabase প্রজেক্ট তৈরি + `DATABASE_URL` কপি করা
- [ ] Hugging Face API key তৈরি (Settings → Access Tokens → read access)
- [ ] Google OAuth Client ID/Secret তৈরি (redirect URI: `https://your-app.netlify.app/auth/google/callback`)
- [ ] Resend API key তৈরি (ইমেইলের জন্য)

### ২. কোড এবং ডেটাবেস
- [ ] `npm install` সফলভাবে চলেছে
- [ ] `.env.local` এ সব ভেরিয়েবল পূরণ করা হয়েছে
- [ ] `npx prisma db push` চালিয়ে টেবিল তৈরি করা হয়েছে
- [ ] `npx prisma db seed` চালিয়ে Admin অ্যাকাউন্ট তৈরি করা হয়েছে
- [ ] লোকালি `npm run dev` দিয়ে টেস্ট করা হয়েছে

### ৩. GitHub
- [ ] `.env.local` **কখনো** commit করবেন না (`.gitignore` এ আছে, নিশ্চিত করুন)
- [ ] কোড GitHub এ পুশ করা হয়েছে

### ৪. Netlify
- [ ] GitHub রেপো Netlify এর সাথে সংযুক্ত করা হয়েছে
- [ ] Build command: `npm run build`, Publish: `.next`
- [ ] **সব** Environment Variables Netlify Dashboard এ যোগ করা হয়েছে (`.env.example` অনুযায়ী)
- [ ] `NEXT_PUBLIC_SITE_URL` কে আসল Netlify URL দিয়ে আপডেট করা হয়েছে
- [ ] Google OAuth Console এ Netlify URL কে Authorized redirect URI হিসেবে যোগ করা হয়েছে
- [ ] প্রথম ডিপ্লয় সফল হয়েছে (Netlify build log চেক করুন)

### ৫. লাইভ পরীক্ষা
- [ ] Register/Login কাজ করছে
- [ ] Google লগইন কাজ করছে
- [ ] AI Chat উত্তর দিচ্ছে
- [ ] অন্তত ২-৩টি AI Tool টেস্ট করা হয়েছে
- [ ] Admin প্যানেল (`/admin`) Admin অ্যাকাউন্ট দিয়ে অ্যাক্সেসযোগ্য
- [ ] Dark/Light মোড কাজ করছে
- [ ] মোবাইলে রেসপন্সিভ চেক করা হয়েছে

### ৬. ঐচ্ছিক (পরবর্তীতে করা যাবে)
- [ ] কাস্টম ডোমেইন যুক্ত করা (Netlify → Domain settings)
- [ ] Google Analytics/Search Console যোগ করা
- [ ] Resend এ কাস্টম ডোমেইন ভেরিফাই করা (বর্তমানে `onboarding@resend.dev` ব্যবহৃত হচ্ছে)

---

## 📌 গুরুত্বপূর্ণ সীমাবদ্ধতা (Free Tier)

সততার সাথে জানানো ভালো — সম্পূর্ণ বিনামূল্যে থাকতে গিয়ে কিছু সীমাবদ্ধতা আছে:

- **Hugging Face ফ্রি ইনফারেন্স API** কখনো কখনো ধীর (মডেল "কোল্ড স্টার্ট") অথবা busy থাকতে পারে। প্রোডাকশনের জন্য paid Inference Endpoint বিবেচনা করুন।
- **Rate Limiting** in-memory (Redis ছাড়া) — Netlify serverless এ প্রতিটি function instance আলাদা মেমরি ব্যবহার করে, তাই limit সবসময় নিখুঁতভাবে প্রয়োগ নাও হতে পারে। ছোট/মাঝারি ট্রাফিকের জন্য যথেষ্ট।
- **Supabase Free Tier**: ৫০০ এমবি ডেটাবেস, ৫০,০০০ মাসিক active users সীমা আছে।
- **Resend Free Tier**: মাসে ৩,০০০ ইমেইল, দিনে ১০০টি পর্যন্ত।
- **Document Storage**: বর্তমানে আপলোড করা ফাইল স্থায়ীভাবে সংরক্ষণ হয় না (শুধু এক্সট্র্যাক্ট করা টেক্সট ডেটাবেসে থাকে)। স্থায়ী ফাইল সংরক্ষণের জন্য Supabase Storage ইন্টিগ্রেশন যোগ করা যেতে পারে।



---

**Happy Coding!** 🚀💻

Made with ❤️ by the NexAI Team

<!-- redeploy trigger -->
