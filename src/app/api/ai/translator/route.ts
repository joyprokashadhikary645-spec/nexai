// src/app/api/ai/translator/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { authMiddleware } from '@/middleware/auth';
import { getUsageSummary } from '@/lib/usage';
import { checkRateLimit } from '@/middleware/rateLimit';
import { aiService } from '@/services/ai.service';
import { db } from '@/lib/db';
import { TranslatorSchema } from '@/lib/validators';

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
      identifier: `translator:${user.id}`,
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
    const v = TranslatorSchema.parse(body);

    let sourceLanguage = v.sourceLanguage;

    // স্বয়ংক্রিয় ভাষা শনাক্তকরণ (সাধারণ heuristic - Unicode রেঞ্জ চেক)
    if (v.autoDetect) {
      sourceLanguage = detectLanguageHeuristic(v.text);
    }

    const translatedText = await aiService.translate(v.text, sourceLanguage, v.targetLanguage);

    // অনুবাদ করা টেক্সট সরাসরি AI থেকে আসা আউটপুট — এর সাথে fixed/generic hashtag বা emoji
    // জুড়ে দেওয়া হয় না, যাতে অনুবাদ ঠিক ততটুকুই থাকে যা ইউজার চেয়েছে।
    const hashtags = '';
    const emojis = '';

    const tokensUsed = Math.ceil((v.text.length + translatedText.length) / 4);

    // সংরক্ষণ করুন (যদি চাওয়া হয়)
    let savedId: string | null = null;
    if (v.saveTranslation) {
      const saved = await db.translation.create({
        data: {
          userId: user.id,
          sourceText: v.text,
          sourceLanguage,
          translatedText,
          targetLanguage: v.targetLanguage,
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
        feature: 'translator',
        tokensUsed,
        language: sourceLanguage,
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        sourceLanguage,
        translatedText,
        tokensUsed,
        savedId,
      },
    });
  } catch (error: any) {
    console.error('Translation error:', error);

    if (error.errors) {
      return NextResponse.json({ message: error.errors[0].message }, { status: 400 });
    }

    return NextResponse.json({ message: 'Translation failed' }, { status: 500 });
  }
}

// সাধারণ Unicode রেঞ্জ ভিত্তিক ভাষা শনাক্তকরণ (বিনামূল্যে, কোনো API কল ছাড়া)
function detectLanguageHeuristic(text: string): string {
  const ranges: { [key: string]: RegExp } = {
    bn: /[\u0980-\u09FF]/,
    hi: /[\u0900-\u097F]/,
    ar: /[\u0600-\u06FF]/,
    zh: /[\u4E00-\u9FFF]/,
    ja: /[\u3040-\u30FF]/,
    ko: /[\uAC00-\uD7AF]/,
    ru: /[\u0400-\u04FF]/,
    ta: /[\u0B80-\u0BFF]/,
    te: /[\u0C00-\u0C7F]/,
    ur: /[\u0600-\u06FF]/,
  };

  for (const [lang, regex] of Object.entries(ranges)) {
    if (regex.test(text)) return lang;
  }

  return 'en'; // ডিফল্ট
}
