// src/app/api/admin/super/admins/[id]/route.ts
// শুধুমাত্র super_admin — নির্দিষ্ট ইউজারের রোল পরিবর্তন (promote/demote)

import { NextRequest, NextResponse } from 'next/server';
import { superAdminMiddleware } from '@/middleware/auth';
import { db } from '@/lib/db';
import { isValidRole, ROLES } from '@/lib/roles';
import { notify } from '@/lib/notify';

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const actor = await superAdminMiddleware(request);
    if (!actor) {
      return NextResponse.json({ message: 'Not authorized' }, { status: 403 });
    }

    const { role } = await request.json();
    if (!role || !isValidRole(role)) {
      return NextResponse.json({ message: 'Invalid role' }, { status: 400 });
    }

    // নিজের role নিজে বদলে নিজেকে লক-আউট করা ঠেকানো
    if (id === actor.id) {
      return NextResponse.json(
        { message: 'You cannot change your own role' },
        { status: 400 }
      );
    }

    const target = await db.user.findUnique({ where: { id } });
    if (!target) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    // অন্তত একজন super_admin সবসময় থাকা দরকার — শেষ super_admin-কে ডিমোট করতে দেওয়া হবে না
    if (target.role === ROLES.SUPER_ADMIN && role !== ROLES.SUPER_ADMIN) {
      const superAdminCount = await db.user.count({ where: { role: ROLES.SUPER_ADMIN } });
      if (superAdminCount <= 1) {
        return NextResponse.json(
          { message: 'At least one Super Admin must remain' },
          { status: 400 }
        );
      }
    }

    const updated = await db.user.update({
      where: { id },
      data: { role },
      select: { id: true, name: true, email: true, role: true },
    });

    // অডিট লগ — কে কার রোল কবে বদলেছে
    await db.auditLog.create({
      data: {
        actorId: actor.id,
        actorEmail: actor.email,
        action: 'role_change',
        targetId: target.id,
        targetEmail: target.email,
        details: JSON.stringify({ from: target.role, to: role }),
        ipAddress: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || null,
      },
    });

    await notify({
      userId: target.id,
      type: 'role_change',
      title: 'Your account role has changed',
      message: `Your role was changed from "${target.role}" to "${role}" by ${actor.email}.`,
      link: '/dashboard/settings',
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error('Role update error:', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
