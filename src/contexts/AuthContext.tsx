'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { User as FirebaseUser } from 'firebase/auth';
import { useRouter, usePathname } from 'next/navigation';
import { User } from '@/types/auth';
import { auth } from '@/lib/firebase';
import { adaptFirebaseUser } from '@/lib/firebaseUserAdapter';

type AuthContextType = {
  user: User | null;
  loading: boolean;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  // Handle auth state changes
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (firebaseUser) => {
      try {
        if (firebaseUser) {
          const adaptedUser = await adaptFirebaseUser(firebaseUser);
          setUser(adaptedUser);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error('Error processing auth state change:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  // Handle sign out
  const handleSignOut = async () => {
    try {
      // Clear cookie first
      document.cookie = 'firebase-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
      // Sign out from Firebase
      await auth.signOut();
      // Navigate to login
      window.location.replace('/auth/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  // Protect routes
  useEffect(() => {
    if (!loading) {
      const isAuthPage = pathname?.startsWith('/auth');
      if (!user && !isAuthPage) {
        router.push('/auth/login');
      } else if (user && isAuthPage) {
        router.push('/dashboard');
      }
    }
  }, [user, loading, pathname, router]);

  return (
    <AuthContext.Provider value={{ user, loading, signOut: handleSignOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
