'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import {
  LayoutDashboard,
  BookOpen,
  Settings,
  CreditCard,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
} from 'lucide-react';
import clsx from 'clsx';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Results', href: '/dashboard/results', icon: BookOpen },
];

const secondaryNavigation = [
  { name: 'Subscription', href: '/dashboard/subscription', icon: CreditCard },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { signOut } = useAuth();

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <>
      {/* Mobile menu button */}
      <div className="fixed top-0 left-0 z-50 flex h-16 items-center lg:hidden">
        <button
          onClick={() => setMobileOpen(true)}
          className="px-4 text-gray-400 hover:text-white focus:outline-none"
        >
          <Menu className="h-6 w-6" />
        </button>
      </div>

      {/* Desktop sidebar */}
      <div
        className={clsx(
          'fixed inset-y-0 left-0 z-50 hidden lg:flex flex-col bg-gray-900 transition-all duration-300',
          collapsed ? 'w-16' : 'w-64'
        )}
      >
        {/* Logo */}
        <div className="flex h-16 items-center justify-between gap-2 px-4 py-6">
          {!collapsed && (
            <span className="text-xl font-semibold text-white">TubeInsight</span>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="rounded-lg p-1.5 hover:bg-gray-800"
          >
            {collapsed ? (
              <ChevronRight className="h-5 w-5 text-gray-400" />
            ) : (
              <ChevronLeft className="h-5 w-5 text-gray-400" />
            )}
          </button>
        </div>

        <SidebarContent collapsed={collapsed} onSignOut={handleSignOut} />
      </div>

      {/* Mobile sidebar */}
      <div
        className={clsx(
          'fixed inset-0 z-50 lg:hidden',
          mobileOpen ? 'pointer-events-auto' : 'pointer-events-none'
        )}
      >
        {/* Overlay */}
        <div
          className={clsx(
            'fixed inset-0 bg-gray-900/80 backdrop-blur-sm transition-opacity',
            mobileOpen ? 'opacity-100' : 'opacity-0'
          )}
          onClick={() => setMobileOpen(false)}
        />

        {/* Sidebar */}
        <div
          className={clsx(
            'fixed inset-y-0 left-0 w-full max-w-xs bg-gray-900 transition-transform duration-300',
            mobileOpen ? 'translate-x-0' : '-translate-x-full'
          )}
        >
          {/* Close button */}
          <div className="absolute right-0 top-0 flex h-16 items-center pr-4">
            <button
              onClick={() => setMobileOpen(false)}
              className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-800 hover:text-white"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Logo */}
          <div className="flex h-16 items-center px-6">
            <span className="text-xl font-semibold text-white">TubeInsight</span>
          </div>

          <SidebarContent collapsed={false} onSignOut={handleSignOut} />
        </div>
      </div>
    </>
  );
}

function SidebarContent({ collapsed, onSignOut }: { collapsed: boolean; onSignOut: () => void }) {
  const pathname = usePathname();

  return (
    <>
      {/* Navigation */}
      <div className="flex-1 space-y-1 px-2">
        <nav className="flex-1 space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={clsx(
                  'flex items-center gap-2 rounded-lg px-3 py-2 transition-colors',
                  isActive
                    ? 'bg-gray-800 text-white'
                    : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                )}
              >
                <item.icon className="h-5 w-5 flex-shrink-0" />
                {!collapsed && <span>{item.name}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Secondary Navigation */}
        <div className="mt-10">
          <div className="space-y-1">
            {secondaryNavigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={clsx(
                    'flex items-center gap-2 rounded-lg px-3 py-2 transition-colors',
                    isActive
                      ? 'bg-gray-800 text-white'
                      : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                  )}
                >
                  <item.icon className="h-5 w-5 flex-shrink-0" />
                  {!collapsed && <span>{item.name}</span>}
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* Sign Out Button */}
      <div className="border-t border-gray-800 p-2">
        <button
          onClick={onSignOut}
          className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-gray-400 hover:bg-gray-800 hover:text-white transition-colors"
        >
          <LogOut className="h-5 w-5 flex-shrink-0" />
          {!collapsed && <span>Sign Out</span>}
        </button>
      </div>
    </>
  );
}
