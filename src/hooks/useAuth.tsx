// src/hooks/useAuth.ts

'use client';

import { useState, useEffect, useCallback, useContext, createContext } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: string;
  isVerified: boolean;
  language: string;
  theme: string;
  twoFactorEnabled?: boolean;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ requiresTwoFactor?: boolean; tempToken?: string }>;
  verifyTwoFactor: (tempToken: string, code: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  logoutAllDevices: () => Promise<void>;
  googleLogin: (code: string) => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// স্টোরেজ থেকে টোকেন পড়ুন
const getStoredToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('authToken');
};

// টোকেন স্টোরেজে রাখুন
const setStoredToken = (token: string) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem('authToken', token);
};

// স্টোরেজ থেকে টোকেন মুছুন
const removeStoredToken = () => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('authToken');
  localStorage.removeItem('user');
};

// API ইনস্ট্যান্স তৈরি করুন (টোকেন সহ)
const createApiClient = (token?: string) => {
  const apiClient = axios.create({
    baseURL: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // Request interceptor - হেডারে টোকেন যোগ করুন
  apiClient.interceptors.request.use((config) => {
    const authToken = token || getStoredToken();
    if (authToken) {
      config.headers.Authorization = `Bearer ${authToken}`;
    }
    return config;
  });

  // Response interceptor - ত্রুটি হ্যান্ডেল করুন
  apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        removeStoredToken();
        window.location.href = '/login';
      }
      return Promise.reject(error);
    }
  );

  return apiClient;
};

// useAuth Hook
export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // ব্যবহারকারীর তথ্য লোড করুন
  useEffect(() => {
    const loadUser = async () => {
      try {
        const token = getStoredToken();
        if (!token) {
          setIsLoading(false);
          return;
        }

        const apiClient = createApiClient(token);
        const { data } = await apiClient.get('/api/auth/me');
        setUser(data.user);
      } catch (error) {
        console.error('Failed to load user:', error);
        removeStoredToken();
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, []);

  // লগইন ফাংশন
  const login = useCallback(async (email: string, password: string) => {
    try {
      const apiClient = createApiClient();
      const { data } = await apiClient.post('/api/auth/login', {
        email,
        password,
      });

      // ২FA চালু থাকলে সরাসরি লগইন হবে না — কলারকে জানিয়ে দিন যে কোড লাগবে
      if (data.requiresTwoFactor) {
        return { requiresTwoFactor: true, tempToken: data.tempToken };
      }

      setStoredToken(data.token);
      setUser(data.user);
      localStorage.setItem('user', JSON.stringify(data.user));

      toast.success('সফলভাবে লগইন হয়েছেন!');
      router.push('/dashboard');
      return {};
    } catch (error: any) {
      const message = error.response?.data?.message || 'লগইন ব্যর্থ';
      toast.error(message);
      throw error;
    }
  }, [router]);

  // ২FA কোড ভেরিফাই করে লগইন সম্পূর্ণ করুন
  const verifyTwoFactor = useCallback(async (tempToken: string, code: string) => {
    try {
      const apiClient = createApiClient();
      const { data } = await apiClient.post('/api/auth/2fa/login-verify', { tempToken, code });

      setStoredToken(data.token);
      setUser(data.user);
      localStorage.setItem('user', JSON.stringify(data.user));

      toast.success('সফলভাবে লগইন হয়েছেন!');
      router.push('/dashboard');
    } catch (error: any) {
      const message = error.response?.data?.message || 'কোড সঠিক নয়';
      toast.error(message);
      throw error;
    }
  }, [router]);

  // সব ডিভাইস থেকে লগ-আউট করুন (এই ডিভাইসটা ছাড়া)
  const logoutAllDevices = useCallback(async () => {
    try {
      const apiClient = createApiClient();
      const { data } = await apiClient.post('/api/auth/logout-all');
      setStoredToken(data.token); // এই ডিভাইসের জন্য নতুন বৈধ টোকেন
      toast.success('অন্য সব ডিভাইস থেকে লগ-আউট হয়ে গেছে');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'কাজটি করা যায়নি');
      throw error;
    }
  }, []);

  // নিবন্ধন ফাংশন
  const register = useCallback(async (name: string, email: string, password: string) => {
    try {
      const apiClient = createApiClient();
      const { data } = await apiClient.post('/api/auth/register', {
        name,
        email,
        password,
      });

      setStoredToken(data.token);
      setUser(data.user);
      localStorage.setItem('user', JSON.stringify(data.user));

      toast.success('নিবন্ধন সফল! আপনার ইমেইল যাচাই করুন।');
      router.push('/dashboard');
    } catch (error: any) {
      const message = error.response?.data?.message || 'নিবন্ধন ব্যর্থ';
      toast.error(message);
      throw error;
    }
  }, [router]);

  // লগআউট ফাংশন
  const logout = useCallback(async () => {
    try {
      const apiClient = createApiClient();
      await apiClient.post('/api/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      removeStoredToken();
      setUser(null);
      router.push('/');
    }
  }, [router]);

  // Google লগইন ফাংশন
  const googleLogin = useCallback(async (code: string) => {
    try {
      const apiClient = createApiClient();
      const { data } = await apiClient.post('/api/auth/google', { code });

      setStoredToken(data.token);
      setUser(data.user);
      localStorage.setItem('user', JSON.stringify(data.user));

      toast.success('Google এর মাধ্যমে লগইন সফল!');
      router.push('/dashboard');
    } catch (error: any) {
      const message = error.response?.data?.message || 'Google লগইন ব্যর্থ';
      toast.error(message);
      throw error;
    }
  }, [router]);

  // প্রোফাইল আপডেট ফাংশন
  const updateProfile = useCallback(async (data: Partial<User>) => {
    try {
      const apiClient = createApiClient();
      const { data: updatedUser } = await apiClient.put('/api/auth/profile', data);

      setUser(updatedUser.user);
      localStorage.setItem('user', JSON.stringify(updatedUser.user));

      toast.success('প্রোফাইল আপডেট সফল!');
    } catch (error: any) {
      const message = error.response?.data?.message || 'আপডেট ব্যর্থ';
      toast.error(message);
      throw error;
    }
  }, []);

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    verifyTwoFactor,
    register,
    logout,
    logoutAllDevices,
    googleLogin,
    updateProfile,
  };
};

// Auth Context Provider
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const auth = useAuth();

  return (
    <AuthContext.Provider value={auth}>
      {children}
    </AuthContext.Provider>
  );
};

// useAuth হুক ব্যবহার করে সহজে অ্যাক্সেস করুন
export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within AuthProvider');
  }
  return context;
};
