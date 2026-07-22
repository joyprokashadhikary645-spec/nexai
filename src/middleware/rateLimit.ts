// src/middleware/rateLimit.ts

// সাধারণ In-Memory Rate Limiter (ছোট প্রজেক্টের জন্য উপযুক্ত, Redis দরকার নেই)
// নোট: Serverless ফাংশনে এটি প্রতি instance ভিত্তিক কাজ করে

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const rateLimitStore = new Map<string, RateLimitEntry>();

// প্রতি ৫ মিনিটে পুরনো এন্ট্রি পরিষ্কার করুন
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of rateLimitStore.entries()) {
    if (entry.resetAt < now) {
      rateLimitStore.delete(key);
    }
  }
}, 5 * 60 * 1000);

interface RateLimitOptions {
  identifier: string; // যেমন IP address বা userId
  limit: number; // সর্বোচ্চ অনুরোধ সংখ্যা
  windowMs: number; // সময়ের উইন্ডো (মিলিসেকেন্ডে)
}

export function checkRateLimit(options: RateLimitOptions): {
  success: boolean;
  remaining: number;
  resetAt: number;
} {
  const { identifier, limit, windowMs } = options;
  const now = Date.now();

  const entry = rateLimitStore.get(identifier);

  if (!entry || entry.resetAt < now) {
    // নতুন উইন্ডো শুরু করুন
    const resetAt = now + windowMs;
    rateLimitStore.set(identifier, { count: 1, resetAt });
    return { success: true, remaining: limit - 1, resetAt };
  }

  if (entry.count >= limit) {
    return { success: false, remaining: 0, resetAt: entry.resetAt };
  }

  entry.count += 1;
  rateLimitStore.set(identifier, entry);

  return { success: true, remaining: limit - entry.count, resetAt: entry.resetAt };
}

// রিকোয়েস্ট থেকে IP ঠিকানা বের করুন
export function getClientIp(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0].trim();
  return request.headers.get('x-real-ip') || 'unknown';
}
