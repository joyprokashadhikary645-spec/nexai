// src/app/api/auth/2fa/enable/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { authenticator } from 'otplib';
import { authMiddleware } from '@/middleware/auth';
import { db } from '@/lib/db';
import { notify } from '@/lib/notify';

export async function POST(request: NextRequest) {
  try {
    const authUser = await authMiddleware(request);
    if (!authUser) {
      return NextResponse.json({ message: 'Not authorized' }, { status: 401 });
    }

    const { code } = await request.json();
    if (!code) {
      return NextResponse.json({ message: 'Verification code is required' }, { status: 400 });
    }

    const user = await db.user.findUnique({ where: { id: authUser.id } });
    if (!user?.twoFactorSecret) {
      return NextResponse.json({ message: 'Run 2FA setup first' }, { status: 400 });
    }

    const isValid = authenticator.verify({ token: code, secret: user.twoFactorSecret });
    if (!isValid) {
      return NextResponse.json({ message: 'Invalid code, please try again' }, { status: 400 });
    }

    await db.user.update({
      where: { id: user.id },
      data: { twoFactorEnabled: true },
    });

    await notify({
      userId: user.id,
      type: 'security',
      title: '2FA enabled ',
      message: 'Two-factor authentication is now active on your account.',
      link: '/dashboard/settings',
    });

    return NextResponse.json({ success: true, message: '2FA enabled' });
  } catch (error) {
    console.error('2FA enable error:', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
