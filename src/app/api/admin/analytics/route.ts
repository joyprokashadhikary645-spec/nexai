// src/app/api/admin/analytics/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { adminMiddleware } from '@/middleware/auth';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const admin = await adminMiddleware(request);
    if (!admin) {
      return NextResponse.json({ message: 'Not authorized' }, { status: 403 });
    }

    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const [
      totalUsers,
      newUsersLast30Days,
      totalChats,
      totalMessages,
      totalGeneratedContent,
      totalTranslations,
      totalDocuments,
      bannedUsers,
      activeUsersLast7Days,
      usageByFeature,
      tokenUsageAgg,
    ] = await Promise.all([
      db.user.count(),
      db.user.count({ where: { createdAt: { gte: thirtyDaysAgo } } }),
      db.chat.count(),
      db.message.count(),
      db.generatedContent.count(),
      db.translation.count(),
      db.document.count(),
      db.user.count({ where: { isBanned: true } }),
      db.user.count({ where: { lastLoginAt: { gte: sevenDaysAgo } } }),
      db.usage.groupBy({
        by: ['feature'],
        _count: { feature: true },
        _sum: { tokensUsed: true },
        orderBy: { _count: { feature: 'desc' } },
        take: 10,
      }),
      db.usage.aggregate({ _sum: { tokensUsed: true } }),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        overview: {
          totalUsers,
          newUsersLast30Days,
          activeUsersLast7Days,
          bannedUsers,
          totalChats,
          totalMessages,
          totalGeneratedContent,
          totalTranslations,
          totalDocuments,
          totalTokensUsed: tokenUsageAgg._sum.tokensUsed || 0,
        },
        usageByFeature: usageByFeature.map((u: { feature: string; _count: { feature: number }; _sum: { tokensUsed: number | null } }) => ({
          feature: u.feature,
          count: u._count.feature,
          tokensUsed: u._sum.tokensUsed || 0,
        })),
      },
    });
  } catch (error) {
    console.error('Admin analytics error:', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
