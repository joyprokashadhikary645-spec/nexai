// src/app/api/ai/generate/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { authMiddleware } from '@/middleware/auth';
import { getUsageSummary } from '@/lib/usage';
import { checkRateLimit } from '@/middleware/rateLimit';
import { aiService } from '@/services/ai.service';
import { enhanceContent } from '@/lib/hashtagEmoji';
import { db } from '@/lib/db';
import { z } from 'zod';

const GenerateSchema = z.object({
  toolType: z.enum([
    'content-writer',
    'blog-generator',
    'email-generator',
    'facebook-post',
    'instagram-caption',
    'youtube-script',
    'grammar-checker',
    'resume-builder',
  ]),
  topic: z.string().min(1).max(1000),
  description: z.string().max(2000).optional().default(''),
  tone: z.string().default('professional'),
  language: z.string().default('en'),
  includeHashtags: z.boolean().default(false),
  includeEmojis: z.boolean().default(false),
  saveContent: z.boolean().default(false),
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
      identifier: `generate:${user.id}`,
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
    const v = GenerateSchema.parse(body);

    // টুল অনুযায়ী সঠিক AI সার্ভিস কল করুন
    let rawContent = '';

    switch (v.toolType) {
      case 'content-writer':
        rawContent = await aiService.generateContent(v.topic, v.tone, v.language);
        break;
      case 'blog-generator':
        rawContent = await aiService.generateBlog(v.topic, v.description, v.language);
        break;
      case 'email-generator':
        rawContent = await aiService.generateEmail(v.tone, `${v.topic}. ${v.description}`, v.language);
        break;
      case 'facebook-post':
        rawContent = await aiService.generateFacebookPost(v.topic, v.tone, v.language);
        break;
      case 'instagram-caption':
        rawContent = await aiService.generateInstagramCaption(
          v.topic,
          v.includeHashtags,
          v.includeEmojis,
          v.language
        );
        break;
      case 'youtube-script':
        rawContent = await aiService.generateYoutubeScript(v.topic, v.description || '10 minutes', v.language);
        break;
      case 'grammar-checker':
        rawContent = await aiService.checkGrammar(v.topic, v.language);
        break;
      case 'resume-builder':
        rawContent = await aiService.generateResume(v.topic, v.description, v.language);
        break;
    }

    // Hashtag/Emoji যোগ করুন (Instagram এর জন্য AI নিজেই করে, তাই ডাবল এড়াতে স্কিপ করুন)
    let finalContent = rawContent;
    let hashtags = '';
    let emojis = '';

    if (v.toolType !== 'instagram-caption' && v.toolType !== 'grammar-checker') {
      const enhanced = enhanceContent({
        content: rawContent,
        toolType: v.toolType,
        includeHashtags: v.includeHashtags,
        includeEmojis: v.includeEmojis,
      });
      finalContent = enhanced.content;
      hashtags = enhanced.hashtags;
      emojis = enhanced.emojis;
    }

    // টোকেন হিসাব করুন
    const tokensUsed = Math.ceil((v.topic.length + finalContent.length) / 4);

    // ডেটাবেসে সংরক্ষণ করুন (যদি ব্যবহারকারী চেয়ে থাকে)
    let savedId: string | null = null;
    if (v.saveContent) {
      const saved = await db.generatedContent.create({
        data: {
          userId: user.id,
          type: v.toolType,
          title: v.topic.slice(0, 60),
          content: finalContent,
          hashtags,
          emojis,
          includeHashtags: v.includeHashtags,
          includeEmojis: v.includeEmojis,
          tokensUsed,
        },
      });
      savedId = saved.id;
    }

    // ব্যবহার ট্র্যাক করুন
    await db.usage.create({
      data: {
        userId: user.id,
        feature: v.toolType,
        tokensUsed,
        language: v.language,
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        content: finalContent,
        hashtags,
        emojis,
        tokensUsed,
        savedId,
      },
    });
  } catch (error: any) {
    console.error('Generate error:', error);

    if (error.errors) {
      return NextResponse.json({ message: error.errors[0].message }, { status: 400 });
    }

    return NextResponse.json({ message: 'Content generation failed' }, { status: 500 });
  }
}
