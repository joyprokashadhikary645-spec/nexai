// src/app/api/auth/profile/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { authMiddleware } from '@/middleware/auth';
import { db } from '@/lib/db';
import { UpdateProfileSchema } from '@/lib/validators';

export async function PUT(request: NextRequest) {
  try {
    const user = await authMiddleware(request);
    if (!user) {
      return NextResponse.json({ message: 'Not authorized' }, { status: 401 });
    }

    const body = await request.json();
    const validated = UpdateProfileSchema.parse(body);

    const updatedUser = await db.user.update({
      where: { id: user.id },
      data: validated,
      select: {
        id: true,
        name: true,
        email: true,
        avatar: true,
        bio: true,
        role: true,
        isVerified: true,
        language: true,
        theme: true,
        emailNotifications: true,
      },
    });

    return NextResponse.json({ success: true, user: updatedUser });
  } catch (error: any) {
    console.error('Profile update error:', error);

    if (error.errors) {
      return NextResponse.json({ message: error.errors[0].message }, { status: 400 });
    }

    return NextResponse.json({ message: 'Update failed' }, { status: 500 });
  }
}
