// src/components/layout/NotificationBell.tsx

'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import axios from 'axios';
import { Bell, Shield, MailCheck, Lock, Megaphone, Zap, type LucideIcon } from 'lucide-react';

const getToken = () => (typeof window !== 'undefined' ? localStorage.getItem('authToken') : null);
const authHeaders = () => ({ headers: { Authorization: `Bearer ${getToken()}` } });

interface NotificationItem {
  id: string;
  type: string;
  title: string;
  message: string;
  link?: string | null;
  isRead: boolean;
  createdAt: string;
}

const TYPE_ICON: Record<string, LucideIcon> = {
  role_change: Shield,
  email_verified: MailCheck,
  security: Lock,
  system: Megaphone,
  usage_warning: Zap,
};

function timeAgo(dateStr: string) {
  const diffMs = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return 'এইমাত্র';
  if (mins < 60) return `${mins} মিনিট আগে`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} ঘণ্টা আগে`;
  return `${Math.floor(hours / 24)} দিন আগে`;
}

const NotificationBell = () => {
  const [items, setItems] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const fetchNotifications = useCallback(async () => {
    try {
      const { data } = await axios.get('/api/notifications', authHeaders());
      setItems(data.data.notifications);
      setUnreadCount(data.data.unreadCount);
    } catch {
      // চুপচাপ ব্যর্থ হোক — নোটিফিকেশন লোড না হলেও বাকি অ্যাপ চলবে
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000); // প্রতি ৩০ সেকেন্ডে পোল করুন
    return () => clearInterval(interval);
  }, [fetchNotifications]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleOpen = () => {
    setIsOpen((prev) => !prev);
  };

  const markOneRead = async (id: string) => {
    setItems((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)));
    setUnreadCount((c) => Math.max(0, c - 1));
    try {
      await axios.post('/api/notifications/mark-read', { id }, authHeaders());
    } catch {
      // ignore
    }
  };

  const markAllRead = async () => {
    setItems((prev) => prev.map((n) => ({ ...n, isRead: true })));
    setUnreadCount(0);
    try {
      await axios.post('/api/notifications/mark-all-read', {}, authHeaders());
    } catch {
      // ignore
    }
  };

  return (
    <div className="relative" ref={wrapperRef}>
      <button
        onClick={handleOpen}
        className="relative p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
        title="Notifications"
      >
        <Bell className="w-5 h-5 text-gray-700 dark:text-gray-300" strokeWidth={1.75} />
        {unreadCount > 0 && (
          <span className="absolute top-0.5 right-0.5 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 max-w-[90vw] max-h-96 overflow-y-auto bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl shadow-lg z-30">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-gray-800">
            <h3 className="font-semibold text-sm">Notifications</h3>
            {unreadCount > 0 && (
              <button onClick={markAllRead} className="text-xs text-primary-600 dark:text-primary-400 hover:underline">
                Mark all read
              </button>
            )}
          </div>

          {items.length === 0 ? (
            <p className="text-center text-sm text-gray-400 py-10">কোনো নোটিফিকেশন নেই</p>
          ) : (
            <div>
              {items.map((n) => {
                const body = (
                  <div
                    className={`flex gap-3 px-4 py-3 border-b border-gray-50 dark:border-gray-800/50 hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer ${
                      !n.isRead ? 'bg-primary-50/50 dark:bg-primary-900/10' : ''
                    }`}
                    onClick={() => !n.isRead && markOneRead(n.id)}
                  >
                    {(() => {
                      const Icon = TYPE_ICON[n.type] || Bell;
                      return <Icon className="w-4 h-4 flex-shrink-0 mt-0.5 text-gray-400" strokeWidth={1.75} />;
                    })()}
                    <div className="min-w-0">
                      <p className="text-sm font-medium">{n.title}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">{n.message}</p>
                      <p className="text-[11px] text-gray-400 mt-1">{timeAgo(n.createdAt)}</p>
                    </div>
                    {!n.isRead && <span className="w-2 h-2 bg-primary-600 rounded-full flex-shrink-0 mt-1" />}
                  </div>
                );
                return n.link ? (
                  <Link key={n.id} href={n.link} onClick={() => setIsOpen(false)}>
                    {body}
                  </Link>
                ) : (
                  <div key={n.id}>{body}</div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
