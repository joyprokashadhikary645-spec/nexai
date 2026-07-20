// src/components/navbar/UserMenu.tsx

'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import toast from 'react-hot-toast';

interface UserMenuProps {
  user: any;
}

const UserMenu = ({ user }: UserMenuProps) => {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { logout } = useAuth();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
      >
        <div className="w-8 h-8 bg-gradient-to-br from-primary-600 to-secondary-600 rounded-full flex items-center justify-center text-white font-bold text-sm overflow-hidden">
          {user?.avatar ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={user.avatar} alt={user?.name || 'User'} className="w-full h-full object-cover" />
          ) : (
            user?.name?.[0]?.toUpperCase() || 'U'
          )}
        </div>
        <span className="hidden sm:block text-sm font-medium text-gray-700 dark:text-gray-300">
          {user?.name?.split(' ')[0]}
        </span>
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800 py-1 animate-slideDown">
          <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-800">
            <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{user?.name}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user?.email}</p>
          </div>

          <Link href="/dashboard" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800">
            Dashboard
          </Link>
          <Link href="/dashboard/chat" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800">
            Chat
          </Link>
          <Link href="/dashboard/settings" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800">
            Settings
          </Link>
          <Link href="/dashboard/profile" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800">
            Profile
          </Link>

          {user?.role === 'admin' && (
            <>
              <div className="border-t border-gray-200 dark:border-gray-800 my-1" />
              <Link href="/admin" className="block px-4 py-2 text-sm text-primary-600 dark:text-primary-400 hover:bg-gray-100 dark:hover:bg-gray-800 font-medium">
                Admin Panel
              </Link>
            </>
          )}

          <div className="border-t border-gray-200 dark:border-gray-800 my-1" />
          <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-800">
            Log Out
          </button>
        </div>
      )}
    </div>
  );
};

export default UserMenu;
