// src/app/api/notifications/mark-all-read/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { authMiddleware } from '@/middleware/auth';
import { db } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const user = await authMiddleware(request);
    if (!user) {
      return NextResponse.json({ message: 'Not authorized' }, { status: 401 });
    }

    await db.notification.updateMany({
      where: { userId: user.id, isRead: false },
      data: { isRead: true },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Mark-all-read error:', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
