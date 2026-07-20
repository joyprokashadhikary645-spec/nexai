// src/app/(auth)/verify-email/page.tsx

'use client';

import { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import axios from 'axios';
import Button from '@/components/common/Button';
import { Loader2, CheckCircle2, XCircle } from 'lucide-react';

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const email = searchParams.get('email');

  const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!token || !email) {
      setStatus('error');
      setMessage('Invalid verification link');
      return;
    }
    axios
      .post('/api/auth/verify-email', { token, email })
      .then(() => setStatus('success'))
      .catch((err) => {
        setStatus('error');
        setMessage(err.response?.data?.message || 'Verification failed');
      });
  }, [token, email]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 px-4 py-12">
      <div className="w-full max-w-md text-center">
        <Link href="/" className="inline-flex items-center gap-2 text-2xl font-bold text-primary-600 mb-8">
          <span className="text-3xl">🚀</span>
          NexAI
        </Link>

        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-800 p-8">
          {status === 'verifying' && (
            <>
              <Loader2 className="w-12 h-12 mb-4 mx-auto text-primary-600 dark:text-primary-400 animate-spin" strokeWidth={1.75} />
              <h1 className="text-xl font-bold mb-2">Verifying your email...</h1>
            </>
          )}
          {status === 'success' && (
            <>
              <CheckCircle2 className="w-12 h-12 mb-4 mx-auto text-green-500" strokeWidth={1.75} />
              <h1 className="text-xl font-bold mb-2">Email Verified!</h1>
              <p className="text-gray-500 dark:text-gray-400 mb-6">
                Your account is now fully verified. You can go to your dashboard.
              </p>
              <Link href="/dashboard">
                <Button fullWidth>Go to Dashboard</Button>
              </Link>
            </>
          )}
          {status === 'error' && (
            <>
              <XCircle className="w-12 h-12 mb-4 mx-auto text-red-500" strokeWidth={1.75} />
              <h1 className="text-xl font-bold mb-2">Verification Failed</h1>
              <p className="text-gray-500 dark:text-gray-400 mb-6">{message}</p>
              <Link href="/dashboard/settings">
                <Button variant="secondary" fullWidth>Go to Settings to Resend</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={null}>
      <VerifyEmailContent />
    </Suspense>
  );
}
