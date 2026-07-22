// src/app/(public)/terms/page.tsx

export default function TermsPage() {
  return (
    <div className="section">
      <div className="container max-w-3xl">
        <h1 className="text-4xl font-bold mb-6">Terms of Service</h1>
        <div className="prose dark:prose-invert max-w-none space-y-4 text-gray-600 dark:text-gray-400 leading-relaxed">
          <p>Last updated: 2026</p>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Acceptance of Terms</h2>
          <p>
            By using NexAI, you agree to these Terms of Service. If you do not agree, please do
            not use the platform.
          </p>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Use of Service</h2>
          <p>
            NexAI provides AI-powered tools for content generation, chat, and productivity. You
            agree to use these tools responsibly and not for generating harmful, illegal, or
            abusive content.
          </p>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Account Responsibility</h2>
          <p>
            You are responsible for maintaining the confidentiality of your account credentials
            and for all activity under your account.
          </p>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Changes to Service</h2>
          <p>
            We may modify or discontinue features at any time. We will make reasonable efforts
            to notify users of significant changes.
          </p>
        </div>
      </div>
    </div>
  );
}
