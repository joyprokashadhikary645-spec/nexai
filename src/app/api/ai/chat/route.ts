// src/app/api/ai/chat/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { authMiddleware } from '@/middleware/auth';
import { getUsageSummary } from '@/lib/usage';
import { checkRateLimit } from '@/middleware/rateLimit';
import { aiService } from '@/services/ai.service';
import { db } from '@/lib/db';
import { z } from 'zod';

const ChatSchema = z.object({
  chatId: z.string().optional(),
  message: z.string().min(1).max(4000),
  language: z.string().default('en'),
});

export async function POST(request: NextRequest) {
  try {
    const user = await authMiddleware(request);
    if (!user) {
      return NextResponse.json({ message: 'Not authorized' }, { status: 401 });
    }

    // ইমেইল যাচাই বাধ্যতামূলক — AI ফিচার ব্যবহারের আগে
    if (!user.isVerified) {
      return NextResponse.json(
        { message: 'Please verify your email to use AI features', code: 'EMAIL_NOT_VERIFIED' },
        { status: 403 }
      );
    }

    // মাসিক টোকেন লিমিট চেক
    const usage = await getUsageSummary(user.id);
    if (usage.isLimitReached) {
      return NextResponse.json(
        { message: 'You have used all your free tokens this month. Please upgrade to continue.', code: 'LIMIT_REACHED' },
        { status: 403 }
      );
    }

    // রেট লিমিট - প্রতি ব্যবহারকারী প্রতি ঘণ্টায়
    const rateLimit = checkRateLimit({
      identifier: `chat:${user.id}`,
      limit: 100,
      windowMs: 60 * 60 * 1000,
    });

    if (!rateLimit.success) {
      return NextResponse.json(
        { message: 'Too many requests. Please try again later.' },
        { status: 429 }
      );
    }

    const body = await request.json();
    const validated = ChatSchema.parse(body);

    // চ্যাট খুঁজুন অথবা নতুন তৈরি করুন
    let chat;
    if (validated.chatId) {
      chat = await db.chat.findFirst({
        where: { id: validated.chatId, userId: user.id },
      });
    }

    if (!chat) {
      chat = await db.chat.create({
        data: {
          userId: user.id,
          title: validated.message.slice(0, 50),
        },
      });
    }

    // ব্যবহারকারীর বার্তা সংরক্ষণ করুন
    await db.message.create({
      data: {
        chatId: chat.id,
        role: 'user',
        content: validated.message,
      },
    });

    // AI থেকে উত্তর নিন
    const aiResponse = await aiService.chat(validated.message, validated.language);

    // AI এর বার্তা সংরক্ষণ করুন
    const tokensUsed = Math.ceil((validated.message.length + aiResponse.length) / 4);
    await db.message.create({
      data: {
        chatId: chat.id,
        role: 'assistant',
        content: aiResponse,
        tokensUsed,
      },
    });

    // ব্যবহার ট্র্যাক করুন
    await db.usage.create({
      data: {
        userId: user.id,
        feature: 'chat',
        tokensUsed,
        language: validated.language,
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        chatId: chat.id,
        response: aiResponse,
        tokensUsed,
      },
    });
  } catch (error: any) {
    console.error('Chat error:', error);

    if (error.errors) {
      return NextResponse.json({ message: error.errors[0].message }, { status: 400 });
    }

    return NextResponse.json({ message: 'Chat failed' }, { status: 500 });
  }
}
