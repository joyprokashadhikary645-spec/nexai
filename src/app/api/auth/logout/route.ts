// src/app/api/auth/logout/route.ts

import { NextRequest, NextResponse } from 'next/server';

// নোট: যেহেতু আমরা localStorage-based JWT ব্যবহার করছি (httpOnly cookie নয়),
// প্রকৃত লগআউট ক্লায়েন্ট সাইডে টোকেন মুছে ফেলার মাধ্যমে হয়।
// এই এন্ডপয়েন্ট ভবিষ্যতে টোকেন ব্ল্যাকলিস্টিং এর জন্য ব্যবহার করা যেতে পারে।

export async function POST(request: NextRequest) {
  return NextResponse.json({ success: true, message: 'Logged out successfully' });
}
