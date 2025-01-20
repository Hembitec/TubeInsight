'use client';

import dynamic from 'next/dynamic';
import { Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

// Loading component with branded styling
function LoadingState() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-900 to-black">
      <div className="relative bg-gray-900/50 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-gray-800">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 relative">
            <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
          </div>
          <p className="text-gray-400">Loading TubeInsight...</p>
        </div>
      </div>
    </div>
  );
}

// Dynamically import LoginForm with loading state
const LoginForm = dynamic(
  () => import('@/components/auth/LoginForm'),
  {
    loading: () => <LoadingState />,
    ssr: false // Disable SSR for auth components
  }
);

export default function LoginPage() {
  const { loading } = useAuth();

  if (loading) {
    return <LoadingState />;
  }

  return <LoginForm />;
}
