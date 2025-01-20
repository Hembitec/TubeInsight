'use client';

import dynamic from 'next/dynamic';
import { Loader2 } from 'lucide-react';

// Loading component
function LoadingState() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
        <p className="text-gray-400">Loading...</p>
      </div>
    </div>
  );
}

// Dynamically import SignupForm with loading state
const SignupForm = dynamic(
  () => import('@/components/auth/SignupForm'),
  {
    loading: () => <LoadingState />,
    ssr: false // Disable SSR for auth components
  }
);

export default function SignupPage() {
  return <SignupForm />;
}
