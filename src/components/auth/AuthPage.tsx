'use client';

import { useState, useCallback, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Brain, Sparkles, Lock } from 'lucide-react';
import { toast } from 'sonner';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState<number>(0);
  const router = useRouter();
  const supabase = createClientComponentClient();

  // Handle countdown timer
  useEffect(() => {
    if (countdown > 0) {
      const timer = setInterval(() => {
        setCountdown(prev => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [countdown]);

  const getLastAttemptTime = () => {
    const lastAttempt = localStorage.getItem('lastAuthAttempt');
    return lastAttempt ? parseInt(lastAttempt, 10) : 0;
  };

  const setLastAttemptTime = (time: number) => {
    localStorage.setItem('lastAuthAttempt', time.toString());
  };

  const handleRateLimit = useCallback(async (operation: () => Promise<any>) => {
    const now = Date.now();
    const lastAttempt = getLastAttemptTime();
    const minWaitTime = 1000; // 1 second between normal attempts
    const rateLimitWaitTime = 30000; // 30 seconds after rate limit hit
    
    // Check if we're in a rate limit cooldown
    if (localStorage.getItem('rateLimitHit')) {
      const timeLeft = Math.ceil((lastAttempt + rateLimitWaitTime - now) / 1000);
      if (timeLeft > 0) {
        setCountdown(timeLeft);
        throw new Error(`Please wait ${timeLeft} seconds before trying again`);
      }
      localStorage.removeItem('rateLimitHit');
    }
    
    // Check normal cooldown
    const timeToWait = lastAttempt + minWaitTime - now;
    if (timeToWait > 0) {
      throw new Error('Please wait a moment before trying again');
    }
    
    try {
      setLastAttemptTime(now);
      return await operation();
    } catch (error: any) {
      if (error.message?.toLowerCase().includes('rate limit')) {
        localStorage.setItem('rateLimitHit', 'true');
        setLastAttemptTime(now);
        setCountdown(30);
        throw new Error('Too many attempts. Please wait 30 seconds before trying again');
      }
      throw error;
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (countdown > 0) {
      toast.error(`Please wait ${countdown} seconds before trying again`);
      return;
    }
    
    setLoading(true);

    try {
      if (isLogin) {
        await handleRateLimit(async () => {
          const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
          });
          if (error) throw error;
          localStorage.removeItem('rateLimitHit'); // Clear rate limit on successful login
          router.push('/dashboard');
        });
      } else {
        if (!name.trim()) {
          throw new Error('Please enter your name');
        }
        
        await handleRateLimit(async () => {
          const { error: signUpError } = await supabase.auth.signUp({
            email,
            password,
            options: {
              data: {
                full_name: name.trim(),
              },
              emailRedirectTo: process.env.NEXT_PUBLIC_APP_URL + '/auth/callback',
            },
          });
          if (signUpError) throw signUpError;
          localStorage.removeItem('rateLimitHit'); // Clear rate limit on successful signup
          toast.success('Please check your email for verification link.');
          setError('Please check your email for verification link.');
        });
      }
    } catch (error: any) {
      console.error('Auth error:', error);
      setError(error.message);
      
      // Show user-friendly error message
      if (error.message?.toLowerCase().includes('rate limit') || 
          error.message?.toLowerCase().includes('wait')) {
        toast.error(error.message);
      } else if (error.message?.toLowerCase().includes('invalid login')) {
        toast.error('Invalid email or password. Please check your credentials.');
      } else if (error.message?.toLowerCase().includes('email')) {
        toast.error('Please enter a valid email address.');
      } else {
        toast.error(error.message || 'An error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900 via-gray-900 to-black">
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-20" />
      
      <div className="relative w-full max-w-md">
        {/* Decorative elements */}
        <div className="absolute -top-24 -left-12 w-64 h-64 bg-blue-500 rounded-full mix-blend-multiply filter blur-2xl opacity-20 animate-blob" />
        <div className="absolute -top-24 -right-12 w-64 h-64 bg-purple-500 rounded-full mix-blend-multiply filter blur-2xl opacity-20 animate-blob animation-delay-2000" />
        <div className="absolute -bottom-32 left-20 w-64 h-64 bg-pink-500 rounded-full mix-blend-multiply filter blur-2xl opacity-20 animate-blob animation-delay-4000" />

        <div className="relative bg-gray-900/50 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-gray-800">
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
              {isLogin ? (
                <>
                  Welcome back! <Sparkles className="w-6 h-6 text-yellow-500" />
                </>
              ) : (
                <>
                  Join TubeInsight <Sparkles className="w-6 h-6 text-yellow-500" />
                </>
              )}
            </h2>
            <p className="mt-2 text-sm text-gray-400">
              {isLogin ? "Don't have an account? " : 'Already have an account? '}
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="font-medium text-blue-500 hover:text-blue-400 transition-colors"
              >
                {isLogin ? 'Sign up' : 'Log in'}
              </button>
            </p>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            {countdown > 0 && (
              <div className="text-center p-2 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
                <p className="text-yellow-400">
                  Please wait {countdown} seconds before trying again
                </p>
              </div>
            )}
            <div className="space-y-4">
              {!isLogin && (
                <div className="group">
                  <label htmlFor="name" className="block text-sm font-medium text-gray-300">
                    Full Name
                  </label>
                  <div className="mt-1 relative">
                    <input
                      id="name"
                      name="name"
                      type="text"
                      autoComplete="name"
                      required={!isLogin}
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="block w-full px-3 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="John Doe"
                    />
                  </div>
                </div>
              )}

              <div className="group">
                <label htmlFor="email" className="block text-sm font-medium text-gray-300">
                  Email address
                </label>
                <div className="mt-1 relative">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full px-3 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              <div className="group">
                <label htmlFor="password" className="block text-sm font-medium text-gray-300">
                  Password
                </label>
                <div className="mt-1 relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete={isLogin ? 'current-password' : 'new-password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full px-3 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-300 transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {error && (
              <div className="text-sm text-center text-red-500 bg-red-500/10 py-2 px-4 rounded-lg">
                {error}
              </div>
            )}

            {isLogin && (
              <div className="text-sm text-right">
                <Link
                  href="/auth/reset-password"
                  className="font-medium text-blue-500 hover:text-blue-400 transition-colors inline-flex items-center gap-1"
                >
                  <Lock className="w-4 h-4" />
                  Forgot your password?
                </Link>
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={loading}
                className="relative w-full group"
              >
                <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg blur opacity-60 group-hover:opacity-100 transition duration-200"></div>
                <div className="relative w-full flex justify-center py-2.5 px-4 bg-gray-900 rounded-lg text-sm font-semibold text-white hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 focus:border-transparent transition-all">
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 border-t-2 border-blue-500 border-solid rounded-full animate-spin"></div>
                      Loading...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      {isLogin ? 'Sign in' : 'Create account'}
                      <Sparkles className="w-4 h-4" />
                    </div>
                  )}
                </div>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
