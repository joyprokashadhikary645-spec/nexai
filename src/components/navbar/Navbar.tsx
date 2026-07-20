// src/components/navbar/Navbar.tsx

'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import UserMenu from './UserMenu';
import MobileMenu from './MobileMenu';

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const { user, isLoading } = useAuth();

  if (pathname?.startsWith('/dashboard') || pathname?.startsWith('/admin')) {
    return null;
  }

  const navItems = [
    { label: 'Home', href: '/' },
    { label: 'Features', href: '/features' },
    { label: 'Pricing', href: '/pricing' },
    { label: 'FAQ', href: '/faq' },
    { label: 'Contact', href: '/contact' },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800 shadow-sm">
      <div className="container flex items-center justify-between h-16 md:h-20">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 font-bold text-2xl text-primary-600 dark:text-primary-400"
        >
          <Image
            src="/logo.png"
            alt="NexAI logo"
            width={40}
            height={40}
            className="object-contain"
            priority
          />
          NexAI
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`text-sm font-medium transition-colors ${
                pathname === item.href
                  ? 'text-primary-600 dark:text-primary-400'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </div>

        {/* Right Side - Auth Buttons / User Menu */}
        <div className="flex items-center gap-4">
          {isLoading ? (
            <div className="w-8 h-8 bg-gray-200 dark:bg-gray-800 rounded-full animate-pulse" />
          ) : user ? (
            <UserMenu user={user} />
          ) : (
            <div className="hidden sm:flex items-center gap-3">
              <Link
                href="/login"
                className="text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
              >
                Log In
              </Link>
              <Link
                href="/register"
                className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:opacity-90 transition-opacity"
              >
                Sign Up
              </Link>
            </div>
          )}

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {mobileOpen && <MobileMenu items={navItems} user={user} />}
    </nav>
  );
};

export default Navbar;
