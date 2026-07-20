// src/app/(auth)/forgot-password/page.tsx

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { MailCheck } from 'lucide-react';
import axios from 'axios';
import Button from '@/components/common/Button';
import Input from '@/components/common/Input';
import toast from 'react-hot-toast';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address');
      return;
    }
    setIsLoading(true);
    try {
      await axios.post('/api/auth/forgot-password', { email });
      setSubmitted(true);
      toast.success('Reset link sent (if the email is registered)');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Request failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-2xl font-bold text-primary-600">
            <span className="text-3xl">🚀</span>
            NexAI
          </Link>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-800 p-8">
          {!submitted ? (
            <>
              <h1 className="text-2xl font-bold text-center mb-2">Forgot Password?</h1>
              <p className="text-center text-gray-600 dark:text-gray-400 mb-6">
                No worries! Enter your email and we&apos;ll send you a reset link.
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  label="Email"
                  type="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setError(''); }}
                  error={error}
                  placeholder="your@email.com"
                  autoComplete="email"
                />
                <Button type="submit" isLoading={isLoading} fullWidth size="lg">
                  Send Reset Link
                </Button>
              </form>
            </>
          ) : (
            <div className="text-center">
              <MailCheck className="w-14 h-14 mb-4 mx-auto text-primary-600 dark:text-primary-400" strokeWidth={1.5} />
              <h1 className="text-2xl font-bold mb-2">Check Your Email</h1>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                We&apos;ve sent a reset link to <strong>{email}</strong>. Check your inbox.
              </p>
            </div>
          )}

          <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-6">
            <Link href="/login" className="text-primary-600 dark:text-primary-400 font-medium hover:underline">
              ← Back to Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
