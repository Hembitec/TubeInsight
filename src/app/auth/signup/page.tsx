'use client';

import SignupForm from '@/components/auth/SignupForm';
import PageTransition from '@/components/transitions/PageTransition';

export default function SignupPage() {
  return (
    <PageTransition>
      <SignupForm />
    </PageTransition>
  );
}
