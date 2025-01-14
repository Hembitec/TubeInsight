import ProtectedLayout from '@/components/ProtectedLayout';

export default function ResultsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ProtectedLayout>{children}</ProtectedLayout>;
}
