// src/app/api/admin/subscriptions/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { adminMiddleware } from '@/middleware/auth';
import { db } from '@/lib/db';

// সব সাবস্ক্রিপশন তালিকাভুক্ত করুন
export async function GET(request: NextRequest) {
  try {
    const admin = await adminMiddleware(request);
    if (!admin) {
      return NextResponse.json({ message: 'Not authorized' }, { status: 403 });
    }

    const subscriptions = await db.subscription.findMany({
      include: {
        user: {
          select: { id: true, name: true, email: true, avatar: true },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 100,
    });

    const planCounts = await db.subscription.groupBy({
      by: ['plan'],
      _count: { plan: true },
    });

    return NextResponse.json({
      success: true,
      data: subscriptions,
      planCounts: planCounts.map((p: { plan: string; _count: { plan: number } }) => ({ plan: p.plan, count: p._count.plan })),
    });
  } catch (error) {
    console.error('Admin subscriptions error:', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
