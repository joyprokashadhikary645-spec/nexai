// src/app/admin/users/[id]/page.tsx

'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';
import toast from 'react-hot-toast';
import Loading from '@/components/common/Loading';
import {
  ArrowLeft,
  MessageSquare,
  PenLine,
  Languages,
  File,
  Zap,
  ShieldAlert,
  ShieldCheck,
  Ban,
  CheckCircle2,
} from 'lucide-react';

const getToken = () => (typeof window !== 'undefined' ? localStorage.getItem('authToken') : null);
const authHeaders = () => ({ headers: { Authorization: `Bearer ${getToken()}` } });

interface UserDetail {
  user: {
    id: string; name: string; email: string; avatar?: string; bio?: string;
    role: string; isVerified: boolean; isBanned: boolean; banReason?: string;
    twoFactorEnabled: boolean; language: string; createdAt: string; lastLoginAt?: string;
    subscriptions: { plan: string; status: string; tokensUsed: number; monthlyTokens: number; renewalDate?: string }[];
  };
  stats: { totalChats: number; totalMessages: number };
  chats: { id: string; title: string; createdAt: string; updatedAt: string; _count: { messages: number } }[];
  generatedContents: { id: string; type: string; title: string; createdAt: string; tokensUsed: number }[];
  translations: { id: string; sourceLanguage: string; targetLanguage: string; createdAt: string }[];
  documents: { id: string; fileName: string; uploadedAt: string }[];
  usageByFeature: { feature: string; _sum: { tokensUsed: number | null }; _count: { _all: number } }[];
  recentUsage: { id: string; feature: string; tokensUsed: number; language?: string; createdAt: string }[];
  auditEntries: { id: string; actorEmail: string; action: string; details?: string; createdAt: string }[];
}

