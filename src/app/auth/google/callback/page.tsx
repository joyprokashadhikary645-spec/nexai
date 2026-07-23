// src/app/auth/google/callback/page.tsx
// Google OAuth থেকে redirect হয়ে ফেরত আসার পর এই পেজ 'code' নিয়ে
// ব্যাকএন্ডে (/api/auth/google) পাঠিয়ে লগইন সম্পন্ন করে।

'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { Loader2 } from 'lucide-react';

export default function GoogleCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { googleLogin } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const hasRun = useRef(false);

  useEffect(() => {
    // React Strict Mode-এ effect দুইবার চলতে পারে, একবারই code ব্যবহার হোক তা নিশ্চিত করি
    if (hasRun.current) return;
    hasRun.current = true;

    const code = searchParams.get('code');
    const oauthError = searchParams.get('error');

    if (oauthError) {
      setError('Google লগইন বাতিল করা হয়েছে।');
      setTimeout(() => router.push('/login'), 2000);
      return;
    }

    if (!code) {
      setError('Google থেকে কোনো কোড পাওয়া যায়নি।');
      setTimeout(() => router.push('/login'), 2000);
      return;
    }

    googleLogin(code).catch(() => {
      setError('Google লগইন ব্যর্থ হয়েছে।');
      setTimeout(() => router.push('/login'), 2000);
    });
  }, [searchParams, googleLogin, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 px-4">
      <div className="text-center">
        {error ? (
          <p className="text-red-500 font-medium">{error}</p>
        ) : (
          <>
            <Loader2 className="w-10 h-10 animate-spin text-primary-600 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400">Google দিয়ে লগইন করা হচ্ছে...</p>
          </>
        )}
      </div>
    </div>
  );
}
