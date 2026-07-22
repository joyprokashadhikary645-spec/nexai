// src/app/api/content/saved/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { authMiddleware } from '@/middleware/auth';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const user = await authMiddleware(request);
    if (!user) {
      return NextResponse.json({ message: 'Not authorized' }, { status: 401 });
    }

    const contents = await db.generatedContent.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
      take: 50,
      select: {
        id: true,
        type: true,
        title: true,
        content: true,
        createdAt: true,
      },
    });

    return NextResponse.json({ success: true, data: contents });
  } catch (error) {
    console.error('Saved content error:', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
