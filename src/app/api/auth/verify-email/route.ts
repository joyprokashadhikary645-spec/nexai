// src/app/api/auth/verify-email/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { consumeVerificationToken } from '@/lib/emailVerification';

export async function POST(request: NextRequest) {
  try {
    const { email, token } = await request.json();
    if (!email || !token) {
      return NextResponse.json({ message: 'Invalid verification link' }, { status: 400 });
    }

    const success = await consumeVerificationToken(email, token);
    if (!success) {
      return NextResponse.json(
        { message: 'This verification link is invalid or has expired' },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true, message: 'Email verified successfully' });
  } catch (error) {
    console.error('Verify email error:', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
