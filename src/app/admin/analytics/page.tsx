// src/app/admin/analytics/page.tsx

'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import Loading from '@/components/common/Loading';

const getToken = () => (typeof window !== 'undefined' ? localStorage.getItem('authToken') : null);

interface FeatureUsage {
  feature: string;
  count: number;
  tokensUsed: number;
}

const FEATURE_LABELS: { [key: string]: string } = {
  chat: 'AI Chat',
  'content-writer': 'Content Writer',
  'blog-generator': 'Blog Generator',
  'email-generator': 'Email Generator',
  'facebook-post': 'Facebook Post',
  'instagram-caption': 'Instagram Caption',
  'youtube-script': 'YouTube Script',
  'grammar-checker': 'Grammar Checker',
  translator: 'Translator',
  'document-summarizer': 'Document Summarizer',
  'code-generator': 'Code Generator',
  'resume-builder': 'Resume Builder',
};

export default function AdminAnalyticsPage() {
  const [featureUsage, setFeatureUsage] = useState<FeatureUsage[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get('/api/admin/analytics', {
          headers: { Authorization: `Bearer ${getToken()}` },
        });
        setFeatureUsage(data.data.usageByFeature);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const maxCount = Math.max(...featureUsage.map((f) => f.count), 1);

  return (
    <div className="p-4 md:p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Analytics</h1>

      {isLoading ? (
        <Loading text="Loading..." />
      ) : (
        <div className="card-md">
          <h2 className="font-semibold mb-6">Usage by Feature</h2>

          {featureUsage.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400 text-center py-8">
              No usage data yet
            </p>
          ) : (
            <div className="space-y-4">
              {featureUsage.map((item) => (
                <div key={item.feature}>
                  <div className="flex items-center justify-between mb-1.5 text-sm">
                    <span className="font-medium">
                      {FEATURE_LABELS[item.feature] || item.feature}
                    </span>
                    <span className="text-gray-500 dark:text-gray-400">
                      {item.count} uses • {item.tokensUsed.toLocaleString()} tokens
                    </span>
                  </div>
                  <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-2.5">
                    <div
                      className="bg-primary-600 h-2.5 rounded-full transition-all"
                      style={{ width: `${(item.count / maxCount) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
