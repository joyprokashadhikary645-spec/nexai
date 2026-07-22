// src/components/navbar/MobileMenu.tsx

'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import toast from 'react-hot-toast';

interface MobileMenuProps {
  items: Array<{ label: string; href: string }>;
  user: any;
}

const MobileMenu = ({ items, user }: MobileMenuProps) => {
  const router = useRouter();
  const { logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logged out successfully');
      router.push('/');
    } catch (error) {
      toast.error('Logout failed');
    }
  };

  return (
    <div className="md:hidden bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
      <div className="container py-4 space-y-2">
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="block px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
          >
            {item.label}
          </Link>
        ))}

        {!user ? (
          <div className="flex flex-col gap-2 pt-2 border-t border-gray-200 dark:border-gray-800">
            <Link href="/login" className="block px-4 py-2 text-center text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg">
              Log In
            </Link>
            <Link href="/register" className="block px-4 py-2 text-center text-sm font-medium text-white bg-gradient-to-r from-primary-600 to-secondary-600 rounded-xl">
              Sign Up
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-2 pt-2 border-t border-gray-200 dark:border-gray-800">
            <Link href="/dashboard" className="block px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg">
              Dashboard
            </Link>
            <Link href="/dashboard/settings" className="block px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg">
              Settings
            </Link>
            {user?.role === 'admin' && (
              <Link href="/admin" className="block px-4 py-2 text-sm font-medium text-primary-600 dark:text-primary-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg">
                Admin Panel
              </Link>
            )}
            <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg">
              Log Out
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MobileMenu;
