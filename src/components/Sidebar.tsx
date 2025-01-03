'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { LayoutGrid, FileText, CreditCard, LogOut, Menu } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export default function Sidebar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { signOut } = useAuth();
  const supabase = createClientComponentClient();

  const isActive = (path: string) => pathname === path;

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      // First navigate to root
      router.push('/');
      // Then reload the page to clear all states
      router.refresh();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="fixed top-4 left-4 z-50 p-2 rounded-lg text-white md:hidden"
      >
        <Menu className="h-6 w-6" />
      </button>

      {/* Overlay for mobile */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div 
        className={`fixed md:sticky top-0 left-0 h-screen bg-[#111827] transition-all duration-300 z-50
          w-[280px] md:w-[280px] border-r border-gray-800/60
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}
      >
        {/* Logo */}
        <div className="p-8">
          <h1 className="text-xl font-bold text-white">TubeInsight</h1>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 space-y-2 px-4">
          <Link
            href="/dashboard"
            className={`flex items-center px-4 py-2.5 rounded-lg text-sm font-medium transition-colors group ${
              isActive('/dashboard')
                ? 'text-white bg-[#1F2937]'
                : 'text-[#94A3B8] hover:text-white hover:bg-[#1F2937]'
            }`}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <LayoutGrid className={`h-5 w-5 mr-3 transition-colors ${
              isActive('/dashboard') ? 'text-blue-500' : 'text-[#94A3B8] group-hover:text-blue-500'
            }`} />
            Dashboard
          </Link>

          <Link
            href="/dashboard/results"
            className={`flex items-center px-4 py-2.5 rounded-lg text-sm font-medium transition-colors group ${
              isActive('/dashboard/results')
                ? 'text-white bg-[#1F2937]'
                : 'text-[#94A3B8] hover:text-white hover:bg-[#1F2937]'
            }`}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <FileText className={`h-5 w-5 mr-3 transition-colors ${
              isActive('/dashboard/results') ? 'text-purple-500' : 'text-[#94A3B8] group-hover:text-purple-500'
            }`} />
            Results
          </Link>

          <Link
            href="/dashboard/subscription"
            className={`flex items-center px-4 py-2.5 rounded-lg text-sm font-medium transition-colors group ${
              isActive('/dashboard/subscription')
                ? 'text-white bg-[#1F2937]'
                : 'text-[#94A3B8] hover:text-white hover:bg-[#1F2937]'
            }`}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <CreditCard className={`h-5 w-5 mr-3 transition-colors ${
              isActive('/dashboard/subscription') ? 'text-orange-500' : 'text-[#94A3B8] group-hover:text-orange-500'
            }`} />
            Subscription
          </Link>
        </nav>

        {/* Sign Out Button */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <button
            onClick={() => {
              setIsMobileMenuOpen(false);
              handleSignOut();
            }}
            className="flex items-center px-4 py-2.5 w-full rounded-lg text-sm font-medium text-[#94A3B8] hover:text-white hover:bg-[#1F2937] transition-colors group"
          >
            <LogOut className="h-5 w-5 mr-3 text-[#94A3B8] group-hover:text-red-500 transition-colors" />
            Sign Out
          </button>
        </div>
      </div>
    </>
  );
}