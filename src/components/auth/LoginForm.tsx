'use client';

import { useState, useCallback } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Brain, Sparkles } from 'lucide-react';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClientComponentClient();

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // Start navigation early
      const navigationPromise = router.prefetch('/dashboard');

      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) throw signInError;

      // Wait for prefetch to complete
      await navigationPromise;
      
      // Immediate client-side redirect
      router.push('/dashboard');
    } catch (error: any) {
      setError(error.message);
      setLoading(false);
    }
  }, [email, password, router, supabase.auth]);

  return (
    <div className="p-8">
      <div className="text-center">
        <Link href="/" className="inline-block">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Brain className="w-8 h-8 text-blue-500" />
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
              TubeInsight
            </span>
          </div>
        </Link>
        <h2 className="text-3xl font-bold text-white flex items-center justify-center gap-2 mt-6">
          Welcome back! <Sparkles className="w-6 h-6 text-yellow-500" />
        </h2>
        <p className="text-gray-400 mt-2">
          Don&apos;t have an account?{' '}
          <Link href="/auth/signup" className="text-blue-500 hover:text-blue-400">
            Sign up
          </Link>
        </p>
      </div>

      <form onSubmit={handleSubmit} className="mt-8 space-y-6">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-300">
            Email address
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="mt-1 block w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="you@example.com"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-300">
            Password
          </label>
          <div className="relative mt-1">
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="block w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-300"
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        {error && (
          <div className="text-red-500 text-sm mt-2">
            {error}
          </div>
        )}

        <div>
          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </div>

        <div className="text-center">
          <Link
            href="/auth/reset-password"
            className="text-sm text-blue-500 hover:text-blue-400"
          >
            Forgot your password?
          </Link>
        </div>
      </form>
    </div>
  );
}
