// src/app/(public)/faq/page.tsx

'use client';

import { useState } from 'react';

const FAQS = [
  {
    q: 'Is NexAI really free?',
    a: 'Yes! NexAI is completely free to use. The Free plan includes 100,000 tokens per month across all AI tools with no credit card required.',
  },
  {
    q: 'Do I need to enter payment details to sign up?',
    a: 'No. You can create an account and start using NexAI immediately with just your email — no credit card needed.',
  },
  {
    q: 'What AI tools are available?',
    a: 'NexAI includes AI Chat, Content Writer, Blog Generator, Email Generator, Social Media post generators, Code Generator, Language Translator, Grammar Checker, Document Summarizer, Resume Builder, and an Image Generator.',
  },
  {
    q: 'How many languages does the Translator support?',
    a: 'The Language Translator supports 25+ languages including Bengali, English, Hindi, Spanish, French, Arabic, Chinese, and many more.',
  },
  {
    q: 'Can I use NexAI on my phone?',
    a: 'Yes, NexAI is fully responsive and works smoothly on mobile, tablet, and desktop devices.',
  },
  {
    q: 'How is my data protected?',
    a: 'Your data is encrypted and stored securely. We use industry-standard authentication (JWT) and never share your personal information with third parties.',
  },
  {
    q: 'Can I upgrade to a paid plan later?',
    a: 'Yes, you can upgrade to Pro or Enterprise at any time from your dashboard settings for higher usage limits and priority support.',
  },
];

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="section">
      <div className="container max-w-3xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Frequently Asked Questions</h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            Everything you need to know about NexAI
          </p>
        </div>

        <div className="space-y-3">
          {FAQS.map((item, i) => (
            <div key={i} className="card-md">
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex items-center justify-between text-left font-medium"
              >
                <span>{item.q}</span>
                <span
                  className={`text-primary-600 transition-transform ${
                    openIndex === i ? 'rotate-180' : ''
                  }`}
                >
                  ▼
                </span>
              </button>
              {openIndex === i && (
                <p className="mt-3 text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                  {item.a}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
