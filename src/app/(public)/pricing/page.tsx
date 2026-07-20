// src/app/(public)/pricing/page.tsx

import Link from 'next/link';
import { Check } from 'lucide-react';
import { PRICING_PLANS } from '@/lib/constants';

export default function PricingPage() {
  return (
    <div className="section">
      <div className="container">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Simple, Transparent Pricing</h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            Start free. No credit card required.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {PRICING_PLANS.map((plan) => (
            <div
              key={plan.id}
              className={`card-lg relative ${
                plan.popular ? 'border-2 border-primary-600 shadow-lg' : ''
              }`}
            >
              {plan.popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-primary-600 to-secondary-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
                  Most Popular
                </span>
              )}
              <h3 className="text-xl font-bold mb-1">{plan.name}</h3>
              <div className="mb-4">
                <span className="text-3xl font-bold">${plan.price}</span>
                <span className="text-gray-500 dark:text-gray-400 text-sm">{plan.period}</span>
              </div>
              <ul className="space-y-2 mb-6">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm">
                    <Check className="w-4 h-4 mt-0.5 text-green-600 flex-shrink-0" strokeWidth={2} />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <Link
                href="/register"
                className={`block text-center py-2.5 rounded-2xl font-semibold transition-opacity ${
                  plan.popular
                    ? 'bg-gradient-to-r from-primary-600 to-secondary-600 text-white hover:opacity-90'
                    : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
