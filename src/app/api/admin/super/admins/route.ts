// src/app/api/admin/super/admins/route.ts
// শুধুমাত্র super_admin — বর্তমান সব admin/super_admin তালিকাভুক্ত করে

import { NextRequest, NextResponse } from 'next/server';
import { superAdminMiddleware } from '@/middleware/auth';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const actor = await superAdminMiddleware(request);
    if (!actor) {
      return NextResponse.json({ message: 'Not authorized' }, { status: 403 });
    }

    const admins = await db.user.findMany({
      where: { role: { in: ['admin', 'super_admin'] } },
      select: {
        id: true,
        name: true,
        email: true,
        avatar: true,
        role: true,
        isVerified: true,
        createdAt: true,
        lastLoginAt: true,
      },
      orderBy: [{ role: 'asc' }, { createdAt: 'desc' }],
    });

    return NextResponse.json({ success: true, data: admins });
  } catch (error) {
    console.error('Super admin list error:', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
