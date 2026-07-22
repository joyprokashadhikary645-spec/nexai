// src/components/dashboard/OnboardingTour.tsx

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { Sparkles, MessageSquare, Wrench, ShieldCheck, type LucideIcon } from 'lucide-react';

const STEPS: { icon: LucideIcon; title: string; body: string; cta?: { label: string; href: string } }[] = [
  {
    icon: Sparkles,
    title: 'NexAI-তে স্বাগতম!',
    body: 'একটা মাত্র প্ল্যাটফর্মে Chat, Content Writer, Image Generator, Code Generator — সব AI টুল একসাথে পাবেন। চলুন ৩০ সেকেন্ডে ঘুরিয়ে দেখাই।',
  },
  {
    icon: MessageSquare,
    title: 'AI Chat দিয়ে শুরু করুন',
    body: 'বাম পাশের Sidebar থেকে "AI Chat"-এ গিয়ে যেকোনো প্রশ্ন করুন — উত্তর লাইভ টাইপ হতে হতে আসবে, ঠিক ChatGPT-এর মতো।',
  },
  {
    icon: Wrench,
    title: 'AI Tools ঘুরে দেখুন',
    body: 'Sidebar-এর "AI Tools" থেকে Blog Generator, Email Writer, Translator-সহ ১৩টা রেডিমেড টুল পাবেন — টপিক লিখে এক ক্লিকে ফলাফল।',
  },
  {
    icon: ShieldCheck,
    title: 'একাউন্ট সুরক্ষিত রাখুন',
    body: 'Settings → Security-তে গিয়ে ইমেইল ভেরিফাই করুন আর 2FA চালু করুন — মাত্র ২ মিনিট লাগবে, একাউন্ট অনেক বেশি নিরাপদ হয়ে যাবে।',
    cta: { label: 'Settings-এ যান', href: '/dashboard/settings' },
  },
];

const OnboardingTour = () => {
  const { user } = useAuth();
  const [step, setStep] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!user) return;
    const key = `onboarding-seen-${user.id}`;
    if (!localStorage.getItem(key)) {
      setVisible(true);
    }
  }, [user]);

  const close = () => {
    if (user) localStorage.setItem(`onboarding-seen-${user.id}`, 'true');
    setVisible(false);
  };

  const next = () => {
    if (step < STEPS.length - 1) setStep(step + 1);
    else close();
  };

  if (!visible) return null;
  const current = STEPS[step];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl max-w-sm w-full p-6 text-center relative">
        <button
          onClick={close}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          aria-label="Skip"
        >
          
        </button>

        <current.icon className="w-12 h-12 mb-4 mx-auto text-primary-600 dark:text-primary-400" strokeWidth={1.5} />
        <h2 className="text-lg font-bold mb-2">{current.title}</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">{current.body}</p>

        <div className="flex items-center justify-center gap-1.5 mb-5">
          {STEPS.map((_, i) => (
            <span
              key={i}
              className={`h-1.5 rounded-full transition-all ${
                i === step ? 'w-6 bg-primary-600' : 'w-1.5 bg-gray-200 dark:bg-gray-700'
              }`}
            />
          ))}
        </div>

        <div className="flex gap-2">
          {current.cta ? (
            <Link href={current.cta.href} onClick={close} className="flex-1">
              <button className="w-full bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold py-2.5 rounded-xl transition-colors">
                {current.cta.label}
              </button>
            </Link>
          ) : (
            <button
              onClick={next}
              className="flex-1 bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold py-2.5 rounded-xl transition-colors"
            >
              {step === STEPS.length - 1 ? 'শেষ করুন' : 'পরবর্তী'}
            </button>
          )}
        </div>
        {step < STEPS.length - 1 && (
          <button onClick={close} className="mt-3 text-xs text-gray-400 hover:underline">
            Skip tour
          </button>
        )}
      </div>
    </div>
  );
};

export default OnboardingTour;
