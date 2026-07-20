// src/app/api/admin/super/status/route.ts
// শুধুমাত্র super_admin — কোন কোন সার্ভিস/কী কনফিগার করা আছে তার status (কখনো আসল ভ্যালু না)

import { NextRequest, NextResponse } from 'next/server';
import { superAdminMiddleware } from '@/middleware/auth';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const actor = await superAdminMiddleware(request);
    if (!actor) {
      return NextResponse.json({ message: 'Not authorized' }, { status: 403 });
    }

    const [totalUsers, totalAdmins, totalSuperAdmins, totalChats] = await Promise.all([
      db.user.count(),
      db.user.count({ where: { role: 'admin' } }),
      db.user.count({ where: { role: 'super_admin' } }),
      db.chat.count(),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        counts: { totalUsers, totalAdmins, totalSuperAdmins, totalChats },
        // শুধু "configured" কিনা — আসল key কখনোই ফেরত পাঠানো হয় না
        services: {
          gemini: Boolean(process.env.NEXT_PUBLIC_GEMINI_API_KEY),
          openrouter: Boolean(process.env.NEXT_PUBLIC_OPENROUTER_API_KEY),
          huggingface: Boolean(process.env.NEXT_PUBLIC_HF_API_KEY),
          database: Boolean(process.env.DATABASE_URL),
        },
      },
    });
  } catch (error) {
    console.error('System status error:', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
