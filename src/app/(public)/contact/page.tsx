// src/app/(public)/contact/page.tsx

'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
import Button from '@/components/common/Button';
import Input from '@/components/common/Input';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // নোট: এই মুহূর্তে এটি শুধু UI ডেমো — একটি /api/contact এন্ডপয়েন্ট
    // পরে যোগ করে emailService দিয়ে বার্তা পাঠানো যাবে
    await new Promise((r) => setTimeout(r, 800));
    toast.success("Thanks! We'll get back to you soon.");
    setForm({ name: '', email: '', message: '' });
    setIsSubmitting(false);
  };

  return (
    <div className="section">
      <div className="container max-w-2xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Get in Touch</h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            Have a question or feedback? We&apos;d love to hear from you.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="card-lg space-y-4">
          <Input
            label="Your Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="John Doe"
            required
          />
          <Input
            label="Email Address"
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            placeholder="you@example.com"
            required
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              Message
            </label>
            <textarea
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              placeholder="How can we help?"
              rows={5}
              required
              className="input resize-none"
            />
          </div>
          <Button type="submit" isLoading={isSubmitting} fullWidth size="lg">
            Send Message
          </Button>
        </form>

        <div className="text-center mt-8 text-sm text-gray-500 dark:text-gray-400">
          Or email us directly at{' '}
          <a href="mailto:support@nexai.app" className="text-primary-600 dark:text-primary-400">
            support@nexai.app
          </a>
        </div>
      </div>
    </div>
  );
}
