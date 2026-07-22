// src/app/api/chats/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { authMiddleware } from '@/middleware/auth';
import { db } from '@/lib/db';

// ব্যবহারকারীর সব চ্যাট তালিকাভুক্ত করুন
export async function GET(request: NextRequest) {
  try {
    const user = await authMiddleware(request);
    if (!user) {
      return NextResponse.json({ message: 'Not authorized' }, { status: 401 });
    }

    const chats = await db.chat.findMany({
      where: { userId: user.id, isArchived: false },
      orderBy: { updatedAt: 'desc' },
      take: 50,
      select: {
        id: true,
        title: true,
        isSaved: true,
        isPinned: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({ success: true, data: chats });
  } catch (error) {
    console.error('Chats list error:', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
