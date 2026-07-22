// src/app/page.tsx

import Link from 'next/link';
import Image from 'next/image';
import { AI_TOOLS } from '@/lib/constants';
import { TOOL_ICONS } from '@/lib/icons';
import { MessageSquare, Gift, Zap, ShieldCheck, Languages, Smartphone, MousePointerClick } from 'lucide-react';

export default function Home() {
  return (
    <>
      {/* Hero Section */}
      <section className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 pt-20 pb-12">
        <div className="container flex flex-col items-center justify-center min-h-screen">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-block mb-6">
              <span className="badge badge-primary">
                100% Free AI Platform
              </span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              <span className="text-gradient">Power Up With AI</span>
            </h1>

            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8">
              A powerful AI platform that can chat, write, code, and much more.
              Completely free. No credit card required.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
              <Link
                href="/register"
                className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white px-8 py-4 rounded-2xl font-semibold hover:opacity-90 transition-opacity shadow-lg shadow-primary-600/20"
              >
                Get Started Free
              </Link>
              <Link
                href="/features"
                className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-8 py-4 rounded-2xl font-semibold hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors border border-gray-200 dark:border-gray-700"
              >
                View Features
              </Link>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-12">
              <div>
                <div className="text-3xl font-bold text-primary-600">25+</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Languages</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-secondary-600">10+</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">AI Tools</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-accent-600">∞</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Possibilities</div>
              </div>
            </div>

            <div className="bg-gradient-to-b from-primary-100 to-transparent dark:from-primary-900/20 dark:to-transparent rounded-2xl p-8 border border-primary-200 dark:border-primary-800">
              <div className="relative bg-gray-200 dark:bg-gray-800 rounded-xl aspect-video overflow-hidden">
                <Image
                  src="/hero-image.png"
                  alt="NexAI platform screenshot"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="section bg-white dark:bg-gray-900">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Powerful AI Tools</h2>
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              AI solutions for all your needs
            </p>
          </div>

          <div className="grid-auto">
            {AI_TOOLS.slice(0, 6).map((tool) => {
              const Icon = TOOL_ICONS[tool.id] || MessageSquare;
              return (
                <Link key={tool.id} href={tool.path} className="card-md hover:shadow-lg transition-shadow">
                  <Icon className="w-8 h-8 mb-3 text-primary-600 dark:text-primary-400" strokeWidth={1.5} />
                  <h3 className="text-xl font-semibold mb-2">{tool.name}</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">{tool.description}</p>
                  <div className="mt-4 text-primary-600 dark:text-primary-400 text-sm font-medium">
                    Learn more →
                  </div>
                </Link>
              );
            })}
          </div>

          <div className="text-center mt-12">
            <Link
              href="/features"
              className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white px-6 py-3 rounded-2xl font-semibold hover:opacity-90 transition-opacity"
            >
              View All Tools
            </Link>
          </div>
        </div>
      </section>

      {/* Why Section */}
      <section className="section bg-gray-50 dark:bg-gray-800">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Why NexAI?</h2>
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              Better than other platforms
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: Gift, title: '100% Free', desc: 'No hidden costs. Use it free, forever.' },
              { icon: Zap, title: 'Lightning Fast', desc: 'Built on the latest AI models for fast results.' },
              { icon: ShieldCheck, title: 'Fully Secure', desc: 'Your data is encrypted and protected.' },
              { icon: Languages, title: '25+ Languages', desc: 'Work in any language, anywhere in the world.' },
              { icon: Smartphone, title: 'Any Device', desc: 'Works seamlessly on mobile, tablet, or desktop.' },
              { icon: MousePointerClick, title: 'Easy to Use', desc: 'A beautiful, intuitive interface.' },
            ].map((item, i) => (
              <div key={i} className="card-md text-center">
                <item.icon className="w-9 h-9 mb-4 mx-auto text-primary-600 dark:text-primary-400" strokeWidth={1.5} />
                <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section bg-gradient-to-r from-primary-600 to-secondary-600 text-white">
        <div className="container text-center">
          <h2 className="text-4xl font-bold mb-6">Get Started Today</h2>
          <p className="text-lg mb-8 text-white/80">
            Thousands of users are already using NexAI
          </p>
          <Link
            href="/register"
            className="bg-white text-primary-600 px-8 py-4 rounded-2xl font-semibold hover:bg-gray-50 transition-colors inline-block"
          >
            Sign Up Free
          </Link>
        </div>
      </section>
    </>
  );
}
