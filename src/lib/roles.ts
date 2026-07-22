// src/lib/roles.ts
//
// রোল সিস্টেমের কেন্দ্রীয় সংজ্ঞা। এখানে ৩টা লেভেল:
//   user        → সাধারণ ব্যবহারকারী
//   admin       → /admin ড্যাশবোর্ড অ্যাক্সেস (ইউজার ম্যানেজমেন্ট, অ্যানালিটিক্স, সাবস্ক্রিপশন)
//   super_admin → admin-এর সব ক্ষমতা + Admin অ্যাকাউন্ট ম্যানেজ করা + সিস্টেম-লেভেল সেটিংস

export const ROLES = {
  USER: 'user',
  ADMIN: 'admin',
  SUPER_ADMIN: 'super_admin',
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];

/** /admin ড্যাশবোর্ডে ঢুকতে পারবে কিনা (admin অথবা super_admin) */
export function canAccessAdminPanel(role?: string | null): boolean {
  return role === ROLES.ADMIN || role === ROLES.SUPER_ADMIN;
}

/** শুধু super_admin-দের জন্য নির্দিষ্ট সেকশন */
export function isSuperAdmin(role?: string | null): boolean {
  return role === ROLES.SUPER_ADMIN;
}

/** ভ্যালিড রোল কিনা (role পরিবর্তনের সময় ইনপুট ভ্যালিডেশনের জন্য) */
export function isValidRole(role: string): role is Role {
  return role === ROLES.USER || role === ROLES.ADMIN || role === ROLES.SUPER_ADMIN;
}
