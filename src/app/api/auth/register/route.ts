// src/app/api/auth/register/route.ts

import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { db } from '@/lib/db';
import { signToken } from '@/lib/jwt';
import { RegisterSchema } from '@/lib/validators';
import { checkRateLimit, getClientIp } from '@/middleware/rateLimit';
import { issueVerificationEmail } from '@/lib/emailVerification';

export async function POST(request: NextRequest) {
  try {
    // রেট লিমিট চেক করুন
    const ip = getClientIp(request);
    const rateLimit = checkRateLimit({
      identifier: `register:${ip}`,
      limit: 5,
      windowMs: 60 * 60 * 1000, // ১ ঘণ্টা
    });

    if (!rateLimit.success) {
      return NextResponse.json(
        { message: 'Too many requests. Please try again in an hour.' },
        { status: 429 }
      );
    }

    const body = await request.json();
    const validated = RegisterSchema.parse(body);

    // ইমেইল ইতিমধ্যে ব্যবহৃত কিনা চেক করুন
    const existingUser = await db.user.findUnique({
      where: { email: validated.email },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: 'This email is already in use' },
        { status: 400 }
      );
    }

    // পাসওয়ার্ড হ্যাশ করুন
    const passwordHash = await bcrypt.hash(validated.password, 10);

    // নতুন ব্যবহারকারী তৈরি করুন
    const user = await db.user.create({
      data: {
        name: validated.name,
        email: validated.email,
        passwordHash,
      },
    });

    // ফ্রি সাবস্ক্রিপশন তৈরি করুন
    await db.subscription.create({
      data: {
        userId: user.id,
        plan: 'free',
        status: 'active',
        monthlyTokens: 100000,
      },
    });

    // যাচাইকরণ ইমেইল পাঠান (ব্যর্থ হলেও রেজিস্ট্রেশন আটকাবে না — emailService নিজেই এরর হ্যান্ডেল করে)
    await issueVerificationEmail(user.id, user.email, user.name);

    // JWT টোকেন তৈরি করুন
    const token = signToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    return NextResponse.json({
      success: true,
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
        language: user.language,
        theme: user.theme,
      },
    });
  } catch (error: any) {
    console.error('Register error:', error);

    if (error.errors) {
      return NextResponse.json(
        { message: error.errors[0].message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: 'Registration failed' },
      { status: 500 }
    );
  }
}
