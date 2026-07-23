// src/app/api/ai/image-generator/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { authMiddleware } from '@/middleware/auth';
import { getUsageSummary } from '@/lib/usage';
import { checkRateLimit } from '@/middleware/rateLimit';
import { aiService } from '@/services/ai.service';
import { db } from '@/lib/db';
import { z } from 'zod';

const ImageGenSchema = z.object({
  prompt: z.string().min(3).max(500),
});

export async function POST(request: NextRequest) {
  try {
    const user = await authMiddleware(request);
    if (!user) {
      return NextResponse.json({ message: 'Not authorized' }, { status: 401 });
    }

    // মাসিক টোকেন লিমিট চেক
    const usage = await getUsageSummary(user.id);
    if (usage.isLimitReached) {
      return NextResponse.json(
        { message: 'You have used all your free tokens this month. Please upgrade to continue.', code: 'LIMIT_REACHED' },
        { status: 403 }
      );
    }

    // ছবি তৈরি ব্যয়বহুল, তাই কম রেট লিমিট
    const rateLimit = checkRateLimit({
      identifier: `image-generator:${user.id}`,
      limit: 15,
      windowMs: 60 * 60 * 1000,
    });

    if (!rateLimit.success) {
      return NextResponse.json(
        { message: 'Too many requests. Please try again later.' },
        { status: 429 }
      );
    }

    const body = await request.json();
    const v = ImageGenSchema.parse(body);

    const imageBuffer = await aiService.generateImage(v.prompt);
    const base64Image = `data:image/png;base64,${imageBuffer.toString('base64')}`;

    const tokensUsed = 500; // ছবি জেনারেশনের জন্য আনুমানিক টোকেন খরচ

    // ব্যবহার ট্র্যাক করুন
    await db.usage.create({
      data: {
        userId: user.id,
        feature: 'image-generator',
        tokensUsed,
      },
    });

    return NextResponse.json({
      success: true,
      data: { image: base64Image, tokensUsed },
    });
  } catch (error: any) {
    console.error('Image generator error:', error);

    if (error.errors) {
      return NextResponse.json({ message: error.errors[0].message }, { status: 400 });
    }

    return NextResponse.json(
      { message: 'Image generation failed. The model may still be loading — please try again.' },
      { status: 500 }
    );
  }
}
