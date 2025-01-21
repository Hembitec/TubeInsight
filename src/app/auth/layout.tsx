'use client';

import { AnimatePresence } from 'framer-motion';
import AuthLayout from '@/components/auth/AuthLayout';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <AuthLayout>
      <div className="relative bg-gray-900/50 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-800">
        <AnimatePresence mode="wait">
          {children}
        </AnimatePresence>
      </div>
    </AuthLayout>
  );
}
