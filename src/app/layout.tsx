import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { AuthProvider } from '@/contexts/AuthContext'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'TubeInsight - AI-Powered YouTube Video Summarizer & Learning Tool',
  description: 'Transform YouTube videos into concise summaries, study notes, and learning materials. Best YouTube video summarizer with AI-powered insights, flashcards, and quizzes. Save time learning from educational content.',
  keywords: [
    'youtube video summarizer',
    'video to text summary',
    'youtube transcript generator',
    'ai video summary',
    'youtube video analysis',
    'educational video tools',
    'video learning platform',
    'youtube study notes',
    'video content analyzer',
    'ai learning assistant'
  ],
  openGraph: {
    title: 'TubeInsight - AI-Powered YouTube Video Summarizer',
    description: 'Transform YouTube videos into concise summaries and learning materials. Save time with AI-powered video analysis.',
    type: 'website',
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}
