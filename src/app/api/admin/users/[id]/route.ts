// src/app/api/admin/users/[id]/route.ts
// admin/super_admin — একজন নির্দিষ্ট ইউজারের সম্পূর্ণ কার্যকলাপ দেখার জন্য

import { NextRequest, NextResponse } from 'next/server';
import { adminMiddleware } from '@/middleware/auth';
import { db } from '@/lib/db';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const admin = await adminMiddleware(request);
    if (!admin) {
      return NextResponse.json({ message: 'Not authorized' }, { status: 403 });
    }

    const user = await db.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        avatar: true,
        bio: true,
        role: true,
        isVerified: true,
        isBanned: true,
        banReason: true,
        twoFactorEnabled: true,
        language: true,
        createdAt: true,
        lastLoginAt: true,
        subscriptions: {
          select: { plan: true, status: true, tokensUsed: true, monthlyTokens: true, renewalDate: true },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    const [
      chats,
      generatedContents,
      translations,
      documents,
      usageByFeature,
      recentUsage,
      auditEntries,
      totalChats,
      totalMessages,
    ] = await Promise.all([
      db.chat.findMany({
        where: { userId: user.id },
        orderBy: { updatedAt: 'desc' },
        take: 15,
        select: { id: true, title: true, createdAt: true, updatedAt: true, _count: { select: { messages: true } } },
      }),
      db.generatedContent.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: 'desc' },
        take: 15,
        select: { id: true, type: true, title: true, createdAt: true, tokensUsed: true },
      }),
      db.translation.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: 'desc' },
        take: 10,
        select: { id: true, sourceLanguage: true, targetLanguage: true, createdAt: true },
      }),
      db.document.findMany({
        where: { userId: user.id },
        orderBy: { uploadedAt: 'desc' },
        take: 10,
        select: { id: true, fileName: true, uploadedAt: true },
      }),
      db.usage.groupBy({
        by: ['feature'],
        where: { userId: user.id },
        _sum: { tokensUsed: true },
        _count: { _all: true },
      }),
      db.usage.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: 'desc' },
        take: 20,
        select: { id: true, feature: true, tokensUsed: true, language: true, createdAt: true },
      }),
      db.auditLog.findMany({
        where: { targetId: user.id },
        orderBy: { createdAt: 'desc' },
        take: 10,
      }),
      db.chat.count({ where: { userId: user.id } }),
      db.message.count({ where: { chat: { userId: user.id } } }),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        user,
        stats: { totalChats, totalMessages },
        chats,
        generatedContents,
        translations,
        documents,
        usageByFeature,
        recentUsage,
        auditEntries,
      },
    });
  } catch (error) {
    console.error('Admin user detail error:', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
