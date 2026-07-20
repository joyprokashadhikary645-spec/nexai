// src/app/api/admin/super/search-users/route.ts
// শুধুমাত্র super_admin — নতুন কাউকে admin বানানোর জন্য ইউজার খোঁজা

import { NextRequest, NextResponse } from 'next/server';
import { superAdminMiddleware } from '@/middleware/auth';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const actor = await superAdminMiddleware(request);
    if (!actor) {
      return NextResponse.json({ message: 'Not authorized' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const q = (searchParams.get('q') || '').trim();
    if (q.length < 2) {
      return NextResponse.json({ success: true, data: [] });
    }

    const users = await db.user.findMany({
      where: {
        role: 'user',
        OR: [
          { name: { contains: q, mode: 'insensitive' as const } },
          { email: { contains: q, mode: 'insensitive' as const } },
        ],
      },
      select: { id: true, name: true, email: true, avatar: true, role: true },
      take: 10,
    });

    return NextResponse.json({ success: true, data: users });
  } catch (error) {
    console.error('User search error:', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
