// src/lib/validators.ts

import { z } from 'zod';

// ==================== AUTH VALIDATORS ====================
export const RegisterSchema = z.object({
  name: z.string().min(2, 'নাম কমপক্ষে ২ অক্ষরের হতে হবে').max(50),
  email: z.string().email('অবৈধ ইমেইল ঠিকানা'),
  password: z
    .string()
    .min(8, 'পাসওয়ার্ড কমপক্ষে ৮ অক্ষরের হতে হবে')
    .regex(/[A-Z]/, 'কমপক্ষে একটি বড় হাতের অক্ষর থাকতে হবে')
    .regex(/[a-z]/, 'কমপক্ষে একটি ছোট হাতের অক্ষর থাকতে হবে')
    .regex(/[0-9]/, 'কমপক্ষে একটি সংখ্যা থাকতে হবে'),
});

export const LoginSchema = z.object({
  email: z.string().email('অবৈধ ইমেইল ঠিকানা'),
  password: z.string().min(1, 'পাসওয়ার্ড আবশ্যক'),
});

export const ForgotPasswordSchema = z.object({
  email: z.string().email('অবৈধ ইমেইল ঠিকানা'),
});

export const ResetPasswordSchema = z.object({
  token: z.string().min(1),
  password: z
    .string()
    .min(8, 'পাসওয়ার্ড কমপক্ষে ৮ অক্ষরের হতে হবে')
    .regex(/[A-Z]/, 'কমপক্ষে একটি বড় হাতের অক্ষর থাকতে হবে')
    .regex(/[a-z]/, 'কমপক্ষে একটি ছোট হাতের অক্ষর থাকতে হবে')
    .regex(/[0-9]/, 'কমপক্ষে একটি সংখ্যা থাকতে হবে'),
});

// ==================== AI GENERATOR VALIDATORS (Hashtag/Emoji সহ) ====================
export const ContentGeneratorSchema = z.object({
  topic: z.string().min(3, 'বিষয় কমপক্ষে ৩ অক্ষরের হতে হবে').max(500),
  tone: z.string().default('professional'),
  language: z.string().default('en'),
  length: z.string().default('medium'),
  includeHashtags: z.boolean().default(false),
  includeEmojis: z.boolean().default(false),
});

export const TranslatorSchema = z.object({
  text: z.string().min(1, 'অনুবাদ করার জন্য টেক্সট আবশ্যক').max(5000),
  sourceLanguage: z.string(),
  targetLanguage: z.string(),
  autoDetect: z.boolean().default(false),
  saveTranslation: z.boolean().default(false),
  includeHashtags: z.boolean().default(false),
  includeEmojis: z.boolean().default(false),
});

// ==================== USER VALIDATORS ====================
export const UpdateProfileSchema = z.object({
  name: z.string().min(2).max(50).optional(),
  bio: z.string().max(200).optional(),
  language: z.string().optional(),
  theme: z.enum(['light', 'dark']).optional(),
  emailNotifications: z.boolean().optional(),
  avatar: z.string().max(500_000, 'Image is too large').optional(), // base64 data URL, ~256px JPEG
});

// ==================== ADMIN VALIDATORS ====================
export const BanUserSchema = z.object({
  userId: z.string(),
  reason: z.string().min(3),
});
