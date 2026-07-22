// src/lib/emailVerification.ts

import crypto from 'crypto';
import { db } from '@/lib/db';
import { emailService } from '@/services/email.service';
import { notify } from '@/lib/notify';

const VERIFY_EXPIRY_MS = 24 * 60 * 60 * 1000; // ২৪ ঘণ্টা

/** নতুন verification টোকেন বানিয়ে ইমেইল পাঠায় */
export async function issueVerificationEmail(userId: string, email: string, name: string) {
  const token = crypto.randomBytes(32).toString('hex');
  const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
  const expires = new Date(Date.now() + VERIFY_EXPIRY_MS);

  await db.adminSetting.upsert({
    where: { key: `verify_token_${userId}` },
    create: { key: `verify_token_${userId}`, value: JSON.stringify({ token: tokenHash, expires }) },
    update: { value: JSON.stringify({ token: tokenHash, expires }) },
  });

  const verifyUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/verify-email?token=${token}&email=${encodeURIComponent(email)}`;
  await emailService.sendVerificationEmail(email, name, verifyUrl);
}

/** টোকেন যাচাই করে isVerified true করে দেয়; সফল হলে true */
export async function consumeVerificationToken(email: string, token: string): Promise<boolean> {
  const user = await db.user.findUnique({ where: { email } });
  if (!user) return false;

  const record = await db.adminSetting.findUnique({ where: { key: `verify_token_${user.id}` } });
  if (!record) return false;

  const { token: storedHash, expires } = JSON.parse(record.value);
  const tokenHash = crypto.createHash('sha256').update(token).digest('hex');

  if (tokenHash !== storedHash || new Date(expires) < new Date()) return false;

  await db.user.update({ where: { id: user.id }, data: { isVerified: true } });
  await db.adminSetting.delete({ where: { key: `verify_token_${user.id}` } }).catch(() => {});

  await notify({
    userId: user.id,
    type: 'email_verified',
    title: 'Email verified ✅',
    message: 'Your email is verified — all AI features are now unlocked. Welcome to NexAI!',
    link: '/dashboard',
  });

  return true;
}
