// src/app/dashboard/tools/page.tsx

'use client';

import Link from 'next/link';
import { MessageSquare } from 'lucide-react';
import { AI_TOOLS } from '@/lib/constants';
import { useLanguage } from '@/hooks/useLanguage';
import { TOOL_ICONS } from '@/lib/icons';

export default function ToolsPage() {
  const { t, tTool } = useLanguage();

  return (
    <div className="p-4 md:p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-2">{t('toolsPageTitle')}</h1>
      <p className="text-gray-500 dark:text-gray-400 mb-6">
        {t('toolsPageDesc')}
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {AI_TOOLS.map((tool) => {
          const Icon = TOOL_ICONS[tool.id] || MessageSquare;
          return (
            <Link
              key={tool.id}
              href={tool.path}
              className="card-md hover:shadow-lg hover:border-primary-300 dark:hover:border-primary-700 transition-all group"
            >
              <Icon className="w-7 h-7 mb-3 text-primary-600 dark:text-primary-400" strokeWidth={1.75} />
              <h3 className="font-semibold mb-1 group-hover:text-primary-600 dark:group-hover:text-primary-400">
                {tTool(tool.id, 'name', tool.name)}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">{tTool(tool.id, 'desc', tool.description)}</p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
