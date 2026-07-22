// src/app/api/auth/2fa/setup/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { authenticator } from 'otplib';
import QRCode from 'qrcode';
import { authMiddleware } from '@/middleware/auth';
import { db } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const user = await authMiddleware(request);
    if (!user) {
      return NextResponse.json({ message: 'Not authorized' }, { status: 401 });
    }

    // নতুন সিক্রেট তৈরি করুন (এখনো চালু হয়নি, /enable-এ কনফার্ম করতে হবে)
    const secret = authenticator.generateSecret();
    const otpauth = authenticator.keyuri(user.email, 'NexAI', secret);
    const qrCodeDataUrl = await QRCode.toDataURL(otpauth);

    await db.user.update({
      where: { id: user.id },
      data: { twoFactorSecret: secret, twoFactorEnabled: false },
    });

    return NextResponse.json({
      success: true,
      data: { qrCodeDataUrl, secret },
    });
  } catch (error) {
    console.error('2FA setup error:', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
