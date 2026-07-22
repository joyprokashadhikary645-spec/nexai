// src/app/(public)/privacy/page.tsx

export default function PrivacyPage() {
  return (
    <div className="section">
      <div className="container max-w-3xl">
        <h1 className="text-4xl font-bold mb-6">Privacy Policy</h1>
        <div className="prose dark:prose-invert max-w-none space-y-4 text-gray-600 dark:text-gray-400 leading-relaxed">
          <p>Last updated: 2026</p>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Information We Collect</h2>
          <p>
            We collect information you provide directly, such as your name, email address, and
            content you generate using our AI tools. We also collect usage data to improve our
            service.
          </p>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">How We Use Your Information</h2>
          <p>
            We use your information to provide and improve our services, communicate with you,
            and ensure the security of your account. We do not sell your personal data to third
            parties.
          </p>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Data Security</h2>
          <p>
            We use industry-standard encryption and security practices to protect your data,
            including secure password hashing and JWT-based authentication.
          </p>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Your Rights</h2>
          <p>
            You can permanently delete your account and all associated data (chats, generated
            content, documents, and usage history) at any time from Settings → Danger Zone. This
            action is immediate and cannot be undone. You may also request a copy of your data or
            ask us to correct inaccurate information by contacting us below.
          </p>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Contact Us</h2>
          <p>
            If you have questions about this policy, contact us at support@nexai.app.
          </p>
        </div>
      </div>
    </div>
  );
}
