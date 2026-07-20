// src/app/dashboard/profile/page.tsx

'use client';

import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/hooks/useLanguage';
import Button from '@/components/common/Button';
import Input from '@/components/common/Input';
import toast from 'react-hot-toast';

const MAX_AVATAR_SIZE = 3 * 1024 * 1024; // ৩ এমবি (আপলোডের আগের সাইজ)
const AVATAR_DIMENSION = 256; // রিসাইজ করে ছোট বানানো হবে, যাতে ডেটাবেসে হালকা থাকে

export default function ProfilePage() {
  const { user, updateProfile } = useAuth();
  const { t } = useLanguage();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isAvatarUploading, setIsAvatarUploading] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setBio((user as any).bio || '');
    }
  }, [user]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateProfile({ name, bio } as any);
      setIsEditing(false);
    } finally {
      setIsSaving(false);
    }
  };

  // ছবি নির্বাচন করলে ক্যানভাসে রিসাইজ করে base64 বানিয়ে সরাসরি প্রোফাইলে সেভ করা হয়
  const handleAvatarSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = ''; // একই ফাইল আবার সিলেক্ট করলেও যেন কাজ করে
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error(t('photoInvalidType'));
      return;
    }
    if (file.size > MAX_AVATAR_SIZE) {
      toast.error(t('photoTooLarge'));
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = async () => {
        const canvas = document.createElement('canvas');
        canvas.width = AVATAR_DIMENSION;
        canvas.height = AVATAR_DIMENSION;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // ছবিকে সেন্টার-ক্রপ করে বর্গাকার (square) বানানো
        const side = Math.min(img.width, img.height);
        const sx = (img.width - side) / 2;
        const sy = (img.height - side) / 2;
        ctx.drawImage(img, sx, sy, side, side, 0, 0, AVATAR_DIMENSION, AVATAR_DIMENSION);

        const dataUrl = canvas.toDataURL('image/jpeg', 0.85);

        setIsAvatarUploading(true);
        try {
          await updateProfile({ avatar: dataUrl } as any);
          toast.success(t('photoUpdated'));
        } finally {
          setIsAvatarUploading(false);
        }
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="p-4 md:p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">{t('profileTitle')}</h1>

      <div className="card-lg">
        <div className="flex items-center gap-4 mb-6">
          <div className="relative">
            <div className="w-20 h-20 bg-gradient-to-br from-primary-600 to-secondary-600 rounded-full flex items-center justify-center text-white font-bold text-2xl overflow-hidden">
              {user?.avatar ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={user.avatar} alt={user?.name || 'User'} className="w-full h-full object-cover" />
              ) : (
                user?.name?.[0]?.toUpperCase() || 'U'
              )}
            </div>

            {/* ছবি পরিবর্তনের বাটন */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isAvatarUploading}
              title={t('changePhoto')}
              className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-primary-600 hover:bg-primary-700 text-white flex items-center justify-center shadow-md border-2 border-white dark:border-gray-900 transition-colors disabled:opacity-60"
            >
              {isAvatarUploading ? (
                <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                </svg>
              ) : (
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              )}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleAvatarSelect}
              className="hidden"
            />
          </div>
          <div>
            <h2 className="text-xl font-bold">{user?.name}</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">{user?.email}</p>
            {user?.isVerified && <span className="badge badge-success mt-1">Verified</span>}
          </div>
        </div>

        {isEditing ? (
          <div className="space-y-4">
            <Input label={t('fullName')} value={name} onChange={(e) => setName(e.target.value)} />
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">{t('bio')}</label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={3}
                maxLength={200}
                className="input resize-none"
                placeholder={t('bioPlaceholder')}
              />
              <p className="text-xs text-gray-400 mt-1">{bio.length}/200</p>
            </div>
            <div className="flex gap-3">
              <Button onClick={handleSave} isLoading={isSaving}>{t('saveChanges')}</Button>
              <Button variant="secondary" onClick={() => setIsEditing(false)}>{t('cancel')}</Button>
            </div>
          </div>
        ) : (
          <div>
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">{t('bio')}</h3>
              <p className="text-gray-700 dark:text-gray-300">
                {bio || t('noBio')}
              </p>
            </div>
            <Button onClick={() => setIsEditing(true)}>{t('editProfile')}</Button>
          </div>
        )}
      </div>

      <div className="card-md mt-6">
        <h3 className="font-semibold mb-3">{t('accountInfo')}</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-500 dark:text-gray-400">{t('email')}</span>
            <span>{user?.email}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500 dark:text-gray-400">{t('role')}</span>
            <span className="capitalize">{user?.role}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
