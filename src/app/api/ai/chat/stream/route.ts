// src/app/api/ai/chat/stream/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { authMiddleware } from '@/middleware/auth';
import { checkRateLimit } from '@/middleware/rateLimit';
import { chatStream } from '@/services/ai.service';
import { db } from '@/lib/db';
import { getUsageSummary } from '@/lib/usage';
import { z } from 'zod';

const ChatSchema = z.object({
  chatId: z.string().optional(),
  message: z.string().min(1).max(4000),
  language: z.string().default('en'),
});

export async function POST(request: NextRequest) {
  const user = await authMiddleware(request);
  if (!user) {
    return NextResponse.json({ message: 'Not authorized' }, { status: 401 });
  }

  if (!user.isVerified) {
    return NextResponse.json(
      { message: 'Please verify your email to use AI features', code: 'EMAIL_NOT_VERIFIED' },
      { status: 403 }
    );
  }

  const usage = await getUsageSummary(user.id);
  if (usage.isLimitReached) {
    return NextResponse.json(
      { message: 'You have used all your free tokens this month. Please upgrade to continue.', code: 'LIMIT_REACHED' },
      { status: 403 }
    );
  }

  const rateLimit = checkRateLimit({
    identifier: `chat:${user.id}`,
    limit: 100,
    windowMs: 60 * 60 * 1000,
  });
  if (!rateLimit.success) {
    return NextResponse.json({ message: 'Too many requests. Please try again later.' }, { status: 429 });
  }

  let validated;
  try {
    validated = ChatSchema.parse(await request.json());
  } catch (error: any) {
    return NextResponse.json({ message: error.errors?.[0]?.message || 'Invalid request' }, { status: 400 });
  }

  // চ্যাট খুঁজুন অথবা নতুন তৈরি করুন (স্ট্রিম শুরুর আগেই, যাতে chatId প্রথম চাংকেই পাঠানো যায়)
  let chat = validated.chatId
    ? await db.chat.findFirst({ where: { id: validated.chatId, userId: user.id } })
    : null;

  if (!chat) {
    chat = await db.chat.create({
      data: { userId: user.id, title: validated.message.slice(0, 50) },
    });
  }

  await db.message.create({
    data: { chatId: chat.id, role: 'user', content: validated.message },
  });

  const encoder = new TextEncoder();
  const chatIdForClosure = chat.id;
  const { message, language } = validated;

  const stream = new ReadableStream({
    async start(controller) {
      const send = (obj: object) => controller.enqueue(encoder.encode(JSON.stringify(obj) + '\n'));

      send({ type: 'meta', chatId: chatIdForClosure });

      let fullText = '';
      try {
        for await (const chunk of chatStream(message, language)) {
          fullText += chunk;
          send({ type: 'chunk', text: chunk });
        }

        const tokensUsed = Math.ceil((message.length + fullText.length) / 4);

        await db.message.create({
          data: { chatId: chatIdForClosure, role: 'assistant', content: fullText, tokensUsed },
        });
        await db.usage.create({
          data: { userId: user.id, feature: 'chat', tokensUsed, language },
        });

        send({ type: 'done', tokensUsed });
      } catch (error) {
        console.error('Chat stream error:', error);
        send({ type: 'error', message: 'Response generation failed' });
      } finally {
        controller.close();
      }
    },
  });

  return new NextResponse(stream, {
    headers: {
      'Content-Type': 'application/x-ndjson; charset=utf-8',
      'Cache-Control': 'no-cache, no-transform',
    },
  });
}
