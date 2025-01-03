'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X, User } from 'lucide-react';
import { useScrollTo } from '@/hooks/useScrollTo';
import { useAuth } from '@/contexts/AuthContext';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const scrollTo = useScrollTo();
  const { user, signOut, loading } = useAuth();

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

  const handleSignOut = async () => {
    await signOut();
  };

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
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-4">
              {navLinks.map(({ href, label }) => (
                <a
                  key={href}
                  href={`#${href}`}
                  onClick={(e) => handleNavClick(e, href)}
                  className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap"
                >
                  {label}
                </a>
              ))}
              {!loading && (
                <>
                  {user ? (
                    <div className="flex items-center space-x-4">
                      <Link
                        href="/dashboard"
                        className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap"
                      >
                        Dashboard
                      </Link>
                      <button
                        onClick={handleSignOut}
                        className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-500 transition-colors whitespace-nowrap"
                      >
                        Sign Out
                      </button>
                    </div>
                  ) : (
                    <Link
                      href="/auth"
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-500 transition-colors whitespace-nowrap"
                    >
                      Get Started
                    </Link>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-400 hover:text-white p-2"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {navLinks.map(({ href, label }) => (
                <a
                  key={href}
                  href={`#${href}`}
                  onClick={(e) => handleNavClick(e, href)}
                  className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
                >
                  {label}
                </a>
              ))}
              {!loading && (
                <>
                  {user ? (
                    <>
                      <Link
                        href="/dashboard"
                        className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
                      >
                        Dashboard
                      </Link>
                      <button
                        onClick={handleSignOut}
                        className="w-full text-left text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
                      >
                        Sign Out
                      </button>
                    </>
                  ) : (
                    <Link
                      href="/auth"
                      className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
                    >
                      Get Started
                    </Link>
                  )}
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
