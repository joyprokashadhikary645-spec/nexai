// src/app/api/ai/code-generator/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { authMiddleware } from '@/middleware/auth';
import { getUsageSummary } from '@/lib/usage';
import { checkRateLimit } from '@/middleware/rateLimit';
import { aiService } from '@/services/ai.service';
import { db } from '@/lib/db';
import { z } from 'zod';

const CodeSchema = z.object({
  description: z.string().min(3).max(1000),
  language: z.string().default('javascript'), // javascript, html, css, python, etc
  saveContent: z.boolean().default(true),
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

    const rateLimit = checkRateLimit({
      identifier: `code-generator:${user.id}`,
      limit: 60,
      windowMs: 60 * 60 * 1000,
    });

    if (!rateLimit.success) {
      return NextResponse.json(
        { message: 'Too many requests. Please try again later.' },
        { status: 429 }
      );
    }

    const body = await request.json();
    const v = CodeSchema.parse(body);

    const code = await aiService.generateCode(v.description, v.language);
    const tokensUsed = Math.ceil((v.description.length + code.length) / 4);

    let savedId: string | null = null;
    if (v.saveContent) {
      const saved = await db.generatedContent.create({
        data: {
          userId: user.id,
          type: `code-${v.language}`,
          title: v.description.slice(0, 60),
          content: code,
          tokensUsed,
        },
      });
      savedId = saved.id;
    }

    await db.usage.create({
      data: {
        userId: user.id,
        feature: 'code-generator',
        tokensUsed,
        language: v.language,
      },
    });

    return NextResponse.json({
      success: true,
      data: { content: code, tokensUsed, savedId },
    });
  } catch (error: any) {
    console.error('Code generator error:', error);

    if (error.errors) {
      return NextResponse.json({ message: error.errors[0].message }, { status: 400 });
    }

    return NextResponse.json({ message: 'Code generation failed' }, { status: 500 });
  }
}
