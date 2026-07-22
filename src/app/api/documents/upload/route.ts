// src/app/api/documents/upload/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { authMiddleware } from '@/middleware/auth';
import { checkRateLimit } from '@/middleware/rateLimit';
import { aiService } from '@/services/ai.service';
import { documentService } from '@/services/document.service';
import { db } from '@/lib/db';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // ৫ এমবি

export async function POST(request: NextRequest) {
  try {
    const user = await authMiddleware(request);
    if (!user) {
      return NextResponse.json({ message: 'Not authorized' }, { status: 401 });
    }

    const rateLimit = checkRateLimit({
      identifier: `document-upload:${user.id}`,
      limit: 20,
      windowMs: 60 * 60 * 1000,
    });

    if (!rateLimit.success) {
      return NextResponse.json(
        { message: 'Too many requests. Please try again later.' },
        { status: 429 }
      );
    }

    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ message: 'No file found' }, { status: 400 });
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { message: 'File is too large. Keep it under 5MB.' },
        { status: 400 }
      );
    }

    const fileType = documentService.getFileType(file.name);

    if (!documentService.isSupportedType(fileType)) {
      return NextResponse.json(
        { message: 'Only PDF, DOCX, and TXT files are supported' },
        { status: 400 }
      );
    }

    // ফাইলকে বাফারে রূপান্তর করুন
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // টেক্সট এক্সট্র্যাক্ট করুন
    const extractedText = await documentService.extractText(buffer, fileType);

    if (!extractedText || extractedText.trim().length < 20) {
      return NextResponse.json(
        { message: 'Not enough text could be extracted from the file' },
        { status: 400 }
      );
    }

    // সারাংশ তৈরি করুন (৩০০০ অক্ষর পর্যন্ত সীমাবদ্ধ - ফ্রি মডেলের ইনপুট সীমার জন্য)
    const truncatedText = extractedText.slice(0, 3000);
    const summary = await aiService.summarize(truncatedText);

    const tokensUsed = Math.ceil((extractedText.length + summary.length) / 4);

    // ডেটাবেসে সংরক্ষণ করুন
    const document = await db.document.create({
      data: {
        userId: user.id,
        fileName: file.name,
        fileType,
        fileSize: file.size,
        fileUrl: '', // নোট: Supabase Storage ইন্টিগ্রেশন ভবিষ্যতে যোগ করা যাবে; এখন শুধু টেক্সট প্রসেসিং হচ্ছে
        summary,
        extractedText: extractedText.slice(0, 10000), // ডেটাবেসে অতিরিক্ত বড় টেক্সট এড়াতে সীমিত রাখা
        isProcessed: true,
        tokensUsed,
        processedAt: new Date(),
      },
    });

    // ব্যবহার ট্র্যাক করুন
    await db.usage.create({
      data: {
        userId: user.id,
        feature: 'document-summarizer',
        tokensUsed,
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        documentId: document.id,
        fileName: file.name,
        summary,
        tokensUsed,
      },
    });
  } catch (error: any) {
    console.error('Document upload error:', error);
    return NextResponse.json({ message: 'File processing failed' }, { status: 500 });
  }
}
