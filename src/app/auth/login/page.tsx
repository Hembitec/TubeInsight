'use client';

import { useAuth } from '@/contexts/AuthContext';
import LoginForm from '@/components/auth/LoginForm';
import PageTransition from '@/components/transitions/PageTransition';

export default function LoginPage() {
  return (
    <PageTransition>
      <LoginForm />
    </PageTransition>
  );
}
