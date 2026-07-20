// src/app/api/usage/summary/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { authMiddleware } from '@/middleware/auth';
import { getUsageSummary } from '@/lib/usage';

export async function GET(request: NextRequest) {
  try {
    const user = await authMiddleware(request);
    if (!user) {
      return NextResponse.json({ message: 'Not authorized' }, { status: 401 });
    }

    const summary = await getUsageSummary(user.id);
    return NextResponse.json({ success: true, data: summary });
  } catch (error) {
    console.error('Usage summary error:', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
