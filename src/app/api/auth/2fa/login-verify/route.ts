// src/app/api/auth/2fa/login-verify/route.ts

import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { authenticator } from 'otplib';
import { db } from '@/lib/db';
import { signToken } from '@/lib/jwt';
import { checkRateLimit, getClientIp } from '@/middleware/rateLimit';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-change-this';

export async function POST(request: NextRequest) {
  try {
    const ip = getClientIp(request);
    const rateLimit = checkRateLimit({
      identifier: `2fa:${ip}`,
      limit: 10,
      windowMs: 15 * 60 * 1000,
    });
    if (!rateLimit.success) {
      return NextResponse.json({ message: 'Too many attempts. Try again later.' }, { status: 429 });
    }

    const { tempToken, code } = await request.json();
    if (!tempToken || !code) {
      return NextResponse.json({ message: 'Code is required' }, { status: 400 });
    }

    let payload: { userId: string; purpose: string };
    try {
      payload = jwt.verify(tempToken, JWT_SECRET) as any;
    } catch {
      return NextResponse.json({ message: 'Session expired, please log in again' }, { status: 401 });
    }
    if (payload.purpose !== '2fa-pending') {
      return NextResponse.json({ message: 'Invalid session' }, { status: 400 });
    }

    const user = await db.user.findUnique({ where: { id: payload.userId } });
    if (!user || !user.twoFactorEnabled || !user.twoFactorSecret) {
      return NextResponse.json({ message: 'Invalid session' }, { status: 400 });
    }
    if (user.isBanned) {
      return NextResponse.json({ message: 'Account banned' }, { status: 403 });
    }

    const isValid = authenticator.verify({ token: code, secret: user.twoFactorSecret });
    if (!isValid) {
      return NextResponse.json({ message: 'Invalid code' }, { status: 400 });
    }

    await db.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date(), failedLoginAttempts: 0, lockedUntil: null },
    });

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
  } catch (error) {
    console.error('2FA login-verify error:', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
