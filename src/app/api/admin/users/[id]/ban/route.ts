// src/app/api/admin/users/[id]/ban/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { adminMiddleware } from '@/middleware/auth';
import { db } from '@/lib/db';
import { z } from 'zod';

const BanSchema = z.object({
  banned: z.boolean(),
  reason: z.string().optional(),
});

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const admin = await adminMiddleware(request);
    if (!admin) {
      return NextResponse.json({ message: 'Not authorized' }, { status: 403 });
    }

    // নিজেকে ব্যান করা প্রতিরোধ করুন
    if (id === admin.id) {
      return NextResponse.json({ message: 'You cannot ban yourself' }, { status: 400 });
    }

    const body = await request.json();
    const validated = BanSchema.parse(body);

    const user = await db.user.update({
      where: { id },
      data: {
        isBanned: validated.banned,
        banReason: validated.banned ? validated.reason || 'Policy violation' : null,
      },
      select: { id: true, name: true, email: true, isBanned: true },
    });

    return NextResponse.json({
      success: true,
      message: validated.banned ? 'User has been banned' : 'Ban has been lifted',
      data: user,
    });
  } catch (error: any) {
    console.error('Ban user error:', error);

    if (error.errors) {
      return NextResponse.json({ message: error.errors[0].message }, { status: 400 });
    }

    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
