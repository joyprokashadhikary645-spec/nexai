// src/components/layout/DashboardHeader.tsx

'use client';

import { useState, useEffect } from 'react';
import { useTheme } from '@/hooks/useTheme';
import { useAuth } from '@/hooks/useAuth';
import UserMenu from '@/components/navbar/UserMenu';
import NotificationBell from '@/components/layout/NotificationBell';
import { Zap } from 'lucide-react';

interface DashboardHeaderProps {
  onMenuClick: () => void;
  title?: string;
}

const DashboardHeader = ({ onMenuClick, title }: DashboardHeaderProps) => {
  const { theme, toggleTheme, mounted } = useTheme();
  const { user } = useAuth();
  const [usagePercent, setUsagePercent] = useState<number | null>(null);

  useEffect(() => {
    if (!user) return;
    const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
    if (!token) return;
    fetch('/api/usage/summary', { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => (res.ok ? res.json() : null))
      .then((json) => {
        if (json?.data) setUsagePercent(json.data.percentage);
      })
      .catch(() => {});
  }, [user]);

  return (
    <header className="sticky top-0 z-20 flex items-center justify-between h-16 px-4 md:px-6 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
      {/* Left: Mobile Menu Button + Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="md:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        {title && <h1 className="text-lg font-semibold hidden sm:block">{title}</h1>}
      </div>

      {/* Right: Theme Toggle + User Menu */}
      <div className="flex items-center gap-3">
        {/* Theme Toggle */}
        {mounted && (
          <button
            onClick={toggleTheme}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            title={theme === 'light' ? 'Dark mode' : 'Light mode'}
          >
            {theme === 'light' ? (
              <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            ) : (
              <svg className="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            )}
          </button>
        )}

        {/* Notifications */}
        {user && <NotificationBell />}

        {/* Token Usage Badge */}
        <div
          className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${
            usagePercent !== null && usagePercent >= 100
              ? 'bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400'
              : usagePercent !== null && usagePercent >= 80
              ? 'bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400'
              : 'bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400'
          }`}
        >
          <Zap className="w-3.5 h-3.5" strokeWidth={2} />
          <span>{usagePercent !== null ? `${Math.min(usagePercent, 100)}% used` : 'Free Plan'}</span>
        </div>

        {/* User Menu */}
        {user && <UserMenu user={user} />}
      </div>
    </header>
  );
};

export default DashboardHeader;
