// src/app/api/notifications/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { authMiddleware } from '@/middleware/auth';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const user = await authMiddleware(request);
    if (!user) {
      return NextResponse.json({ message: 'Not authorized' }, { status: 401 });
    }

    const [notifications, unreadCount] = await Promise.all([
      db.notification.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: 'desc' },
        take: 30,
      }),
      db.notification.count({ where: { userId: user.id, isRead: false } }),
    ]);

    return NextResponse.json({ success: true, data: { notifications, unreadCount } });
  } catch (error) {
    console.error('Notifications fetch error:', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
