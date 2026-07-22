// src/app/admin/super/page.tsx

'use client';

import { Users, UserCog, Shield, MessageSquare, ShieldCheck, Cog } from 'lucide-react';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import axios from 'axios';
import Loading from '@/components/common/Loading';

const getToken = () => (typeof window !== 'undefined' ? localStorage.getItem('authToken') : null);

interface StatusData {
  counts: { totalUsers: number; totalAdmins: number; totalSuperAdmins: number; totalChats: number };
  services: { gemini: boolean; openrouter: boolean; huggingface: boolean; database: boolean };
}

export default function SuperAdminOverviewPage() {
  const [status, setStatus] = useState<StatusData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    axios
      .get('/api/admin/super/status', { headers: { Authorization: `Bearer ${getToken()}` } })
      .then(({ data }) => setStatus(data.data))
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) return <Loading text="Loading system status..." />;

  const services = status
    ? [
        { label: 'Gemini API', ok: status.services.gemini },
        { label: 'OpenRouter API', ok: status.services.openrouter },
        { label: 'Hugging Face API', ok: status.services.huggingface },
        { label: 'Database', ok: status.services.database },
      ]
    : [];

  return (
    <div className="p-4 md:p-6 max-w-5xl mx-auto">
      <div className="flex items-center gap-2 mb-6">
        <h1 className="text-2xl font-bold">Super Admin</h1>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="card-md">
          <Users className="w-6 h-6 mb-1 text-primary-600 dark:text-primary-400" strokeWidth={1.75} />
          <div className="text-xl font-bold">{status?.counts.totalUsers ?? '—'}</div>
          <div className="text-sm text-gray-500 dark:text-gray-400">Total Users</div>
        </div>
        <div className="card-md">
          <UserCog className="w-6 h-6 mb-1 text-primary-600 dark:text-primary-400" strokeWidth={1.75} />
          <div className="text-xl font-bold">{status?.counts.totalAdmins ?? '—'}</div>
          <div className="text-sm text-gray-500 dark:text-gray-400">Admins</div>
        </div>
        <div className="card-md">
          <Shield className="w-6 h-6 mb-1 text-primary-600 dark:text-primary-400" strokeWidth={1.75} />
          <div className="text-xl font-bold">{status?.counts.totalSuperAdmins ?? '—'}</div>
          <div className="text-sm text-gray-500 dark:text-gray-400">Super Admins</div>
        </div>
        <div className="card-md">
          <MessageSquare className="w-6 h-6 mb-1 text-primary-600 dark:text-primary-400" strokeWidth={1.75} />
          <div className="text-xl font-bold">{status?.counts.totalChats ?? '—'}</div>
          <div className="text-sm text-gray-500 dark:text-gray-400">Total Chats</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <Link href="/admin/super/admins" className="card-md hover:border-purple-400 transition-colors group">
          <ShieldCheck className="w-8 h-8 mb-2 text-purple-600" strokeWidth={1.75} />
          <h3 className="font-semibold group-hover:text-purple-600">Manage Admins</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">Promote, demote, or remove admin access</p>
        </Link>
        <Link href="/admin/super/system" className="card-md hover:border-purple-400 transition-colors group">
          <Cog className="w-8 h-8 mb-2 text-purple-600" strokeWidth={1.75} />
          <h3 className="font-semibold group-hover:text-purple-600">System Control</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">Maintenance mode, registration, token limits</p>
        </Link>
      </div>

      <div className="card-md">
        <h2 className="font-semibold mb-3">Connected Services</h2>
        <div className="space-y-2">
          {services.map((s) => (
            <div key={s.label} className="flex items-center justify-between text-sm">
              <span>{s.label}</span>
              <span className={`badge ${s.ok ? 'badge-success' : 'badge-error'}`}>
                {s.ok ? 'Configured' : 'Missing'}
              </span>
            </div>
          ))}
        </div>
        <p className="text-xs text-gray-400 mt-3">
          Security note: actual API key values are never shown here — only whether each one is configured on the server.
        </p>
      </div>
    </div>
  );
}
