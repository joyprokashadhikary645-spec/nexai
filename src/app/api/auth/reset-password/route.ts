// src/app/api/auth/reset-password/route.ts

import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import { db } from '@/lib/db';
import { z } from 'zod';

const ResetSchema = z.object({
  token: z.string(),
  email: z.string().email(),
  password: z
    .string()
    .min(8, 'পাসওয়ার্ড কমপক্ষে ৮ অক্ষরের হতে হবে')
    .regex(/[A-Z]/, 'কমপক্ষে একটি বড় হাতের অক্ষর থাকতে হবে')
    .regex(/[a-z]/, 'কমপক্ষে একটি ছোট হাতের অক্ষর থাকতে হবে')
    .regex(/[0-9]/, 'কমপক্ষে একটি সংখ্যা থাকতে হবে'),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = ResetSchema.parse(body);

    const user = await db.user.findUnique({ where: { email: validated.email } });
    if (!user) {
      return NextResponse.json({ message: 'Invalid request' }, { status: 400 });
    }

    const setting = await db.adminSetting.findUnique({
      where: { key: `reset_token_${user.id}` },
    });

    if (!setting) {
      return NextResponse.json({ message: 'Reset link has expired' }, { status: 400 });
    }

    const { token: storedHash, expires } = JSON.parse(setting.value);
    const providedHash = crypto.createHash('sha256').update(validated.token).digest('hex');

    if (providedHash !== storedHash || new Date(expires) < new Date()) {
      return NextResponse.json({ message: 'Reset link has expired or is invalid' }, { status: 400 });
    }

    const passwordHash = await bcrypt.hash(validated.password, 10);

    await db.user.update({
      where: { id: user.id },
      data: { passwordHash },
    });

    // ব্যবহৃত টোকেন মুছে ফেলুন
    await db.adminSetting.delete({ where: { key: `reset_token_${user.id}` } });

    return NextResponse.json({ success: true, message: 'Password changed successfully' });
  } catch (error: any) {
    console.error('Reset password error:', error);

    if (error.errors) {
      return NextResponse.json({ message: error.errors[0].message }, { status: 400 });
    }

    return NextResponse.json({ message: 'Password reset failed' }, { status: 500 });
  }
}
