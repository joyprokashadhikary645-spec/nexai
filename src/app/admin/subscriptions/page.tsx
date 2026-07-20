// src/app/admin/subscriptions/page.tsx

'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import Loading from '@/components/common/Loading';

const getToken = () => (typeof window !== 'undefined' ? localStorage.getItem('authToken') : null);

interface Subscription {
  id: string;
  plan: string;
  status: string;
  tokensUsed: number;
  monthlyTokens: number;
  user: { id: string; name: string; email: string };
}

export default function AdminSubscriptionsPage() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [planCounts, setPlanCounts] = useState<{ plan: string; count: number }[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      const { data } = await axios.get('/api/admin/subscriptions', {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      setSubscriptions(data.data);
      setPlanCounts(data.planCounts);
    } catch (error) {
      toast.error('Could not load data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handlePlanChange = async (subId: string, newPlan: string) => {
    setProcessingId(subId);
    try {
      await axios.patch(
        `/api/admin/subscriptions/${subId}`,
        { plan: newPlan },
        { headers: { Authorization: `Bearer ${getToken()}` } }
      );
      setSubscriptions((prev) =>
        prev.map((s) => (s.id === subId ? { ...s, plan: newPlan } : s))
      );
      toast.success('Plan updated');
    } catch (error) {
      toast.error('Update failed');
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className="p-4 md:p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Manage Subscriptions</h1>

      {/* প্ল্যান সামারি */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {['free', 'pro', 'enterprise'].map((plan) => {
          const count = planCounts.find((p) => p.plan === plan)?.count || 0;
          return (
            <div key={plan} className="card-md text-center">
              <p className="text-2xl font-bold">{count}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">{plan}</p>
            </div>
          );
        })}
      </div>

      {isLoading ? (
        <Loading text="Loading..." />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left border-b border-gray-200 dark:border-gray-800">
                <th className="p-3">User</th>
                <th className="p-3">Token Usage</th>
                <th className="p-3">Plan</th>
              </tr>
            </thead>
            <tbody>
              {subscriptions.map((sub) => (
                <tr key={sub.id} className="border-b border-gray-100 dark:border-gray-900">
                  <td className="p-3">
                    <p className="font-medium">{sub.user.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{sub.user.email}</p>
                  </td>
                  <td className="p-3">
                    <div className="w-32">
                      <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                        {sub.tokensUsed.toLocaleString()} / {sub.monthlyTokens.toLocaleString()}
                      </div>
                      <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-1.5">
                        <div
                          className="bg-primary-600 h-1.5 rounded-full"
                          style={{
                            width: `${Math.min((sub.tokensUsed / sub.monthlyTokens) * 100, 100)}%`,
                          }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="p-3">
                    <select
                      value={sub.plan}
                      onChange={(e) => handlePlanChange(sub.id, e.target.value)}
                      disabled={processingId === sub.id}
                      className="input py-1.5 text-sm w-32"
                    >
                      <option value="free">Free</option>
                      <option value="pro">Pro</option>
                      <option value="enterprise">Enterprise</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
