// src/app/api/auth/me/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { verifyToken, extractTokenFromHeader } from '@/lib/jwt';

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    const token = extractTokenFromHeader(authHeader);

    if (!token) {
      return NextResponse.json({ message: 'No token provided' }, { status: 401 });
    }

    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
    }

    const user = await db.user.findUnique({
      where: { id: payload.userId },
      select: {
        id: true,
        name: true,
        email: true,
        avatar: true,
        role: true,
        isVerified: true,
        isBanned: true,
        language: true,
        theme: true,
        createdAt: true,
        tokenVersion: true,
        twoFactorEnabled: true,
      },
    });

    if (!user || user.isBanned) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    // সেশন রিভোক হয়ে থাকলে (Log out of all devices) পুরোনো টোকেন এখানেও বাতিল হবে
    if ((payload.tokenVersion ?? 0) !== user.tokenVersion) {
      return NextResponse.json({ message: 'Session expired' }, { status: 401 });
    }

    const { tokenVersion, ...safeUser } = user;
    return NextResponse.json({ user: safeUser });
  } catch (error) {
    console.error('Me endpoint error:', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
