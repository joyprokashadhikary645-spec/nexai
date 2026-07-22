// src/app/dashboard/tools/[id]/page.tsx

'use client';

import { useParams } from 'next/navigation';
import { SearchX } from 'lucide-react';
import { TOOL_CONFIGS } from '@/lib/toolConfig';
import GeneratorForm from '@/components/ai-tools/GeneratorForm';

export default function DynamicToolPage() {
  const params = useParams();
  const toolId = params.id as string;
  const config = TOOL_CONFIGS[toolId];

  if (!config) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-6">
        <SearchX className="w-14 h-14 mb-4 text-gray-300 dark:text-gray-700" strokeWidth={1.5} />
        <h2 className="text-xl font-bold mb-2">টুল খুঁজে পাওয়া যায়নি</h2>
        <p className="text-gray-500 dark:text-gray-400">এই নামে কোনো AI টুল নেই।</p>
      </div>
    );
  }

  return <GeneratorForm config={config} />;
}
