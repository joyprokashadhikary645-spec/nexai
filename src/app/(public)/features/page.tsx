// src/app/(public)/features/page.tsx

import Link from 'next/link';
import { AI_TOOLS } from '@/lib/constants';
import { TOOL_ICONS } from '@/lib/icons';
import { MessageSquare } from 'lucide-react';

export default function FeaturesPage() {
  return (
    <div className="section">
      <div className="container">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Powerful AI Tools</h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg max-w-2xl mx-auto">
            Everything you need to chat, write, code, translate, and create —
            all powered by AI, completely free.
          </p>
        </div>

        <div className="grid-auto">
          {AI_TOOLS.map((tool) => {
            const Icon = TOOL_ICONS[tool.id] || MessageSquare;
            return (
              <div key={tool.id} className="card-md">
                <Icon className="w-8 h-8 mb-3 text-primary-600 dark:text-primary-400" strokeWidth={1.5} />
                <h3 className="text-xl font-semibold mb-2">{tool.name}</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                  {tool.description}
                </p>
                <Link
                  href="/register"
                  className="text-primary-600 dark:text-primary-400 text-sm font-medium hover:underline"
                >
                  Try it free →
                </Link>
              </div>
            );
          })}
        </div>

        <div className="text-center mt-16">
          <Link
            href="/register"
            className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white px-8 py-4 rounded-2xl font-semibold hover:opacity-90 transition-opacity inline-block shadow-lg shadow-primary-600/20"
          >
            Get Started for Free
          </Link>
        </div>
      </div>
    </div>
  );
}
