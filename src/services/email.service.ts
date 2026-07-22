// src/services/email.service.ts

import axios from 'axios';

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const RESEND_API_URL = 'https://api.resend.com/emails';
const FROM_EMAIL = 'NexAI <onboarding@resend.dev>'; // Resend এর ডিফল্ট ডোমেইন (যাচাইকরণ ছাড়া কাজ করে)

async function sendEmail(to: string, subject: string, html: string) {
  try {
    await axios.post(
      RESEND_API_URL,
      {
        from: FROM_EMAIL,
        to,
        subject,
        html,
      },
      {
        headers: {
          Authorization: `Bearer ${RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error: any) {
    console.error('Email sending error:', error.response?.data || error.message);
    // ইমেইল ব্যর্থ হলেও মূল অপারেশন যেন বন্ধ না হয়, তাই এরর থ্রো করা হয় না
  }
}

export const emailService = {
  // ইমেইল যাচাইকরণ পাঠান
  async sendVerificationEmail(email: string, name: string, verifyUrl: string) {
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #2563eb;">🚀 NexAI তে স্বাগতম, ${name}!</h1>
        <p>আপনার অ্যাকাউন্ট যাচাই করতে নিচের বাটনে ক্লিক করুন:</p>
        <a href="${verifyUrl}" style="display: inline-block; background: #2563eb; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; margin: 16px 0;">
          ইমেইল যাচাই করুন
        </a>
        <p style="color: #6b7280; font-size: 14px;">এই লিংকটি ২৪ ঘণ্টার জন্য কার্যকর থাকবে।</p>
      </div>
    `;
    await sendEmail(email, 'আপনার ইমেইল যাচাই করুন - NexAI', html);
  },

  // পাসওয়ার্ড রিসেট ইমেইল পাঠান
  async sendPasswordResetEmail(email: string, name: string, resetUrl: string) {
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #2563eb;">পাসওয়ার্ড রিসেট অনুরোধ</h1>
        <p>হ্যালো ${name},</p>
        <p>আপনার পাসওয়ার্ড রিসেট করতে নিচের বাটনে ক্লিক করুন:</p>
        <a href="${resetUrl}" style="display: inline-block; background: #2563eb; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; margin: 16px 0;">
          পাসওয়ার্ড রিসেট করুন
        </a>
        <p style="color: #6b7280; font-size: 14px;">এই লিংকটি ১ ঘণ্টার জন্য কার্যকর থাকবে। যদি আপনি এই অনুরোধ না করে থাকেন, এই ইমেইলটি উপেক্ষা করুন।</p>
      </div>
    `;
    await sendEmail(email, 'পাসওয়ার্ড রিসেট করুন - NexAI', html);
  },

  // স্বাগতম ইমেইল পাঠান
  async sendWelcomeEmail(email: string, name: string) {
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #2563eb;">🎉 স্বাগতম, ${name}!</h1>
        <p>NexAI তে যোগ দেওয়ার জন্য ধন্যবাদ। এখন আপনি ১০+ AI টুলস ব্যবহার করতে পারবেন।</p>
        <a href="${process.env.NEXT_PUBLIC_SITE_URL}/dashboard" style="display: inline-block; background: #2563eb; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; margin: 16px 0;">
          ড্যাশবোর্ডে যান
        </a>
      </div>
    `;
    await sendEmail(email, 'NexAI তে স্বাগতম!', html);
  },
};