export default function AdminUserDetailPage() {
  const params = useParams();
  const router = useRouter();
  const userId = params.id as string;

  const [data, setData] = useState<UserDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isBanning, setIsBanning] = useState(false);

  const fetchDetail = useCallback(async () => {
    try {
      const { data } = await axios.get(`/api/admin/users/${userId}`, authHeaders());
      setData(data.data);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Could not load user');
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchDetail();
  }, [fetchDetail]);

  const toggleBan = async () => {
    if (!data) return;
    const banning = !data.user.isBanned;
    let reason = '';
    if (banning) {
      reason = prompt('Reason for banning this user?') || '';
      if (!reason) return;
    } else if (!confirm('Unban this user?')) {
      return;
    }
    setIsBanning(true);
    try {
      await axios.patch(
        `/api/admin/users/${data.user.id}/ban`,
        { banned: banning, reason },
        authHeaders()
      );
      toast.success(banning ? 'User banned' : 'User unbanned');
      fetchDetail();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Action failed');
    } finally {
      setIsBanning(false);
    }
  };

  if (isLoading) return <Loading text="Loading user activity..." />;
  if (!data) return <p className="p-6 text-center text-gray-400">User not found</p>;

  const { user, stats } = data;
  const sub = user.subscriptions[0];

  return (
    <div className="p-4 md:p-6 max-w-4xl mx-auto">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 mb-4"
      >
        <ArrowLeft className="w-4 h-4" strokeWidth={1.75} /> Back to Users
      </button>

      {/* প্রোফাইল হেডার */}
      <div className="card-md flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary-600 to-secondary-600 flex items-center justify-center text-white font-bold text-xl overflow-hidden flex-shrink-0">
            {user.avatar ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
            ) : (
              user.name?.[0]?.toUpperCase()
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold">{user.name}</h1>
              {user.isBanned && <span className="badge badge-error">Banned</span>}
              {user.role !== 'user' && <span className="badge badge-primary">{user.role}</span>}
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">{user.email}</p>
            <div className="flex items-center gap-3 mt-1 text-xs text-gray-400">
              <span className="flex items-center gap-1">
                {user.isVerified ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-green-500" strokeWidth={1.75} />
                ) : (
                  <ShieldAlert className="w-3.5 h-3.5 text-amber-500" strokeWidth={1.75} />
                )}
                {user.isVerified ? 'Email verified' : 'Not verified'}
              </span>
              {user.twoFactorEnabled && (
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-green-500" strokeWidth={1.75} /> 2FA on
                </span>
              )}
            </div>
          </div>
        </div>
        <button
          onClick={toggleBan}
          disabled={isBanning}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 ${
            user.isBanned
              ? 'bg-green-600 hover:bg-green-700 text-white'
              : 'bg-red-600 hover:bg-red-700 text-white'
          }`}
        >
          <Ban className="w-4 h-4" strokeWidth={1.75} />
          {user.isBanned ? 'Unban User' : 'Ban / Remove Access'}
        </button>
      </div>

      {user.isBanned && user.banReason && (
        <div className="mb-6 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-sm text-red-700 dark:text-red-400">
          <strong>Ban reason:</strong> {user.banReason}
        </div>
      )}

      {/* সারসংক্ষেপ স্ট্যাটস */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <div className="card-sm text-center">
          <div className="text-xl font-bold">{stats.totalChats}</div>
          <div className="text-xs text-gray-500 dark:text-gray-400">Chats</div>
        </div>
        <div className="card-sm text-center">
          <div className="text-xl font-bold">{stats.totalMessages}</div>
          <div className="text-xs text-gray-500 dark:text-gray-400">Messages</div>
        </div>
        <div className="card-sm text-center">
          <div className="text-xl font-bold">{sub ? `${sub.tokensUsed.toLocaleString()}` : '0'}</div>
          <div className="text-xs text-gray-500 dark:text-gray-400">Tokens used</div>
        </div>
        <div className="card-sm text-center">
          <div className="text-xl font-bold capitalize">{sub?.plan || 'free'}</div>
          <div className="text-xs text-gray-500 dark:text-gray-400">Plan</div>
        </div>
      </div>

      {/* ফিচার-ভিত্তিক ব্যবহার */}
      {data.usageByFeature.length > 0 && (
        <div className="card-md mb-6">
          <h2 className="font-semibold mb-3 flex items-center gap-2">
            <Zap className="w-4 h-4" strokeWidth={1.75} /> Usage by Feature
          </h2>
          <div className="space-y-2">
            {data.usageByFeature.map((u) => (
              <div key={u.feature} className="flex items-center justify-between text-sm">
                <span className="capitalize">{u.feature}</span>
                <span className="text-gray-500 dark:text-gray-400">
                  {u._count._all} uses · {(u._sum.tokensUsed || 0).toLocaleString()} tokens
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* সাম্প্রতিক চ্যাট */}
      <div className="card-md mb-6">
        <h2 className="font-semibold mb-3 flex items-center gap-2">
          <MessageSquare className="w-4 h-4" strokeWidth={1.75} /> Recent Chats
        </h2>
        {data.chats.length === 0 ? (
          <p className="text-sm text-gray-400">No chats yet.</p>
        ) : (
          <div className="space-y-2">
            {data.chats.map((chat) => (
              <div key={chat.id} className="flex items-center justify-between text-sm border-b border-gray-100 dark:border-gray-800 pb-2 last:border-0">
                <span className="truncate">{chat.title}</span>
                <span className="text-xs text-gray-400 flex-shrink-0 ml-2">
                  {chat._count.messages} msgs · {new Date(chat.updatedAt).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* সাম্প্রতিক জেনারেট করা কন্টেন্ট */}
      <div className="card-md mb-6">
        <h2 className="font-semibold mb-3 flex items-center gap-2">
          <PenLine className="w-4 h-4" strokeWidth={1.75} /> Generated Content
        </h2>
        {data.generatedContents.length === 0 ? (
          <p className="text-sm text-gray-400">Nothing generated yet.</p>
        ) : (
          <div className="space-y-2">
            {data.generatedContents.map((gc) => (
              <div key={gc.id} className="flex items-center justify-between text-sm border-b border-gray-100 dark:border-gray-800 pb-2 last:border-0">
                <span className="truncate">
                  <span className="text-gray-400 capitalize">[{gc.type}]</span> {gc.title}
                </span>
                <span className="text-xs text-gray-400 flex-shrink-0 ml-2">
                  {new Date(gc.createdAt).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* অনুবাদ ও ডকুমেন্ট */}
      <div className="grid md:grid-cols-2 gap-4 mb-6">
        <div className="card-md">
          <h2 className="font-semibold mb-3 flex items-center gap-2">
            <Languages className="w-4 h-4" strokeWidth={1.75} /> Translations
          </h2>
          {data.translations.length === 0 ? (
            <p className="text-sm text-gray-400">None yet.</p>
          ) : (
            <div className="space-y-2">
              {data.translations.map((tr) => (
                <div key={tr.id} className="text-sm text-gray-600 dark:text-gray-300">
                  {tr.sourceLanguage} → {tr.targetLanguage}
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="card-md">
          <h2 className="font-semibold mb-3 flex items-center gap-2">
            <File className="w-4 h-4" strokeWidth={1.75} /> Documents
          </h2>
          {data.documents.length === 0 ? (
            <p className="text-sm text-gray-400">None yet.</p>
          ) : (
            <div className="space-y-2">
              {data.documents.map((doc) => (
                <div key={doc.id} className="text-sm text-gray-600 dark:text-gray-300 truncate">
                  {doc.fileName}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* মডারেশন হিস্ট্রি */}
      {data.auditEntries.length > 0 && (
        <div className="card-md">
          <h2 className="font-semibold mb-3">Moderation History</h2>
          <div className="space-y-2">
            {data.auditEntries.map((a) => (
              <div key={a.id} className="text-sm text-gray-500 dark:text-gray-400">
                <span className="font-medium text-gray-700 dark:text-gray-300">{a.actorEmail}</span> — {a.action}
                {a.details && <span> ({a.details})</span>} · {new Date(a.createdAt).toLocaleString()}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
