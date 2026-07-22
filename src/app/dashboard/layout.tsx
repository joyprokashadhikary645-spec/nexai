// src/app/dashboard/layout.tsx

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { LanguageProvider } from '@/hooks/useLanguage';
import Sidebar from '@/components/layout/Sidebar';
import DashboardHeader from '@/components/layout/DashboardHeader';
import Loading from '@/components/common/Loading';
import VerifyEmailBanner from '@/components/common/VerifyEmailBanner';
import OnboardingTour from '@/components/dashboard/OnboardingTour';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoading, isAuthenticated } = useAuth();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // অথেন্টিকেশন গার্ড - লগইন না থাকলে redirect করুন
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading) {
    return <Loading fullScreen text="Loading..." />;
  }

  if (!isAuthenticated) {
    return null; // redirect হওয়ার আগ পর্যন্ত কিছু দেখাবেন না
  }

  return (
    <LanguageProvider initialLanguage={user?.language}>
      <OnboardingTour />
      <div className="flex h-screen bg-gray-50 dark:bg-gray-950 overflow-hidden">
        {/* Sidebar */}
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <DashboardHeader onMenuClick={() => setSidebarOpen(true)} />

          <main className="flex-1 overflow-y-auto">
            {user && !user.isVerified && <VerifyEmailBanner />}
            {children}
          </main>
        </div>
      </div>
    </LanguageProvider>
  );
}
