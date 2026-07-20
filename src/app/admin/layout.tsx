// src/app/admin/layout.tsx

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/hooks/useTheme';
import Loading from '@/components/common/Loading';
import { canAccessAdminPanel, isSuperAdmin } from '@/lib/roles';
import {
  LayoutDashboard,
  Users,
  BarChart3,
  CreditCard,
  Settings,
  ShieldCheck,
  Cog,
  ScrollText,
  type LucideIcon,
} from 'lucide-react';

const ADMIN_LINKS: { label: string; href: string; icon: LucideIcon }[] = [
  { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { label: 'Users', href: '/admin/users', icon: Users },
  { label: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
  { label: 'Subscriptions', href: '/admin/subscriptions', icon: CreditCard },
  { label: 'Settings', href: '/admin/settings', icon: Settings },
];

// শুধুমাত্র super_admin-রা দেখতে পাবে এই সেকশন
const SUPER_ADMIN_LINKS: { label: string; href: string; icon: LucideIcon }[] = [
  { label: 'Manage Admins', href: '/admin/super/admins', icon: ShieldCheck },
  { label: 'System Control', href: '/admin/super/system', icon: Cog },
  { label: 'Audit Log', href: '/admin/super/audit-log', icon: ScrollText },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading, isAuthenticated } = useAuth();
  const { theme, toggleTheme, mounted } = useTheme();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.push('/login');
      } else if (!canAccessAdminPanel(user?.role)) {
        router.push('/dashboard');
      }
    }
  }, [isLoading, isAuthenticated, user, router]);

  if (isLoading || !canAccessAdminPanel(user?.role)) {
    return <Loading fullScreen text="Verifying..." />;
  }

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-950 overflow-hidden">
      {/* Sidebar */}
      <aside
        className={`fixed md:sticky top-0 left-0 h-screen w-64 bg-gray-900 text-white flex flex-col z-40 transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="flex items-center gap-2 h-16 px-4 border-b border-gray-800">
          <span className="text-2xl">🚀</span>
          <span className="font-bold text-lg">NexAI Admin</span>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          {ADMIN_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                pathname === link.href
                  ? 'bg-primary-600 text-white'
                  : 'text-gray-300 hover:bg-gray-800'
              }`}
            >
              <link.icon className="w-[18px] h-[18px]" strokeWidth={1.75} />
              {link.label}
            </Link>
          ))}

          {isSuperAdmin(user?.role) && (
            <>
              <p className="px-3 pt-4 pb-1 text-[11px] font-semibold uppercase tracking-wider text-gray-500">
                Super Admin
              </p>
              {SUPER_ADMIN_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    pathname === link.href
                      ? 'bg-purple-600 text-white'
                      : 'text-gray-300 hover:bg-gray-800'
                  }`}
                >
                  <link.icon className="w-[18px] h-[18px]" strokeWidth={1.75} />
                  {link.label}
                </Link>
              ))}
            </>
          )}
        </nav>

        <div className="p-3 border-t border-gray-800">
          <Link
            href="/dashboard"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-300 hover:bg-gray-800"
          >
            <span>←</span> Back to User Panel
          </Link>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="flex items-center justify-between h-16 px-4 md:px-6 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
          <button
            onClick={() => setSidebarOpen(true)}
            className="md:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          <div className="ml-auto flex items-center gap-3">
            {mounted && (
              <button
                onClick={toggleTheme}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
              >
                {theme === 'light' ? '' : ''}
              </button>
            )}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-600 to-secondary-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                {user?.name?.[0]?.toUpperCase()}
              </div>
              <span className="text-sm font-medium hidden sm:block">{user?.name}</span>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto">
          {!user?.twoFactorEnabled && (
            <div className="bg-amber-50 dark:bg-amber-900/20 border-b border-amber-200 dark:border-amber-800 px-4 py-2.5 text-sm text-amber-800 dark:text-amber-300 flex items-center justify-between gap-3">
              <span>Your admin account doesn't have Two-Factor Authentication enabled yet — this is your most powerful account, protect it.</span>
              <Link href="/dashboard/settings" className="font-medium underline whitespace-nowrap">
                Enable now
              </Link>
            </div>
          )}
          {children}
        </main>
      </div>
    </div>
  );
}
