// src/app/dashboard/page.tsx

'use client';

import Link from 'next/link';
import { MessageSquare, PenLine, Languages, Zap } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/hooks/useLanguage';
import { AI_TOOLS } from '@/lib/constants';
import { TOOL_ICONS } from '@/lib/icons';

export default function DashboardPage() {
  const { user } = useAuth();
  const { t, tTool } = useLanguage();

  const stats = [
    { label: t('statTotalChats'), value: '0', icon: MessageSquare },
    { label: t('statContentCreated'), value: '0', icon: PenLine },
    { label: t('statTranslations'), value: '0', icon: Languages },
    { label: t('statTokensUsed'), value: '0 / 100k', icon: Zap },
  ];

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto">
      <div className="bg-gradient-to-r from-primary-600 to-secondary-600 rounded-2xl p-6 md:p-8 text-white mb-8">
        <h1 className="text-2xl md:text-3xl font-bold mb-2">
          {t('welcomeBack')}, {user?.name?.split(' ')[0]}!
        </h1>
        <p className="text-white/80 mb-4">{t('whatToCreate')}</p>
        <Link
          href="/dashboard/chat"
          className="inline-flex items-center gap-2 bg-white text-primary-600 px-5 py-2.5 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
        >
          <MessageSquare className="w-4 h-4" /> {t('startNewChat')}
        </Link>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <div key={stat.label} className="card-md">
            <stat.icon className="w-6 h-6 mb-2 text-primary-600 dark:text-primary-400" strokeWidth={1.75} />
            <div className="text-xl font-bold">{stat.value}</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-bold">{t('allAiTools')}</h2>
        <Link href="/dashboard/tools" className="text-sm text-primary-600 dark:text-primary-400 hover:underline">
          {t('viewAll')}
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {AI_TOOLS.map((tool) => {
          const Icon = TOOL_ICONS[tool.id] || MessageSquare;
          return (
            <Link
              key={tool.id}
              href={tool.path}
              className="card-sm hover:shadow-md hover:border-primary-300 dark:hover:border-primary-700 transition-all group"
            >
              <Icon className="w-7 h-7 mb-2 text-primary-600 dark:text-primary-400" strokeWidth={1.75} />
              <h3 className="font-semibold text-sm mb-1 group-hover:text-primary-600 dark:group-hover:text-primary-400">
                {tTool(tool.id, 'name', tool.name)}
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">
                {tTool(tool.id, 'desc', tool.description)}
              </p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
