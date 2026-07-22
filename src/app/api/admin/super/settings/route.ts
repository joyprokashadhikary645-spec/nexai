// src/app/api/admin/super/settings/route.ts
// শুধুমাত্র super_admin — সিস্টেম-লেভেল সেটিংস (আগে থেকে থাকা AdminSetting টেবিল ব্যবহার করে)

import { NextRequest, NextResponse } from 'next/server';
import { superAdminMiddleware } from '@/middleware/auth';
import { db } from '@/lib/db';

const SETTING_KEYS = ['maintenanceMode', 'allowRegistration', 'defaultMonthlyTokens'] as const;
type SettingKey = (typeof SETTING_KEYS)[number];

const DEFAULTS: Record<SettingKey, string> = {
  maintenanceMode: 'false',
  allowRegistration: 'true',
  defaultMonthlyTokens: '100000',
};

export async function GET(request: NextRequest) {
  try {
    const actor = await superAdminMiddleware(request);
    if (!actor) {
      return NextResponse.json({ message: 'Not authorized' }, { status: 403 });
    }

    const rows = await db.adminSetting.findMany({ where: { key: { in: [...SETTING_KEYS] } } });
    const settings: Record<string, string> = { ...DEFAULTS };
    rows.forEach((row) => {
      settings[row.key] = row.value;
    });

    return NextResponse.json({ success: true, data: settings });
  } catch (error) {
    console.error('Settings fetch error:', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const actor = await superAdminMiddleware(request);
    if (!actor) {
      return NextResponse.json({ message: 'Not authorized' }, { status: 403 });
    }

    const body = await request.json();
    const updates = SETTING_KEYS.filter((key) => body[key] !== undefined);

    await Promise.all(
      updates.map((key) =>
        db.adminSetting.upsert({
          where: { key },
          create: { key, value: String(body[key]) },
          update: { value: String(body[key]) },
        })
      )
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Settings update error:', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
