// src/app/admin/super/admins/page.tsx

'use client';

import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '@/hooks/useAuth';
import Loading from '@/components/common/Loading';
import Input from '@/components/common/Input';

const getToken = () => (typeof window !== 'undefined' ? localStorage.getItem('authToken') : null);
const authHeaders = () => ({ headers: { Authorization: `Bearer ${getToken()}` } });

interface AdminUser {
  id: string;
  name: string;
  email: string;
  avatar?: string | null;
  role: string;
  isVerified?: boolean;
  createdAt?: string;
}

export default function ManageAdminsPage() {
  const { user: currentUser } = useAuth();
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [search, setSearch] = useState('');
  const [searchResults, setSearchResults] = useState<AdminUser[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);

  const fetchAdmins = useCallback(async () => {
    try {
      const { data } = await axios.get('/api/admin/super/admins', authHeaders());
      setAdmins(data.data);
    } catch {
      toast.error('Could not load admins');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAdmins();
  }, [fetchAdmins]);

  // ২৫০ms ডিবাউন্স করে ইউজার সার্চ
  useEffect(() => {
    if (search.trim().length < 2) {
      setSearchResults([]);
      return;
    }
    setIsSearching(true);
    const timeout = setTimeout(async () => {
      try {
        const { data } = await axios.get(
          `/api/admin/super/search-users?q=${encodeURIComponent(search.trim())}`,
          authHeaders()
        );
        setSearchResults(data.data);
      } catch {
        // ignore
      } finally {
        setIsSearching(false);
      }
    }, 250);
    return () => clearTimeout(timeout);
  }, [search]);

  const changeRole = async (id: string, role: string, confirmMessage: string) => {
    if (!confirm(confirmMessage)) return;
    setBusyId(id);
    try {
      await axios.patch(`/api/admin/super/admins/${id}`, { role }, authHeaders());
      toast.success('Role updated');
      setSearch('');
      setSearchResults([]);
      await fetchAdmins();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Could not update role');
    } finally {
      setBusyId(null);
    }
  };

  if (isLoading) return <Loading text="Loading admins..." />;

  return (
    <div className="p-4 md:p-6 max-w-3xl mx-auto">
      <div className="flex items-center gap-2 mb-6">
        <h1 className="text-2xl font-bold">Manage Admins</h1>
      </div>

      {/* নতুন Admin যোগ করা */}
      <div className="card-md mb-6">
        <h2 className="font-semibold mb-3">Promote a User to Admin</h2>
        <Input
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        {isSearching && <p className="text-xs text-gray-400 mt-2">Searching...</p>}
        {searchResults.length > 0 && (
          <div className="mt-3 space-y-2">
            {searchResults.map((u) => (
              <div
                key={u.id}
                className="flex items-center justify-between p-2 border border-gray-200 dark:border-gray-800 rounded-lg"
              >
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate">{u.name}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{u.email}</p>
                </div>
                <button
                  onClick={() => changeRole(u.id, 'admin', `Give ${u.name} (${u.email}) Admin panel access?`)}
                  disabled={busyId === u.id}
                  className="text-sm text-primary-600 dark:text-primary-400 font-medium hover:underline disabled:opacity-50 flex-shrink-0 ml-2"
                >
                  Make Admin
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* বর্তমান admin ও super_admin তালিকা */}
      <div className="card-md">
        <h2 className="font-semibold mb-3">Current Admins ({admins.length})</h2>
        <div className="space-y-2">
          {admins.map((admin) => {
            const isMe = admin.id === currentUser?.id;
            return (
              <div
                key={admin.id}
                className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-800 rounded-lg"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary-600 to-secondary-600 flex items-center justify-center text-white text-sm font-bold overflow-hidden flex-shrink-0">
                    {admin.avatar ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={admin.avatar} alt={admin.name} className="w-full h-full object-cover" />
                    ) : (
                      admin.name?.[0]?.toUpperCase()
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">
                      {admin.name} {isMe && <span className="text-xs text-gray-400">(you)</span>}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{admin.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <span
                    className={`badge ${
                      admin.role === 'super_admin' ? 'badge-primary' : 'badge-success'
                    }`}
                  >
                    {admin.role === 'super_admin' ? 'Super Admin' : 'Admin'}
                  </span>

                  {!isMe && admin.role === 'admin' && (
                    <button
                      onClick={() => changeRole(admin.id, 'super_admin', `Promote ${admin.name} to Super Admin? They will get FULL system control, including managing other admins.`)}
                      disabled={busyId === admin.id}
                      title="Promote to Super Admin"
                      className="text-xs text-purple-600 hover:underline disabled:opacity-50"
                    >
                      Promote
                    </button>
                  )}
                  {!isMe && admin.role === 'super_admin' && (
                    <button
                      onClick={() => changeRole(admin.id, 'admin', `Demote ${admin.name} from Super Admin to Admin?`)}
                      disabled={busyId === admin.id}
                      title="Demote to Admin"
                      className="text-xs text-gray-500 hover:underline disabled:opacity-50"
                    >
                      Demote
                    </button>
                  )}
                  {!isMe && (
                    <button
                      onClick={() => changeRole(admin.id, 'user', `Remove admin access from ${admin.name}? They will become a regular user.`)}
                      disabled={busyId === admin.id}
                      title="Remove admin access"
                      className="text-xs text-red-500 hover:underline disabled:opacity-50"
                    >
                      Remove
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
