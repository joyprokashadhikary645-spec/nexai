// src/app/api/auth/login/route.ts

import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db } from '@/lib/db';
import { signToken } from '@/lib/jwt';
import { LoginSchema } from '@/lib/validators';
import { checkRateLimit, getClientIp } from '@/middleware/rateLimit';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-change-this';
const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_MINUTES = 15;

export async function POST(request: NextRequest) {
  try {
    // রেট লিমিট চেক করুন
    const ip = getClientIp(request);
    const rateLimit = checkRateLimit({
      identifier: `login:${ip}`,
      limit: 10,
      windowMs: 15 * 60 * 1000, // ১৫ মিনিট
    });

    if (!rateLimit.success) {
      return NextResponse.json(
        { message: 'Too many requests. Please try again in 15 minutes.' },
        { status: 429 }
      );
    }

    const body = await request.json();
    const validated = LoginSchema.parse(body);

    // ব্যবহারকারী খুঁজুন
    const user = await db.user.findUnique({
      where: { email: validated.email },
    });

    if (!user || !user.passwordHash) {
      return NextResponse.json(
        { message: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // ব্যান চেক করুন
    if (user.isBanned) {
      return NextResponse.json(
        { message: 'Your account has been banned. Please contact support.' },
        { status: 403 }
      );
    }

    // অ্যাকাউন্ট লক আছে কিনা চেক করুন (বারবার ভুল পাসওয়ার্ডের কারণে)
    if (user.lockedUntil && user.lockedUntil > new Date()) {
      const minutesLeft = Math.ceil((user.lockedUntil.getTime() - Date.now()) / 60000);
      return NextResponse.json(
        { message: `Too many failed attempts. Try again in ${minutesLeft} minute(s).` },
        { status: 423 }
      );
    }

    // পাসওয়ার্ড যাচাই করুন
    const isValidPassword = await bcrypt.compare(validated.password, user.passwordHash);

    if (!isValidPassword) {
      const attempts = user.failedLoginAttempts + 1;
      const shouldLock = attempts >= MAX_FAILED_ATTEMPTS;

      await db.user.update({
        where: { id: user.id },
        data: {
          failedLoginAttempts: shouldLock ? 0 : attempts,
          lockedUntil: shouldLock ? new Date(Date.now() + LOCKOUT_MINUTES * 60 * 1000) : null,
        },
      });

      return NextResponse.json(
        shouldLock
          ? { message: `Too many failed attempts. Account locked for ${LOCKOUT_MINUTES} minutes.` }
          : { message: 'Invalid email or password' },
        { status: shouldLock ? 423 : 401 }
      );
    }

    // ২FA চালু থাকলে — সরাসরি লগইন না করিয়ে একটা শর্ট-লিভড temp token পাঠান,
    // ক্লায়েন্ট /api/auth/2fa/login-verify-এ কোড দিয়ে ভেরিফাই করবে
    if (user.twoFactorEnabled) {
      const tempToken = jwt.sign(
        { userId: user.id, purpose: '2fa-pending' },
        JWT_SECRET,
        { expiresIn: '5m' }
      );
      return NextResponse.json({
        success: true,
        requiresTwoFactor: true,
        tempToken,
      });
    }

    // সফল লগইন — ব্যর্থ চেষ্টার কাউন্টার রিসেট করুন, লক আছে থাকলে সরান
    await db.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date(), failedLoginAttempts: 0, lockedUntil: null },
    });

    // JWT টোকেন তৈরি করুন
    const token = signToken({
      userId: user.id,
      email: user.email,
      role: user.role,
      tokenVersion: user.tokenVersion,
    });

    return NextResponse.json({
      success: true,
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        role: user.role,
        isVerified: user.isVerified,
        language: user.language,
        theme: user.theme,
      },
    });
  } catch (error: any) {
    console.error('Login error:', error);

    if (error.errors) {
      return NextResponse.json(
        { message: error.errors[0].message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: 'Login failed' },
      { status: 500 }
    );
  }
}
