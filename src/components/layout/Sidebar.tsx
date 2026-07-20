// src/components/layout/Sidebar.tsx

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AI_TOOLS } from '@/lib/constants';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/hooks/useLanguage';
import { canAccessAdminPanel } from '@/lib/roles';
import { TOOL_ICONS } from '@/lib/icons';
import {
  LayoutDashboard,
  MessageSquare,
  History,
  Star,
  User,
  Settings,
  Plus,
  Crown,
  Shield,
  ChevronDown,
  type LucideIcon,
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  const pathname = usePathname();
  const { user } = useAuth();
  const { t } = useLanguage();
  const [toolsExpanded, setToolsExpanded] = useState(true);
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

  const mainLinks: { label: string; href: string; icon: LucideIcon }[] = [
    { label: t('dashboard'), href: '/dashboard', icon: LayoutDashboard },
    { label: t('aiChat'), href: '/dashboard/chat', icon: MessageSquare },
    { label: t('history'), href: '/dashboard/history', icon: History },
    { label: t('favorites'), href: '/dashboard/saved', icon: Star },
  ];

  const bottomLinks: { label: string; href: string; icon: LucideIcon }[] = [
    { label: t('profile'), href: '/dashboard/profile', icon: User },
    { label: t('settings'), href: '/dashboard/settings', icon: Settings },
  ];

  const isActive = (href: string) => pathname === href;

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed md:sticky top-0 left-0 h-screen w-72 bg-white dark:bg-gray-900
          border-r border-gray-200 dark:border-gray-800 flex flex-col z-40
          transition-transform duration-300
          ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}
      >
        {/* Logo */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200 dark:border-gray-800">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl text-primary-600">
            <span className="text-2xl">🚀</span>
            NexAI
          </Link>
          <button
            onClick={onClose}
            className="md:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* New Chat Button */}
        <div className="p-4">
          <Link
            href="/dashboard/chat"
            className="flex items-center justify-center gap-2 w-full bg-gradient-to-r from-primary-600 to-secondary-600 text-white py-2.5 rounded-2xl font-medium hover:opacity-90 shadow-md shadow-primary-600/20 transition-opacity"
          >
            <Plus className="w-4 h-4" strokeWidth={2} /> {t('newChat')}
          </Link>
        </div>

        {/* Navigation - স্ক্রলযোগ্য */}
        <nav className="flex-1 overflow-y-auto px-3 space-y-1">
          {/* Main Links */}
          {mainLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive(link.href)
                  ? 'bg-gradient-to-r from-primary-600/10 to-secondary-600/10 text-primary-600 dark:text-primary-400 border border-primary-600/20'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              <link.icon className="w-[18px] h-[18px]" strokeWidth={1.75} />
              {link.label}
            </Link>
          ))}

          {/* AI Tools এক্সপ্যান্ডেবল সেকশন */}
          <div className="pt-4">
            <button
              onClick={() => setToolsExpanded(!toolsExpanded)}
              className="flex items-center justify-between w-full px-3 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider"
            >
              <span>{t('aiTools')}</span>
              <ChevronDown
                className={`w-4 h-4 transition-transform ${toolsExpanded ? 'rotate-180' : ''}`}
                strokeWidth={1.75}
              />
            </button>

            {toolsExpanded && (
              <div className="mt-1 space-y-1">
                {AI_TOOLS.map((tool) => {
                  const ToolIcon = TOOL_ICONS[tool.id] || MessageSquare;
                  return (
                    <Link
                      key={tool.id}
                      href={tool.path}
                      className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                        isActive(tool.path)
                          ? 'bg-gradient-to-r from-primary-600/10 to-secondary-600/10 text-primary-600 dark:text-primary-400 border border-primary-600/20'
                          : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                      }`}
                    >
                      <ToolIcon className="w-[18px] h-[18px]" strokeWidth={1.75} />
                      <span className="truncate">{tool.name}</span>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </nav>

        {/* Upgrade to Pro কার্ড — শুধু usage ৮০%+ হলে দেখাবে, ডিফল্টে দেখাবে না */}
        {usagePercent !== null && usagePercent >= 80 && (
          <div
            className={`mx-3 mb-3 p-4 rounded-2xl text-white ${
              usagePercent >= 100
                ? 'bg-gradient-to-br from-red-600 to-orange-600'
                : 'bg-gradient-to-br from-primary-600 to-secondary-600'
            }`}
          >
            <div className="flex items-center gap-1.5 mb-1.5">
              <Crown className="w-4 h-4" strokeWidth={1.75} />
              <span className="font-semibold text-sm">
                {usagePercent >= 100 ? 'Monthly limit reached' : t('upgradeToPro')}
              </span>
            </div>
            <p className="text-xs text-white/80 mb-3">
              {usagePercent >= 100
                ? 'You have used all your free tokens this month. Upgrade to keep going.'
                : `You've used ${usagePercent}% of your monthly tokens. ${t('upgradeDesc')}`}
            </p>
            <Link
              href="/pricing"
              className="block text-center bg-white text-primary-600 text-xs font-semibold py-2 rounded-xl hover:bg-gray-50 transition-colors"
            >
              {t('upgradeNow')}
            </Link>
          </div>
        )}

        {/* Admin Panel — শুধু admin/super_admin দেখতে পাবে */}
        {canAccessAdminPanel(user?.role) && (
          <div className="px-3 pt-1">
            <Link
              href="/admin"
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium bg-gray-900 dark:bg-gray-800 text-white hover:bg-gray-800 dark:hover:bg-gray-700 transition-colors"
            >
              <Shield className="w-[18px] h-[18px]" strokeWidth={1.75} />
              Admin Panel
            </Link>
          </div>
        )}

        {/* Bottom Links */}
        <div className="p-3 border-t border-gray-200 dark:border-gray-800 space-y-1">
          {bottomLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive(link.href)
                  ? 'bg-gradient-to-r from-primary-600/10 to-secondary-600/10 text-primary-600 dark:text-primary-400 border border-primary-600/20'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              <span>{link.icon && <link.icon className="w-[18px] h-[18px]" strokeWidth={1.75} />}</span>
              {link.label}
            </Link>
          ))}

          {/* ইউজার প্রোফাইল সেকশন */}
          {user && (
            <Link
              href="/dashboard/profile"
              className="flex items-center gap-3 px-3 py-2.5 mt-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors border-t border-gray-200 dark:border-gray-800 pt-3"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-600 to-secondary-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0 overflow-hidden">
                {user?.avatar ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={user.avatar} alt={user?.name || 'User'} className="w-full h-full object-cover" />
                ) : (
                  user?.name?.[0]?.toUpperCase() || 'U'
                )}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium truncate">{user?.name}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{t('freePlan')}</p>
              </div>
            </Link>
          )}
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
