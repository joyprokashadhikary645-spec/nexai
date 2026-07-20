// src/app/api/auth/delete-account/route.ts

import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { authMiddleware } from '@/middleware/auth';
import { db } from '@/lib/db';
import { ROLES } from '@/lib/roles';

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

    // পাসওয়ার্ড ছাড়া একাউন্ট ডিলিট করা যাবে না — এটা ফেরানো যায় না এমন কাজ
    const isValid = await bcrypt.compare(password || '', user.passwordHash);
    if (!isValid) {
      return NextResponse.json({ message: 'Incorrect password' }, { status: 401 });
    }

    // শেষ super_admin নিজের একাউন্ট ডিলিট করে পুরো সিস্টেমকে মালিকহীন করতে পারবে না
    if (user.role === ROLES.SUPER_ADMIN) {
      const superAdminCount = await db.user.count({ where: { role: ROLES.SUPER_ADMIN } });
      if (superAdminCount <= 1) {
        return NextResponse.json(
          { message: 'You are the only Super Admin. Promote someone else first.' },
          { status: 400 }
        );
      }
    }

    // ইউজার ডিলিট করলে Chat, Message, GeneratedContent, Translation, Document,
    // Usage, Subscription — সব সংশ্লিষ্ট ডেটা schema-র cascade rule অনুযায়ী নিজে থেকেই ডিলিট হয়ে যাবে
    await db.user.delete({ where: { id: user.id } });

    return NextResponse.json({ success: true, message: 'Account deleted' });
  } catch (error) {
    console.error('Delete account error:', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
