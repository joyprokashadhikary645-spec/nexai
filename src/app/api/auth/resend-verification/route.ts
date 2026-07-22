// src/app/api/auth/resend-verification/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { authMiddleware } from '@/middleware/auth';
import { db } from '@/lib/db';
import { issueVerificationEmail } from '@/lib/emailVerification';
import { checkRateLimit, getClientIp } from '@/middleware/rateLimit';

export async function POST(request: NextRequest) {
  try {
    const authUser = await authMiddleware(request);
    if (!authUser) {
      return NextResponse.json({ message: 'Not authorized' }, { status: 401 });
    }

    const rateLimit = checkRateLimit({
      identifier: `resend-verify:${authUser.id}`,
      limit: 3,
      windowMs: 15 * 60 * 1000,
    });
    if (!rateLimit.success) {
      return NextResponse.json(
        { message: 'Too many requests. Please try again later.' },
        { status: 429 }
      );
    }

    const user = await db.user.findUnique({ where: { id: authUser.id } });
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }
    if (user.isVerified) {
      return NextResponse.json({ success: true, message: 'Already verified' });
    }

    await issueVerificationEmail(user.id, user.email, user.name);
    return NextResponse.json({ success: true, message: 'Verification email sent' });
  } catch (error) {
    console.error('Resend verification error:', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
