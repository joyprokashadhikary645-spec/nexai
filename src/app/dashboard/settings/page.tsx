// src/app/dashboard/settings/page.tsx

'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/hooks/useTheme';
import { useLanguage } from '@/hooks/useLanguage';
import { SUPPORTED_LANGUAGES } from '@/lib/constants';
import Button from '@/components/common/Button';
import Input from '@/components/common/Input';
import toast from 'react-hot-toast';
import { Sun, Moon } from 'lucide-react';

const getToken = () => (typeof window !== 'undefined' ? localStorage.getItem('authToken') : null);
const authHeaders = () => ({ headers: { Authorization: `Bearer ${getToken()}` } });

export default function SettingsPage() {
  const { user, updateProfile, logoutAllDevices, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const { t, rawLanguage, setLanguage: setUiLanguage } = useLanguage();

  const [language, setLanguage] = useState(rawLanguage);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isLanguageSaving, setIsLanguageSaving] = useState(false);

  // ---- Danger Zone: Delete Account ----
  const [showDeleteForm, setShowDeleteForm] = useState(false);
  const [deletePassword, setDeletePassword] = useState('');
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteAccount = async () => {
    if (deleteConfirmText !== 'DELETE') {
      toast.error('Type DELETE to confirm');
      return;
    }
    setIsDeleting(true);
    try {
      await axios.post('/api/auth/delete-account', { password: deletePassword }, authHeaders());
      toast.success('Your account has been deleted');
      await logout();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Could not delete account');
    } finally {
      setIsDeleting(false);
    }
  };

  // ---- Security: 2FA ----
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [manualSecret, setManualSecret] = useState<string | null>(null);
  const [setupCode, setSetupCode] = useState('');
  const [disablePassword, setDisablePassword] = useState('');
  const [showDisableForm, setShowDisableForm] = useState(false);
  const [is2FABusy, setIs2FABusy] = useState(false);
  const [isLoggingOutAll, setIsLoggingOutAll] = useState(false);

  useEffect(() => {
    if (user) {
      setLanguage(user.language || 'en');
      setEmailNotifications((user as any).emailNotifications ?? true);
      setTwoFactorEnabled(!!(user as any).twoFactorEnabled);
    }
  }, [user]);

  const startTwoFactorSetup = async () => {
    setIs2FABusy(true);
    try {
      const { data } = await axios.post('/api/auth/2fa/setup', {}, authHeaders());
      setQrCode(data.data.qrCodeDataUrl);
      setManualSecret(data.data.secret);
    } catch {
      toast.error('Could not start 2FA setup');
    } finally {
      setIs2FABusy(false);
    }
  };

  const confirmTwoFactorSetup = async () => {
    if (setupCode.length !== 6) return;
    setIs2FABusy(true);
    try {
      await axios.post('/api/auth/2fa/enable', { code: setupCode }, authHeaders());
      toast.success('2FA enabled — your account is now much more secure');
      setTwoFactorEnabled(true);
      setQrCode(null);
      setManualSecret(null);
      setSetupCode('');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Invalid code');
    } finally {
      setIs2FABusy(false);
    }
  };

  const disableTwoFactor = async () => {
    setIs2FABusy(true);
    try {
      await axios.post('/api/auth/2fa/disable', { password: disablePassword }, authHeaders());
      toast.success('2FA disabled');
      setTwoFactorEnabled(false);
      setShowDisableForm(false);
      setDisablePassword('');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Incorrect password');
    } finally {
      setIs2FABusy(false);
    }
  };

  const handleLogoutAll = async () => {
    if (!confirm('This will log you out of every other device/browser. Continue?')) return;
    setIsLoggingOutAll(true);
    try {
      await logoutAllDevices();
    } finally {
      setIsLoggingOutAll(false);
    }
  };

  // ভাষা বদলালেই সাথে সাথে পুরো UI-তে প্রয়োগ হবে এবং প্রোফাইলে সেভ হবে —
  // আলাদা করে "Save Changes" চাপতে হয় না।
  const handleLanguageChange = async (newLang: string) => {
    setLanguage(newLang);
    setUiLanguage(newLang); // তাৎক্ষণিক UI আপডেট
    setIsLanguageSaving(true);
    try {
      await updateProfile({ language: newLang } as any);
    } catch {
      // updateProfile নিজেই এরর টোস্ট দেখায়
    } finally {
      setIsLanguageSaving(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateProfile({ emailNotifications } as any);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="p-4 md:p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">{t('settingsTitle')}</h1>

      <div className="space-y-6">
        <div className="card-md">
          <h2 className="font-semibold mb-4">{t('appearance')}</h2>
          <div className="flex gap-3">
            <button
              onClick={() => setTheme('light')}
              className={`flex-1 p-4 rounded-xl border-2 text-center transition-colors ${
                theme === 'light' ? 'border-primary-600 bg-primary-50 dark:bg-primary-900/20' : 'border-gray-200 dark:border-gray-700'
              }`}
            >
              <Sun className="w-6 h-6 mb-2 mx-auto text-amber-500" strokeWidth={1.75} />
              <div className="text-sm font-medium">{t('lightMode')}</div>
            </button>
            <button
              onClick={() => setTheme('dark')}
              className={`flex-1 p-4 rounded-xl border-2 text-center transition-colors ${
                theme === 'dark' ? 'border-primary-600 bg-primary-50 dark:bg-primary-900/20' : 'border-gray-200 dark:border-gray-700'
              }`}
            >
              <Moon className="w-6 h-6 mb-2 mx-auto text-indigo-500" strokeWidth={1.75} />
              <div className="text-sm font-medium">{t('darkMode')}</div>
            </button>
          </div>
        </div>

        <div className="card-md">
          <h2 className="font-semibold mb-4">{t('language')}</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
            {t('languageDesc')}
          </p>
          <select
            value={language}
            onChange={(e) => handleLanguageChange(e.target.value)}
            disabled={isLanguageSaving}
            className="input"
          >
            {Object.entries(SUPPORTED_LANGUAGES).map(([code, lang]) => (
              <option key={code} value={code}>{lang.flag} {lang.name}</option>
            ))}
          </select>
          <p className="text-xs text-gray-400 mt-2">
            🇬🇧 English ও 🇧🇩 বাংলা-তে পুরো ইন্টারফেস অনুবাদ হয়ে যায়। অন্য ভাষা বাছাই করলে
            AI-এর আউটপুট সেই ভাষায় আসবে, তবে মেনু/বাটনের মতো ইন্টারফেস টেক্সট আপাতত ইংরেজিতে থাকবে।
          </p>
        </div>

        <div className="card-md">
          <h2 className="font-semibold mb-4">{t('notifications')}</h2>
          <label className="flex items-center justify-between cursor-pointer">
            <span className="text-sm">{t('emailNotifications')}</span>
            <input
              type="checkbox"
              checked={emailNotifications}
              onChange={(e) => setEmailNotifications(e.target.checked)}
              className="w-5 h-5"
            />
          </label>
        </div>

        <div className="card-md">
          <h2 className="font-semibold mb-4">Security</h2>

          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm font-medium">Two-Factor Authentication (2FA)</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Require a code from an authenticator app when logging in
              </p>
            </div>
            <span className={`badge ${twoFactorEnabled ? 'badge-success' : 'badge-error'}`}>
              {twoFactorEnabled ? 'Enabled' : 'Disabled'}
            </span>
          </div>

          {!twoFactorEnabled && !qrCode && (
            <Button onClick={startTwoFactorSetup} isLoading={is2FABusy} size="sm">
              Enable 2FA
            </Button>
          )}

          {qrCode && (
            <div className="border border-gray-200 dark:border-gray-800 rounded-xl p-4 mb-2">
              <p className="text-sm mb-3">
                Scan this QR code with Google Authenticator, Authy, or any TOTP app:
              </p>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={qrCode} alt="2FA QR Code" className="w-40 h-40 mx-auto mb-3" />
              {manualSecret && (
                <p className="text-xs text-center text-gray-400 mb-3 break-all">
                  Or enter manually: <span className="font-mono">{manualSecret}</span>
                </p>
              )}
              <Input
                placeholder="Enter 6-digit code"
                inputMode="numeric"
                maxLength={6}
                value={setupCode}
                onChange={(e) => setSetupCode(e.target.value.replace(/\D/g, ''))}
                className="text-center tracking-[0.4em] mb-3"
              />
              <div className="flex gap-2">
                <Button onClick={confirmTwoFactorSetup} isLoading={is2FABusy} size="sm" disabled={setupCode.length !== 6}>
                  Confirm & Enable
                </Button>
                <Button variant="secondary" size="sm" onClick={() => { setQrCode(null); setManualSecret(null); }}>
                  Cancel
                </Button>
              </div>
            </div>
          )}

          {twoFactorEnabled && !showDisableForm && (
            <Button variant="secondary" size="sm" onClick={() => setShowDisableForm(true)}>
              Disable 2FA
            </Button>
          )}
          {twoFactorEnabled && showDisableForm && (
            <div className="flex flex-col gap-2 max-w-xs">
              <Input
                type="password"
                placeholder="Confirm your password"
                value={disablePassword}
                onChange={(e) => setDisablePassword(e.target.value)}
              />
              <div className="flex gap-2">
                <Button onClick={disableTwoFactor} isLoading={is2FABusy} size="sm">
                  Confirm Disable
                </Button>
                <Button variant="secondary" size="sm" onClick={() => setShowDisableForm(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          )}

          <hr className="my-4 border-gray-200 dark:border-gray-800" />

          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Active Sessions</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Log out of every other device/browser instantly
              </p>
            </div>
            <Button variant="secondary" size="sm" onClick={handleLogoutAll} isLoading={isLoggingOutAll}>
              Log out all devices
            </Button>
          </div>
        </div>

        <div className="card-md">
          <h2 className="font-semibold mb-4">{t('subscription')}</h2>
          <div className="flex items-center justify-between p-3 bg-primary-50 dark:bg-primary-900/20 rounded-xl">
            <div>
              <p className="font-medium text-primary-700 dark:text-primary-400">{t('freePlan')}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">100,000 {t('tokensPerMonth')}</p>
            </div>
            <span className="badge badge-primary">{t('active')}</span>
          </div>
        </div>

        <div className="card-md border-2 border-red-200 dark:border-red-900/50">
          <h2 className="font-semibold mb-1 text-red-600 dark:text-red-400">Danger Zone</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            Permanently delete your account and all associated data (chats, generated content,
            documents). This cannot be undone.
          </p>

          {!showDeleteForm ? (
            <Button variant="danger" size="sm" onClick={() => setShowDeleteForm(true)}>
              Delete My Account
            </Button>
          ) : (
            <div className="space-y-3 max-w-sm">
              <div>
                <label className="block text-sm font-medium mb-1.5">Confirm your password</label>
                <Input
                  type="password"
                  value={deletePassword}
                  onChange={(e) => setDeletePassword(e.target.value)}
                  placeholder="••••••••"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">
                  Type <span className="font-mono font-bold">DELETE</span> to confirm
                </label>
                <Input
                  value={deleteConfirmText}
                  onChange={(e) => setDeleteConfirmText(e.target.value)}
                  placeholder="DELETE"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  variant="danger"
                  size="sm"
                  onClick={handleDeleteAccount}
                  isLoading={isDeleting}
                  disabled={deleteConfirmText !== 'DELETE' || !deletePassword}
                >
                  Permanently Delete
                </Button>
                <Button variant="secondary" size="sm" onClick={() => setShowDeleteForm(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </div>

        <Button onClick={handleSave} isLoading={isSaving} fullWidth size="lg">
          {t('saveChanges')}
        </Button>
      </div>
    </div>
  );
}
