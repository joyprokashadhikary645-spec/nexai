// src/app/api/auth/google/route.ts

import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import { db } from '@/lib/db';
import { signToken } from '@/lib/jwt';

// Google থেকে পাওয়া authorization code দিয়ে access token সংগ্রহ এবং প্রোফাইল আনুন
export async function POST(request: NextRequest) {
  try {
    const { code } = await request.json();

    if (!code) {
      return NextResponse.json({ message: 'No Google code provided' }, { status: 400 });
    }

    // ধাপ ১: Authorization code কে access token এ রূপান্তর করুন
    const tokenResponse = await axios.post('https://oauth2.googleapis.com/token', {
      code,
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      redirect_uri: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/google/callback`,
      grant_type: 'authorization_code',
    });

    const { access_token } = tokenResponse.data;

    // ধাপ ২: Google থেকে ব্যবহারকারীর প্রোফাইল আনুন
    const profileResponse = await axios.get(
      'https://www.googleapis.com/oauth2/v2/userinfo',
      { headers: { Authorization: `Bearer ${access_token}` } }
    );

    const { id: googleId, email, name, picture } = profileResponse.data;

    // ধাপ ৩: ব্যবহারকারী খুঁজুন অথবা তৈরি করুন
    let user = await db.user.findUnique({ where: { googleId } });

    if (!user) {
      // ইমেইল দিয়ে খুঁজুন (হয়তো আগে সাধারণভাবে নিবন্ধিত)
      user = await db.user.findUnique({ where: { email } });

      if (user) {
        // বিদ্যমান অ্যাকাউন্টের সাথে Google সংযুক্ত করুন
        user = await db.user.update({
          where: { id: user.id },
          data: { googleId, avatar: picture },
        });
      } else {
        // নতুন ব্যবহারকারী তৈরি করুন
        user = await db.user.create({
          data: {
            googleId,
            email,
            name,
            avatar: picture,
            isVerified: true, // Google একাউন্ট ইতিমধ্যে যাচাইকৃত
          },
        });

        // ফ্রি সাবস্ক্রিপশন তৈরি করুন
        await db.subscription.create({
          data: {
            userId: user.id,
            plan: 'free',
            status: 'active',
            monthlyTokens: 100000,
          },
        });
      }
    }

    if (user.isBanned) {
      return NextResponse.json(
        { message: 'Your account has been banned' },
        { status: 403 }
      );
    }

    // শেষ লগইন আপডেট করুন
    await db.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    // JWT টোকেন তৈরি করুন
    const token = signToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    return NextResponse.json({
      success: true,
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        role: user.role,
        isVerified: user.isVerified,
        language: user.language,
        theme: user.theme,
      },
    });
  } catch (error: any) {
    console.error('Google login error:', error.response?.data || error.message);
    return NextResponse.json({ message: 'Google login failed' }, { status: 500 });
  }
}
