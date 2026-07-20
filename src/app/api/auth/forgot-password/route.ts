// src/app/api/auth/forgot-password/route.ts

import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { db } from '@/lib/db';
import { ForgotPasswordSchema } from '@/lib/validators';
import { emailService } from '@/services/email.service';
import { checkRateLimit, getClientIp } from '@/middleware/rateLimit';

export async function POST(request: NextRequest) {
  try {
    const ip = getClientIp(request);
    const rateLimit = checkRateLimit({
      identifier: `forgot-password:${ip}`,
      limit: 3,
      windowMs: 60 * 60 * 1000,
    });

    if (!rateLimit.success) {
      return NextResponse.json(
        { message: 'Too many requests. Please try again in an hour.' },
        { status: 429 }
      );
    }

    const body = await request.json();
    const validated = ForgotPasswordSchema.parse(body);

    const user = await db.user.findUnique({
      where: { email: validated.email },
    });

    // নিরাপত্তার জন্য - ব্যবহারকারী না থাকলেও একই বার্তা দেখান
    if (!user) {
      return NextResponse.json({
        success: true,
        message: 'If this email is registered, a reset link will be sent.',
      });
    }

    // রিসেট টোকেন তৈরি করুন
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenHash = crypto.createHash('sha256').update(resetToken).digest('hex');
    const resetExpires = new Date(Date.now() + 60 * 60 * 1000); // ১ ঘণ্টা

    await db.adminSetting.upsert({
      where: { key: `reset_token_${user.id}` },
      create: {
        key: `reset_token_${user.id}`,
        value: JSON.stringify({ token: resetTokenHash, expires: resetExpires }),
      },
      update: {
        value: JSON.stringify({ token: resetTokenHash, expires: resetExpires }),
      },
    });

    // ইমেইল পাঠান
    const resetUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/reset-password?token=${resetToken}&email=${encodeURIComponent(user.email)}`;
    await emailService.sendPasswordResetEmail(user.email, user.name, resetUrl);

    return NextResponse.json({
      success: true,
      message: 'If this email is registered, a reset link will be sent.',
    });
  } catch (error: any) {
    console.error('Forgot password error:', error);

    if (error.errors) {
      return NextResponse.json({ message: error.errors[0].message }, { status: 400 });
    }

    return NextResponse.json({ message: 'Request failed' }, { status: 500 });
  }
}
