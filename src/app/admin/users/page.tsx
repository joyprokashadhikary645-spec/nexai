// src/app/admin/users/page.tsx

'use client';

import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import Link from 'next/link';
import toast from 'react-hot-toast';
import Loading from '@/components/common/Loading';

const getToken = () => (typeof window !== 'undefined' ? localStorage.getItem('authToken') : null);

interface AdminUser {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: string;
  isVerified: boolean;
  isBanned: boolean;
  banReason?: string;
  createdAt: string;
  lastLoginAt?: string;
  subscriptions: { plan: string; status: string; tokensUsed: number; monthlyTokens: number }[];
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);

  const fetchUsers = useCallback(async (searchTerm: string = '') => {
    setIsLoading(true);
    try {
      const { data } = await axios.get('/api/admin/users', {
        params: { search: searchTerm, limit: 50 },
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      setUsers(data.data);
    } catch (error) {
      toast.error('Could not load users');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchUsers(search);
  };

  const toggleBan = async (user: AdminUser) => {
    const banning = !user.isBanned;
    let reason = '';

    if (banning) {
      reason = prompt('Enter ban reason:') || 'Policy violation';
    }

    setProcessingId(user.id);
    try {
      await axios.patch(
        `/api/admin/users/${user.id}/ban`,
        { banned: banning, reason },
        { headers: { Authorization: `Bearer ${getToken()}` } }
      );

      setUsers((prev) =>
        prev.map((u) => (u.id === user.id ? { ...u, isBanned: banning, banReason: reason } : u))
      );
      toast.success(banning ? 'User has been banned' : 'Ban has been lifted');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Operation failed');
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className="p-4 md:p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Manage Users</h1>

      {/* সার্চ */}
      <form onSubmit={handleSearch} className="flex gap-2 mb-6">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name or email..."
          className="input flex-1"
        />
        <button type="submit" className="btn btn-primary px-6">
          Search
        </button>
      </form>

      {isLoading ? (
        <Loading text="Loading..." />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left border-b border-gray-200 dark:border-gray-800">
                <th className="p-3">User</th>
                <th className="p-3">Plan</th>
                <th className="p-3">Status</th>
                <th className="p-3">Joined</th>
                <th className="p-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b border-gray-100 dark:border-gray-900">
                  <td className="p-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-gradient-to-br from-primary-600 to-secondary-600 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                        {user.name?.[0]?.toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <Link href={`/admin/users/${user.id}`} className="font-medium truncate block hover:text-primary-600 dark:hover:text-primary-400 hover:underline">
                          {user.name}
                        </Link>
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                          {user.email}
                        </p>
                      </div>
                      {user.role === 'admin' && (
                        <span className="badge badge-primary flex-shrink-0">Admin</span>
                      )}
                    </div>
                  </td>
                  <td className="p-3">
                    <span className="badge badge-primary capitalize">
                      {user.subscriptions[0]?.plan || 'free'}
                    </span>
                  </td>
                  <td className="p-3">
                    {user.isBanned ? (
                      <span className="badge badge-error">Banned</span>
                    ) : user.isVerified ? (
                      <span className="badge badge-success">Active</span>
                    ) : (
                      <span className="badge badge-warning">Unverified</span>
                    )}
                  </td>
                  <td className="p-3 text-gray-500 dark:text-gray-400">
                    {new Date(user.createdAt).toLocaleDateString('bn-BD')}
                  </td>
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/admin/users/${user.id}`}
                        className="text-xs px-3 py-1.5 rounded-lg font-medium bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                      >
                        View Activity
                      </Link>
                      {user.role !== 'admin' && (
                        <button
                          onClick={() => toggleBan(user)}
                          disabled={processingId === user.id}
                          className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors ${
                            user.isBanned
                              ? 'bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400'
                              : 'bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400'
                          }`}
                        >
                          {processingId === user.id ? '...' : user.isBanned ? 'Unban' : 'Ban'}
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {users.length === 0 && (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
              No users found
            </div>
          )}
        </div>
      )}
    </div>
  );
}
