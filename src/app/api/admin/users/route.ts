// src/app/api/admin/users/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { adminMiddleware } from '@/middleware/auth';
import { db } from '@/lib/db';

// সব ব্যবহারকারী তালিকাভুক্ত করুন (পেজিনেশন এবং সার্চ সহ)
export async function GET(request: NextRequest) {
  try {
    const admin = await adminMiddleware(request);
    if (!admin) {
      return NextResponse.json({ message: 'Not authorized' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const search = searchParams.get('search') || '';

    const where = search
      ? {
          OR: [
            { name: { contains: search, mode: 'insensitive' as const } },
            { email: { contains: search, mode: 'insensitive' as const } },
          ],
        }
      : {};

    const [users, total] = await Promise.all([
      db.user.findMany({
        where,
        select: {
          id: true,
          name: true,
          email: true,
          avatar: true,
          role: true,
          isVerified: true,
          isBanned: true,
          banReason: true,
          createdAt: true,
          lastLoginAt: true,
          subscriptions: {
            select: { plan: true, status: true, tokensUsed: true, monthlyTokens: true },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      db.user.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: users,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Admin users list error:', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
