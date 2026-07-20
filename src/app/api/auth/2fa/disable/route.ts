// src/app/api/auth/2fa/disable/route.ts

import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { authMiddleware } from '@/middleware/auth';
import { db } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const authUser = await authMiddleware(request);
    if (!authUser) {
      return NextResponse.json({ message: 'Not authorized' }, { status: 401 });
    }

    const { password } = await request.json();
    const user = await db.user.findUnique({ where: { id: authUser.id } });
    if (!user?.passwordHash) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    // পাসওয়ার্ড ছাড়া ২FA বন্ধ করা যাবে না — এটাই একাউন্টের প্রধান সুরক্ষা স্তর
    const isValid = await bcrypt.compare(password || '', user.passwordHash);
    if (!isValid) {
      return NextResponse.json({ message: 'Incorrect password' }, { status: 401 });
    }

    await db.user.update({
      where: { id: user.id },
      data: { twoFactorEnabled: false, twoFactorSecret: null },
    });

    return NextResponse.json({ success: true, message: '2FA disabled' });
  } catch (error) {
    console.error('2FA disable error:', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
