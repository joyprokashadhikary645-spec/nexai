// src/app/api/admin/super/audit-log/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { superAdminMiddleware } from '@/middleware/auth';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const actor = await superAdminMiddleware(request);
    if (!actor) {
      return NextResponse.json({ message: 'Not authorized' }, { status: 403 });
    }

    const logs = await db.auditLog.findMany({
      orderBy: { createdAt: 'desc' },
      take: 100,
    });

    return NextResponse.json({ success: true, data: logs });
  } catch (error) {
    console.error('Audit log fetch error:', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
