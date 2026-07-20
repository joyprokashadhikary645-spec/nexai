// src/app/api/admin/subscriptions/[id]/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { adminMiddleware } from '@/middleware/auth';
import { db } from '@/lib/db';
import { RATE_LIMITS } from '@/lib/constants';
import { z } from 'zod';

const UpdateSchema = z.object({
  plan: z.enum(['free', 'pro', 'enterprise']),
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

    const body = await request.json();
    const validated = UpdateSchema.parse(body);

    const monthlyTokens = RATE_LIMITS[validated.plan].tokensPerMonth;

    const subscription = await db.subscription.update({
      where: { id },
      data: {
        plan: validated.plan,
        monthlyTokens,
        renewalDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      },
    });

    return NextResponse.json({ success: true, data: subscription });
  } catch (error: any) {
    console.error('Update subscription error:', error);

    if (error.errors) {
      return NextResponse.json({ message: error.errors[0].message }, { status: 400 });
    }

    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
