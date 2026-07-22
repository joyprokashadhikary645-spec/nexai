// src/app/api/chats/[id]/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { authMiddleware } from '@/middleware/auth';
import { db } from '@/lib/db';

// নির্দিষ্ট চ্যাটের সব মেসেজ আনুন
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const user = await authMiddleware(request);
    if (!user) {
      return NextResponse.json({ message: 'Not authorized' }, { status: 401 });
    }

    const chat = await db.chat.findFirst({
      where: { id, userId: user.id },
      include: {
        messages: {
          orderBy: { createdAt: 'asc' },
        },
      },
    });

    if (!chat) {
      return NextResponse.json({ message: 'Chat not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: chat });
  } catch (error) {
    console.error('Get chat error:', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}

// চ্যাট মুছে ফেলুন
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const user = await authMiddleware(request);
    if (!user) {
      return NextResponse.json({ message: 'Not authorized' }, { status: 401 });
    }

    const chat = await db.chat.findFirst({
      where: { id, userId: user.id },
    });

    if (!chat) {
      return NextResponse.json({ message: 'Chat not found' }, { status: 404 });
    }

    await db.chat.delete({ where: { id } });

    return NextResponse.json({ success: true, message: 'Chat deleted' });
  } catch (error) {
    console.error('Delete chat error:', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}

// চ্যাট আপডেট করুন (টাইটেল/সংরক্ষণ/পিন)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const user = await authMiddleware(request);
    if (!user) {
      return NextResponse.json({ message: 'Not authorized' }, { status: 401 });
    }

    const body = await request.json();
    const chat = await db.chat.findFirst({
      where: { id, userId: user.id },
    });

    if (!chat) {
      return NextResponse.json({ message: 'Chat not found' }, { status: 404 });
    }

    const updated = await db.chat.update({
      where: { id },
      data: {
        title: body.title ?? chat.title,
        isSaved: body.isSaved ?? chat.isSaved,
        isPinned: body.isPinned ?? chat.isPinned,
      },
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error('Update chat error:', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
