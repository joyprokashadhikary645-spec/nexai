// src/app/(public)/about/page.tsx

export default function AboutPage() {
  return (
    <div className="section">
      <div className="container max-w-3xl">
        <h1 className="text-4xl font-bold mb-6 text-center">About NexAI</h1>
        <div className="prose dark:prose-invert max-w-none space-y-4 text-gray-600 dark:text-gray-400 leading-relaxed">
          <p>
            NexAI was built with a simple mission: make powerful AI tools accessible to
            everyone, completely free. Whether you&apos;re a student, a content creator, a
            developer, or a business owner, NexAI gives you a full suite of AI-powered tools
            to chat, write, translate, code, and create — all in one place.
          </p>
          <p>
            We believe AI should not be locked behind expensive subscriptions. That&apos;s why
            every core feature on NexAI is free to use, with generous monthly usage limits for
            everyone.
          </p>
          <p>
            Our platform is built on modern, reliable technology and is constantly improving
            based on feedback from our community.
          </p>
        </div>
      </div>
    </div>
  );
}
