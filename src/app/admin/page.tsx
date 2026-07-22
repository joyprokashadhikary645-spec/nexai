// src/app/admin/page.tsx

'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { Users, BarChart3, CreditCard, UserPlus, UserCheck, Ban, MessageSquare, MessagesSquare, PenLine, Zap, type LucideIcon } from 'lucide-react';

const getToken = () => (typeof window !== 'undefined' ? localStorage.getItem('authToken') : null);

interface Overview {
  totalUsers: number;
  newUsersLast30Days: number;
  activeUsersLast7Days: number;
  bannedUsers: number;
  totalChats: number;
  totalMessages: number;
  totalGeneratedContent: number;
  totalTranslations: number;
  totalDocuments: number;
  totalTokensUsed: number;
}

export default function AdminDashboardPage() {
  const [overview, setOverview] = useState<Overview | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get('/api/admin/analytics', {
          headers: { Authorization: `Bearer ${getToken()}` },
        });
        setOverview(data.data.overview);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const statCards: { label: string; value: any; icon: LucideIcon; color: string }[] = overview
    ? [
        { label: 'Total Users', value: overview.totalUsers, icon: Users, color: 'blue' },
        { label: 'New (30 days)', value: overview.newUsersLast30Days, icon: UserPlus, color: 'green' },
        { label: 'Active (7 days)', value: overview.activeUsersLast7Days, icon: UserCheck, color: 'purple' },
        { label: 'Banned Users', value: overview.bannedUsers, icon: Ban, color: 'red' },
        { label: 'Total Chats', value: overview.totalChats, icon: MessageSquare, color: 'blue' },
        { label: 'Total Messages', value: overview.totalMessages, icon: MessagesSquare, color: 'green' },
        { label: 'Content Generated', value: overview.totalGeneratedContent, icon: PenLine, color: 'purple' },
        { label: 'Total Tokens Used', value: overview.totalTokensUsed.toLocaleString(), icon: Zap, color: 'orange' },
      ]
    : [];

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

      {isLoading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="card-md h-24 animate-pulse bg-gray-100 dark:bg-gray-800" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {statCards.map((stat) => (
            <div key={stat.label} className="card-md">
              <stat.icon className="w-6 h-6 mb-2 text-primary-600 dark:text-primary-400" strokeWidth={1.75} />
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</div>
            </div>
          ))}
        </div>
      )}

      {/* দ্রুত লিংক */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link href="/admin/users" className="card-md hover:shadow-md transition-shadow">
          <Users className="w-6 h-6 mb-2 text-primary-600 dark:text-primary-400" strokeWidth={1.75} />
          <h3 className="font-semibold mb-1">Manage Users</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">Ban/unban, search, and view</p>
        </Link>
        <Link href="/admin/analytics" className="card-md hover:shadow-md transition-shadow">
          <BarChart3 className="w-6 h-6 mb-2 text-primary-600 dark:text-primary-400" strokeWidth={1.75} />
          <h3 className="font-semibold mb-1">Detailed Analytics</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">Feature usage and trends</p>
        </Link>
        <Link href="/admin/subscriptions" className="card-md hover:shadow-md transition-shadow">
          <CreditCard className="w-6 h-6 mb-2 text-primary-600 dark:text-primary-400" strokeWidth={1.75} />
          <h3 className="font-semibold mb-1">Subscriptions</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">Change and manage plans</p>
        </Link>
      </div>
    </div>
  );
}
