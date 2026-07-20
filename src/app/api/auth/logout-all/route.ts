// src/app/api/auth/logout-all/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { authMiddleware } from '@/middleware/auth';
import { db } from '@/lib/db';
import { signToken } from '@/lib/jwt';

export async function POST(request: NextRequest) {
  try {
    const authUser = await authMiddleware(request);
    if (!authUser) {
      return NextResponse.json({ message: 'Not authorized' }, { status: 401 });
    }

    const user = await db.user.update({
      where: { id: authUser.id },
      data: { tokenVersion: { increment: 1 } },
    });

    // এই ডিভাইসের জন্য একটা নতুন বৈধ টোকেন দিয়ে দিই, যাতে এই সেশনটা লগ-আউট না হয়ে যায়
    const token = signToken({
      userId: user.id,
      email: user.email,
      role: user.role,
      tokenVersion: user.tokenVersion,
    });

    return NextResponse.json({ success: true, token, message: 'All other sessions have been logged out' });
  } catch (error) {
    console.error('Logout-all error:', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
