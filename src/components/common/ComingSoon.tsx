// src/components/common/ComingSoon.tsx

import { Construction } from 'lucide-react';

interface ComingSoonProps {
  title: string;
  description?: string;
}

const ComingSoon = ({ title, description }: ComingSoonProps) => {
  return (
    <div className="section">
      <div className="container max-w-2xl text-center">
        <Construction className="w-14 h-14 mb-4 mx-auto text-gray-300 dark:text-gray-700" strokeWidth={1.5} />
        <h1 className="text-3xl font-bold mb-3">{title}</h1>
        <p className="text-gray-600 dark:text-gray-400">
          {description || "This page is coming soon. We're working on it!"}
        </p>
      </div>
    </div>
  );
};

export default ComingSoon;
