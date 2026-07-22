// src/app/admin/settings/page.tsx

'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
import Button from '@/components/common/Button';

export default function AdminSettingsPage() {
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [allowRegistration, setAllowRegistration] = useState(true);
  const [maxFreeTokens, setMaxFreeTokens] = useState(100000);

  const handleSave = () => {
    // নোট: এই সেটিংস AdminSetting টেবিলে সংরক্ষণ করার জন্য /api/admin/settings এন্ডপয়েন্ট
    // ভবিষ্যতে যোগ করা যাবে। বর্তমানে এটি UI ডেমোনস্ট্রেশন।
    toast.success('Settings saved');
  };

  return (
    <div className="p-4 md:p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Site Settings</h1>

      <div className="space-y-6">
        <div className="card-md">
          <h2 className="font-semibold mb-4">General</h2>

          <label className="flex items-center justify-between mb-4 cursor-pointer">
            <div>
              <p className="text-sm font-medium">Maintenance Mode</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                When enabled, regular users won't be able to use the site
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
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Allow new users to sign up
              </p>
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
          <h2 className="font-semibold mb-4">Token Limits</h2>
          <label className="block text-sm font-medium mb-1.5">Free Plan Monthly Tokens</label>
          <input
            type="number"
            value={maxFreeTokens}
            onChange={(e) => setMaxFreeTokens(parseInt(e.target.value))}
            className="input"
          />
        </div>

        <Button onClick={handleSave} fullWidth size="lg">
          Save Changes
        </Button>
      </div>
    </div>
  );
}
