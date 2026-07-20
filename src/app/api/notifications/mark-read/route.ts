// src/app/api/notifications/mark-read/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { authMiddleware } from '@/middleware/auth';
import { db } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const user = await authMiddleware(request);
    if (!user) {
      return NextResponse.json({ message: 'Not authorized' }, { status: 401 });
    }

    const { id } = await request.json();
    if (!id) {
      return NextResponse.json({ message: 'Notification id required' }, { status: 400 });
    }

    // নিজের নোটিফিকেশন ছাড়া অন্য কারো টা মার্ক করা যাবে না
    await db.notification.updateMany({
      where: { id, userId: user.id },
      data: { isRead: true },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Mark-read error:', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
