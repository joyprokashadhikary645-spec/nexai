// prisma/seed.ts

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding শুরু হচ্ছে...');

  // ==================== Admin অ্যাকাউন্ট তৈরি করুন ====================
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@nexai.app';
  const adminPassword = process.env.ADMIN_PASSWORD || 'Admin@123456';

  const existingAdmin = await prisma.user.findUnique({ where: { email: adminEmail } });

  if (!existingAdmin) {
    const passwordHash = await bcrypt.hash(adminPassword, 10);

    const admin = await prisma.user.create({
      data: {
        name: 'NexAI Admin',
        email: adminEmail,
        passwordHash,
        role: 'admin',
        isVerified: true,
      },
    });

    await prisma.subscription.create({
      data: {
        userId: admin.id,
        plan: 'enterprise',
        status: 'active',
        monthlyTokens: 10000000,
      },
    });

    console.log(`✅ Admin অ্যাকাউন্ট তৈরি হয়েছে:`);
    console.log(`   ইমেইল: ${adminEmail}`);
    console.log(`   পাসওয়ার্ড: ${adminPassword}`);
    console.log(`   ⚠️  প্রথম লগইনের পরে পাসওয়ার্ড পরিবর্তন করুন!`);
  } else {
    console.log('ℹ️  Admin অ্যাকাউন্ট ইতিমধ্যে বিদ্যমান, স্কিপ করা হচ্ছে।');
  }

  // ==================== ডিফল্ট Admin Settings ====================
  const defaultSettings = [
    { key: 'site_name', value: 'NexAI', description: 'সাইটের নাম' },
    { key: 'maintenance_mode', value: 'false', description: 'মেইনটেন্যান্স মোড চালু/বন্ধ' },
    { key: 'allow_registration', value: 'true', description: 'নতুন নিবন্ধন অনুমতি' },
    { key: 'free_plan_tokens', value: '100000', description: 'ফ্রি প্ল্যান মাসিক টোকেন' },
  ];

  for (const setting of defaultSettings) {
    await prisma.adminSetting.upsert({
      where: { key: setting.key },
      create: setting,
      update: {},
    });
  }

  console.log('✅ ডিফল্ট সেটিংস সেট করা হয়েছে');
  console.log('🎉 Seeding সম্পূর্ণ!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding ব্যর্থ হয়েছে:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
