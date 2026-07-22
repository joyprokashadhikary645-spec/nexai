// src/components/common/VerifyEmailBanner.tsx

'use client';

import { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const getToken = () => (typeof window !== 'undefined' ? localStorage.getItem('authToken') : null);

const VerifyEmailBanner = () => {
  const [isSending, setIsSending] = useState(false);
  const [sent, setSent] = useState(false);

  const handleResend = async () => {
    setIsSending(true);
    try {
      await axios.post(
        '/api/auth/resend-verification',
        {},
        { headers: { Authorization: `Bearer ${getToken()}` } }
      );
      toast.success('Verification email sent — check your inbox');
      setSent(true);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Could not send email');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="bg-amber-50 dark:bg-amber-900/20 border-b border-amber-200 dark:border-amber-800 px-4 py-2.5 text-sm text-amber-800 dark:text-amber-300 flex items-center justify-between gap-3">
      <span>আপনার ইমেইল এখনো ভেরিফাই করা হয়নি — AI ফিচার ব্যবহার করতে ভেরিফাই করা প্রয়োজন।</span>
      <button
        onClick={handleResend}
        disabled={isSending || sent}
        className="font-medium underline whitespace-nowrap disabled:opacity-60"
      >
        {sent ? 'পাঠানো হয়েছে ' : isSending ? 'পাঠানো হচ্ছে...' : 'ইমেইল পাঠান'}
      </button>
    </div>
  );
};

export default VerifyEmailBanner;
