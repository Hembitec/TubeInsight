'use client';

import Navbar from '../Navbar';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-screen flex flex-col bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900 via-gray-900 to-black overflow-hidden">
      <Navbar />
      <div className="flex-1 relative flex items-center justify-center px-4 mt-16">
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-20" />
        <div className="relative w-full max-w-md">
          {/* Decorative elements */}
          <div className="absolute -top-24 -left-12 w-64 h-64 bg-blue-500 rounded-full mix-blend-multiply filter blur-2xl opacity-20 animate-blob" />
          <div className="absolute -top-24 -right-12 w-64 h-64 bg-purple-500 rounded-full mix-blend-multiply filter blur-2xl opacity-20 animate-blob animation-delay-2000" />
          <div className="absolute -bottom-32 left-20 w-64 h-64 bg-pink-500 rounded-full mix-blend-multiply filter blur-2xl opacity-20 animate-blob animation-delay-4000" />
          {children}
        </div>
      </div>
    </div>
  );
}
