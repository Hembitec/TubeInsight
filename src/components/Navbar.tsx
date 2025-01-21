'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, User, Loader2 } from 'lucide-react';
import { useScrollTo } from '@/hooks/useScrollTo';
import { useAuth } from '@/contexts/AuthContext';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const scrollTo = useScrollTo();
  const { user, loading } = useAuth();
  const pathname = usePathname();

  // Only show navbar after initial mount
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    scrollTo(id);
    setIsOpen(false);
  };

  const navLinks = [
    { href: 'features', label: 'Features' },
    { href: 'how-it-works', label: 'How It Works' },
    { href: 'pricing', label: 'Pricing' },
    { href: 'faq', label: 'FAQ' },
  ];

  // Don't render anything until mounted
  if (!mounted) {
    return null;
  }

  const isAuthPage = pathname?.startsWith('/auth');

  return (
    <nav className="bg-gray-900/50 backdrop-blur-md fixed w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="text-lg sm:text-xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent truncate">
              TubeInsight
            </Link>
          </div>

          {/* Desktop Navigation */}
          {!isAuthPage && (
            <div className="hidden md:block">
              <div className="ml-10 flex items-center space-x-4">
                {pathname === '/' && navLinks.map(({ href, label }) => (
                  <a
                    key={href}
                    href={`#${href}`}
                    onClick={(e) => handleNavClick(e, href)}
                    className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap"
                  >
                    {label}
                  </a>
                ))}
                {user && (
                  <Link
                    href="/dashboard"
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-500 transition-colors whitespace-nowrap"
                  >
                    Dashboard
                  </Link>
                )}
                {!user && !isAuthPage && (
                  <Link
                    href="/auth/login"
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-500 transition-colors whitespace-nowrap"
                  >
                    Sign In
                  </Link>
                )}
              </div>
            </div>
          )}

          {/* Mobile menu button - only show on non-auth pages */}
          {!isAuthPage && (
            <div className="md:hidden">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              >
                {isOpen ? (
                  <X className="block h-6 w-6" aria-hidden="true" />
                ) : (
                  <Menu className="block h-6 w-6" aria-hidden="true" />
                )}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile menu - only show on non-auth pages */}
      {!isAuthPage && isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {pathname === '/' && navLinks.map(({ href, label }) => (
              <a
                key={href}
                href={`#${href}`}
                onClick={(e) => handleNavClick(e, href)}
                className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
              >
                {label}
              </a>
            ))}
            {user && (
              <Link
                href="/dashboard"
                className="bg-blue-600 text-white block px-3 py-2 rounded-md text-base font-medium hover:bg-blue-500"
              >
                Dashboard
              </Link>
            )}
            {!user && (
              <Link
                href="/auth/login"
                className="bg-blue-600 text-white block px-3 py-2 rounded-md text-base font-medium hover:bg-blue-500"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
