// src/app/admin/super/system/page.tsx

'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import Button from '@/components/common/Button';
import Loading from '@/components/common/Loading';

const getToken = () => (typeof window !== 'undefined' ? localStorage.getItem('authToken') : null);
const authHeaders = () => ({ headers: { Authorization: `Bearer ${getToken()}` } });

export default function SystemControlPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [allowRegistration, setAllowRegistration] = useState(true);
  const [defaultMonthlyTokens, setDefaultMonthlyTokens] = useState(100000);

  useEffect(() => {
    axios
      .get('/api/admin/super/settings', authHeaders())
      .then(({ data }) => {
        const s = data.data;
        setMaintenanceMode(s.maintenanceMode === 'true');
        setAllowRegistration(s.allowRegistration !== 'false');
        setDefaultMonthlyTokens(parseInt(s.defaultMonthlyTokens) || 100000);
      })
      .catch(() => toast.error('Could not load settings'))
      .finally(() => setIsLoading(false));
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await axios.put(
        '/api/admin/super/settings',
        {
          maintenanceMode: String(maintenanceMode),
          allowRegistration: String(allowRegistration),
          defaultMonthlyTokens: String(defaultMonthlyTokens),
        },
        authHeaders()
      );
      toast.success('System settings saved');
    } catch {
      toast.error('Could not save settings');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) return <Loading text="Loading system settings..." />;

  return (
    <div className="p-4 md:p-6 max-w-2xl mx-auto">
      <div className="flex items-center gap-2 mb-6">
        <h1 className="text-2xl font-bold">System Control</h1>
      </div>

      <div className="space-y-6">
        <div className="card-md">
          <h2 className="font-semibold mb-4">Site Behavior</h2>

          <label className="flex items-center justify-between mb-4 cursor-pointer">
            <div>
              <p className="text-sm font-medium">Maintenance Mode</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                When enabled, regular users are blocked from using the site (admins unaffected)
              </p>
            </div>
            <input
              type="checkbox"
              checked={maintenanceMode}
              onChange={(e) => setMaintenanceMode(e.target.checked)}
              className="w-5 h-5"
            />
          </label>

          <label className="flex items-center justify-between cursor-pointer">
            <div>
              <p className="text-sm font-medium">New Registrations</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Allow new users to sign up</p>
            </div>
            <input
              type="checkbox"
              checked={allowRegistration}
              onChange={(e) => setAllowRegistration(e.target.checked)}
              className="w-5 h-5"
            />
          </label>
        </div>

        <div className="card-md">
          <h2 className="font-semibold mb-4">Default Token Limit</h2>
          <label className="block text-sm font-medium mb-1.5">Free Plan Monthly Tokens</label>
          <input
            type="number"
            value={defaultMonthlyTokens}
            onChange={(e) => setDefaultMonthlyTokens(parseInt(e.target.value) || 0)}
            className="input"
          />
        </div>

        <Button onClick={handleSave} isLoading={isSaving} fullWidth size="lg">
          Save System Settings
        </Button>

        <p className="text-xs text-gray-400 text-center">
          Note: API keys (Gemini/OpenRouter/HuggingFace) and the database URL live in your hosting
          provider's environment variables — for security, they can't be edited from this panel.
          Their configuration status is visible on the{' '}
          <a href="/admin/super" className="text-primary-600 dark:text-primary-400 hover:underline">
            Super Admin overview
          </a>{' '}
          page.
        </p>
      </div>
    </div>
  );
}
