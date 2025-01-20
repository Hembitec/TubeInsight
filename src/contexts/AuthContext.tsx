'use client';

import { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';
import { User } from '@supabase/supabase-js';
import { createSupabaseClient } from '@/lib/supabase';
import { useRouter, usePathname } from 'next/navigation';
import LogoutModal from '@/components/LogoutModal';

type AuthContextType = {
  user: User | null;
  loading: boolean;
  signOut: () => void;
  isLoggingOut: boolean;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signOut: () => {},
  isLoggingOut: false,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  // Initialize Supabase client
  const supabase = useMemo(() => createSupabaseClient(), []);

  // Memoize the initial session check
  const initializeAuth = useCallback(async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
    } catch (error) {
      console.error('Error checking auth session:', error);
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  // Handle auth state changes
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null);
        setLoading(false);

        if (event === 'SIGNED_IN') {
          router.refresh();
        }
      }
    );

    initializeAuth();

    return () => {
      subscription.unsubscribe();
    };
  }, [router, initializeAuth, supabase]);

  // Just show the confirmation modal, don't sign out yet
  const signOut = useCallback(() => {
    setIsLoggingOut(true);
  }, []);

  // Handle actual sign out after confirmation
  const handleConfirmSignOut = useCallback(async () => {
    try {
      // Start transition to login page
      router.prefetch('/auth/login');
      
      // Set a small timeout to ensure prefetch completes
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Navigate to login
      router.replace('/auth/login');
      
      // Small delay to ensure navigation starts
      await new Promise(resolve => setTimeout(resolve, 50));
      
      // Then sign out from Supabase
      await supabase.auth.signOut();
      
      // Clear local state
      setUser(null);
      setIsLoggingOut(false);
    } catch (error) {
      console.error('Error signing out:', error);
      setIsLoggingOut(false);
    }
  }, [supabase, router]);

  // Handle cancel sign out
  const handleCancelSignOut = useCallback(() => {
    setIsLoggingOut(false);
  }, []);

  // Don't show modal on auth pages
  const showLogoutModal = isLoggingOut && !pathname?.startsWith('/auth');

  // Memoize context value
  const value = useMemo(
    () => ({
      user,
      loading,
      signOut,
      isLoggingOut,
    }),
    [user, loading, signOut, isLoggingOut]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
      {showLogoutModal && (
        <LogoutModal 
          isOpen={true}
          onConfirm={handleConfirmSignOut}
          onCancel={handleCancelSignOut}
        />
      )}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
