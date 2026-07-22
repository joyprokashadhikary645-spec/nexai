// src/lib/usage.ts

import { db } from '@/lib/db';

export interface UsageSummary {
  used: number;
  limit: number;
  plan: string;
  percentage: number; // 0-100+
  isLimitReached: boolean;
}

/** এই ক্যালেন্ডার মাসে ইউজার কত টোকেন ব্যবহার করেছে — Usage লগ থেকে সরাসরি হিসাব করা হয়,
 *  তাই আলাদা করে Subscription.tokensUsed sync রাখার দরকার নেই, সবসময় সঠিক থাকে। */
export async function getUsageSummary(userId: string): Promise<UsageSummary> {
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const [usageAgg, subscription] = await Promise.all([
    db.usage.aggregate({
      where: { userId, createdAt: { gte: startOfMonth } },
      _sum: { tokensUsed: true },
    }),
    db.subscription.findFirst({ where: { userId } }),
  ]);

  const used = usageAgg._sum.tokensUsed || 0;
  const limit = subscription?.monthlyTokens || 100_000;
  const percentage = limit > 0 ? Math.round((used / limit) * 100) : 0;

  return {
    used,
    limit,
    plan: subscription?.plan || 'free',
    percentage,
    isLimitReached: used >= limit,
  };
}
