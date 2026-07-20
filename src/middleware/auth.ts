// src/middleware/auth.ts

import { NextRequest } from 'next/server';
import { verifyToken, extractTokenFromHeader } from '@/lib/jwt';
import { db } from '@/lib/db';
import { canAccessAdminPanel, isSuperAdmin } from '@/lib/roles';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: string;
  isBanned: boolean;
  isVerified: boolean;
}

// রিকোয়েস্ট থেকে ব্যবহারকারী যাচাই করুন
export async function authMiddleware(request: NextRequest): Promise<AuthUser | null> {
  try {
    const authHeader = request.headers.get('authorization');
    const token = extractTokenFromHeader(authHeader);

    if (!token) return null;

    const payload = verifyToken(token);
    if (!payload) return null;

    const user = await db.user.findUnique({
      where: { id: payload.userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isBanned: true,
        isVerified: true,
        tokenVersion: true,
      },
    });

    if (!user || user.isBanned) return null;

    // সেশন রিভোকেশন চেক — "Log out of all devices" চাপলে tokenVersion বাড়ে,
    // তখন পুরোনো সব টোকেন এই চেকে বাতিল হয়ে যাবে
    if ((payload.tokenVersion ?? 0) !== user.tokenVersion) return null;

    const { tokenVersion, ...authUser } = user;
    return authUser;
  } catch (error) {
    console.error('Auth middleware error:', error);
    return null;
  }
}

// শুধুমাত্র অ্যাডমিনদের জন্য চেক করুন (admin এবং super_admin — দুজনেই /admin ড্যাশবোর্ড ব্যবহার করতে পারবে)
export async function adminMiddleware(request: NextRequest): Promise<AuthUser | null> {
  const user = await authMiddleware(request);
  if (!user || !canAccessAdminPanel(user.role)) return null;
  return user;
}

// শুধুমাত্র super_admin-দের জন্য চেক করুন (Admin ম্যানেজমেন্ট ও সিস্টেম-লেভেল কন্ট্রোলের জন্য)
export async function superAdminMiddleware(request: NextRequest): Promise<AuthUser | null> {
  const user = await authMiddleware(request);
  if (!user || !isSuperAdmin(user.role)) return null;
  return user;
}
