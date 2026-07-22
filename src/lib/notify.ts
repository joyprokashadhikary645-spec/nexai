// src/lib/notify.ts

import { db } from '@/lib/db';

interface NotifyInput {
  userId: string;
  type: 'role_change' | 'email_verified' | 'security' | 'system' | 'usage_warning';
  title: string;
  message: string;
  link?: string;
}

/** যেকোনো জায়গা থেকে ইউজারকে নোটিফিকেশন পাঠান (fire-and-forget — ব্যর্থ হলেও মূল কাজ আটকাবে না) */
export async function notify({ userId, type, title, message, link }: NotifyInput) {
  try {
    await db.notification.create({ data: { userId, type, title, message, link } });
  } catch (error) {
    console.error('Notification create failed:', error);
  }
}
