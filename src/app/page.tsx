'use client';

import Navbar from '@/components/Navbar';
import { PricingCard } from '@/components/PricingCard';
import { 
  Brain, 
  Sparkles, 
  BookOpen, 
  Lightbulb, 
  Target, 
  Zap, 
  Video, 
  BookCheck, 
  Trophy, 
  ChevronRight,
  Play,
  Users,
  PenSquare,
  Clock,
  ArrowRight,
  Rocket,
  Star,
  Shield,
  ChevronDown
} from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

function HeroBackground() {
  return (
    <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-10"></div>
  );
}

export default function Home() {
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  const faqs = [
    {
      question: "What is TubeInsight?",
      answer: "TubeInsight is an advanced AI-powered platform that transforms YouTube videos into comprehensive study materials. It analyzes educational content and creates structured learning resources, making online learning more efficient and effective."
    },
    {
      question: "How does TubeInsight work?",
      answer: "Our platform uses advanced AI to analyze video content, extract key information, and organize it into structured study materials. It identifies important concepts, creates summaries, and generates comprehensive notes, making it easier to learn and retain information."
    },
    {
      question: "What types of videos can I analyze?",
      answer: "TubeInsight works best with educational content, including lectures, tutorials, documentaries, and instructional videos. While it's optimized for academic content, it can analyze any video that contains educational or informative material."
    },
    {
      question: "Is TubeInsight free to use?",
      answer: "We offer both free and premium plans. The free plan allows you to analyze a limited number of videos per month, while our premium plans offer additional features, higher usage limits, and priority processing."
    },
    {
      question: "Can I export the generated study materials?",
      answer: "Yes! You can export your study materials in various formats including PDF, Word, and markdown. Premium users get access to additional export options and customization features."
    }
  ];

  return (
    <main className="min-h-screen bg-gray-900">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative overflow-x-hidden pt-24 sm:pt-32 pb-12 sm:pb-20 lg:pb-32 flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <HeroBackground />
        
        {/* Floating Elements */}
        <div className="absolute inset-0">
          {/* Gradient Orbs */}
          <div className="absolute top-1/4 -right-10 sm:-right-20 w-64 sm:w-96 h-64 sm:h-96 bg-blue-500/30 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 -left-10 sm:-left-20 w-64 sm:w-96 h-64 sm:h-96 bg-purple-500/30 rounded-full blur-3xl animate-pulse delay-1000"></div>
          
          {/* Floating Icons */}
          <div className="hidden sm:block absolute top-1/3 left-10 animate-float-slow">
            <div className="w-12 sm:w-16 h-12 sm:h-16 bg-blue-500/20 backdrop-blur-sm rounded-xl flex items-center justify-center border border-blue-500/30">
              <Video className="w-6 sm:w-8 h-6 sm:h-8 text-blue-500" />
            </div>
          </div>
          <div className="hidden sm:block absolute top-1/4 right-10 animate-float-slower">
            <div className="w-12 sm:w-16 h-12 sm:h-16 bg-purple-500/20 backdrop-blur-sm rounded-xl flex items-center justify-center border border-purple-500/30">
              <Brain className="w-6 sm:w-8 h-6 sm:h-8 text-purple-500" />
            </div>
          </div>
          <div className="hidden sm:block absolute bottom-1/3 left-20 animate-float">
            <div className="w-12 sm:w-16 h-12 sm:h-16 bg-pink-500/20 backdrop-blur-sm rounded-xl flex items-center justify-center border border-pink-500/30">
              <BookCheck className="w-6 sm:w-8 h-6 sm:h-8 text-pink-500" />
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <div className="mx-auto max-w-3xl">
            <div className="mb-6 sm:mb-8 flex justify-center">
              <div className="relative rounded-full px-3 py-1 text-xs sm:text-sm leading-6 text-gray-400 ring-1 ring-gray-700/10 hover:ring-gray-700/20">
                Transform your learning experience.{' '}
                <Link href="/auth" className="font-semibold text-blue-500">
                  <span className="absolute inset-0" aria-hidden="true" />
                  Try it now <span aria-hidden="true">&rarr;</span>
                </Link>
              </div>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold tracking-tight text-white">
              Transform YouTube Videos into
              <span className="relative block text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600 mt-2">
                Powerful Learning Materials
                <div className="absolute -bottom-1 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full blur-2xl animate-expand-line"></div>
              </span>
            </h1>
            <p className="mt-4 sm:mt-6 text-base sm:text-lg leading-7 sm:leading-8 text-gray-300 max-w-2xl mx-auto px-4 sm:px-0">
              TubeInsight uses advanced AI to analyze educational videos and create comprehensive study materials, making learning more efficient and engaging than ever before.
            </p>
            <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-x-6">
              <Link
                href="/auth"
                className="w-full sm:w-auto group rounded-xl bg-blue-600 px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 transition-all duration-200 flex items-center justify-center gap-2"
              >
                Get Started Free 
                <ChevronRight className="w-4 sm:w-5 h-4 sm:h-5 transform group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="#features"
                className="w-full sm:w-auto group text-sm sm:text-base font-semibold leading-6 text-white hover:text-blue-400 transition-colors flex items-center justify-center gap-2"
              >
                Learn more 
                <ChevronRight className="w-4 sm:w-5 h-4 sm:h-5 transform group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
            
            {/* Stats with Animated Counters */}
            <div className="mt-12 sm:mt-16 grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 max-w-2xl mx-auto px-4 sm:px-0">
              <div className="relative group">
                <div className="absolute -inset-1 rounded-lg bg-gradient-to-r from-blue-600/20 to-blue-600/0 opacity-25 group-hover:opacity-50 blur transition duration-200"></div>
                <div className="relative flex flex-col-reverse gap-y-2 sm:gap-y-3 border-l-4 border-blue-500/30 pl-4 sm:pl-6">
                  <dt className="text-sm sm:text-base leading-7 text-gray-300">Active Users</dt>
                  <dd className="text-2xl sm:text-3xl font-semibold tracking-tight text-white">20k+</dd>
                </div>
              </div>

              <div className="relative group">
                <div className="absolute -inset-1 rounded-lg bg-gradient-to-r from-purple-600/20 to-purple-600/0 opacity-25 group-hover:opacity-50 blur transition duration-200"></div>
                <div className="relative flex flex-col-reverse gap-y-2 sm:gap-y-3 border-l-4 border-purple-500/30 pl-4 sm:pl-6">
                  <dt className="text-sm sm:text-base leading-7 text-gray-300">Videos Analyzed</dt>
                  <dd className="text-2xl sm:text-3xl font-semibold tracking-tight text-white">100k+</dd>
                </div>
              </div>

              <div className="relative group">
                <div className="absolute -inset-1 rounded-lg bg-gradient-to-r from-pink-600/20 to-pink-600/0 opacity-25 group-hover:opacity-50 blur transition duration-200"></div>
                <div className="relative flex flex-col-reverse gap-y-2 sm:gap-y-3 border-l-4 border-pink-500/30 pl-4 sm:pl-6">
                  <dt className="text-sm sm:text-base leading-7 text-gray-300">Study Hours Saved</dt>
                  <dd className="text-2xl sm:text-3xl font-semibold tracking-tight text-white">500k+</dd>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative py-24">
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Connected gradient paths */}
          <div className="absolute w-full h-full">
            <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full blur-3xl"></div>
            {/* Connecting lines */}
            <div className="absolute top-1/2 left-0 w-full h-1 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20"></div>
            <div className="absolute top-1/4 left-1/4 w-1 h-96 bg-gradient-to-b from-blue-500/20 to-transparent"></div>
            <div className="absolute top-1/4 right-1/4 w-1 h-96 bg-gradient-to-b from-purple-500/20 to-transparent"></div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              Transform Your Learning Experience
            </h2>
            <p className="mt-3 sm:mt-4 text-base sm:text-lg text-gray-400">
              Experience the future of educational content
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 items-center">
            {/* Left side - Video Preview */}
            <div className="relative group">
              <div className="absolute -inset-2 sm:-inset-4 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 opacity-20 blur-xl group-hover:opacity-30 transition-opacity"></div>
              <div className="relative bg-gray-800 rounded-xl overflow-hidden">
                <div className="aspect-video w-full bg-gray-900/50 p-4 sm:p-8">
                  {/* Video Thumbnail with Play Button */}
                  <div className="relative h-full rounded-lg bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center group/video cursor-pointer">
                    <div className="absolute inset-0 rounded-lg overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10"></div>
                    </div>
                    <div className="w-14 h-14 sm:w-20 sm:h-20 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-sm group-hover/video:scale-110 transition-transform">
                      <Play className="w-6 sm:w-8 h-6 sm:h-8 text-white fill-white" />
                    </div>
                    {/* Video Interface Elements */}
                    <div className="absolute bottom-3 sm:bottom-4 left-3 sm:left-4 right-3 sm:right-4">
                      <div className="flex items-center gap-2 sm:gap-4">
                        <div className="h-1 flex-1 bg-gray-700 rounded-full overflow-hidden">
                          <div className="w-2/3 h-full bg-gradient-to-r from-blue-500 to-purple-500"></div>
                        </div>
                        <span className="text-xs sm:text-sm text-gray-400">4:20</span>
                      </div>
                    </div>
                  </div>
                </div>
                {/* AI Analysis Overlay */}
                <div className="absolute top-4 right-4 flex items-center gap-2 bg-gray-900/50 backdrop-blur-sm px-3 py-1.5 rounded-full">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                  <span className="text-sm text-gray-300">AI Analyzing...</span>
                </div>
              </div>
            </div>

            {/* Right side - Features List */}
            <div className="space-y-8">
              <div className="relative group">
                <div className="absolute -inset-2 rounded-lg bg-gradient-to-r from-blue-600/20 to-blue-600/0 opacity-0 group-hover:opacity-100 transition-opacity blur-xl"></div>
                <div className="relative flex gap-4 items-start">
                  <div className="flex-shrink-0 w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center">
                    <Brain className="w-6 h-6 text-blue-500" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-blue-400 transition-colors">Smart Analysis</h3>
                    <p className="text-gray-400">Our AI breaks down complex topics into easily digestible segments, identifying key concepts and learning objectives.</p>
                  </div>
                </div>
              </div>

              <div className="relative group">
                <div className="absolute -inset-2 rounded-lg bg-gradient-to-r from-purple-600/20 to-purple-600/0 opacity-0 group-hover:opacity-100 transition-opacity blur-xl"></div>
                <div className="relative flex gap-4 items-start">
                  <div className="flex-shrink-0 w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center">
                    <BookCheck className="w-6 h-6 text-purple-500" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-purple-400 transition-colors">Interactive Learning</h3>
                    <p className="text-gray-400">Generate quizzes, flashcards, and study guides automatically from video content to reinforce your learning.</p>
                  </div>
                </div>
              </div>

              <div className="relative group">
                <div className="absolute -inset-2 rounded-lg bg-gradient-to-r from-pink-600/20 to-pink-600/0 opacity-0 group-hover:opacity-100 transition-opacity blur-xl"></div>
                <div className="relative flex gap-4 items-start">
                  <div className="flex-shrink-0 w-12 h-12 bg-pink-500/10 rounded-lg flex items-center justify-center">
                    <Trophy className="w-6 h-6 text-pink-500" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-pink-400 transition-colors">Track Progress</h3>
                    <p className="text-gray-400">Monitor your learning journey with detailed analytics and progress tracking for continuous improvement.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="relative py-24">
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 right-0 w-[1000px] h-[1000px] bg-gradient-to-bl from-blue-500/10 to-purple-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-[1000px] h-[1000px] bg-gradient-to-tr from-purple-500/10 to-pink-500/10 rounded-full blur-3xl"></div>
          
          {/* Floating Elements */}
          <div className="absolute top-1/4 left-1/4 w-32 h-32 border-4 border-blue-500/20 rounded-full animate-float-slow"></div>
          <div className="absolute bottom-1/4 right-1/4 w-40 h-40 border-4 border-purple-500/20 rounded-full animate-float"></div>
          
          {/* Glowing Dots */}
          <div className="absolute top-1/3 right-1/3 w-6 h-6 bg-blue-500/50 rounded-full blur-sm animate-pulse"></div>
          <div className="absolute bottom-1/3 left-1/3 w-6 h-6 bg-purple-500/50 rounded-full blur-sm animate-pulse delay-500"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              Why Choose TubeInsight
            </h2>
            <p className="mt-3 sm:mt-4 text-base sm:text-lg text-gray-400">
              Experience the advantages of AI-powered learning
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 lg:gap-12">
            {[
              {
                icon: Rocket,
                title: "Fast & Efficient",
                description: "Save hours of study time with instant summaries",
                color: "text-blue-500",
                borderColor: "border-blue-500/30"
              },
              {
                icon: Brain,
                title: "Smart Learning",
                description: "Adaptive learning paths based on your progress",
                color: "text-purple-500",
                borderColor: "border-purple-500/30"
              },
              {
                icon: Users,
                title: "Collaborative",
                description: "Share and learn with others in the community",
                color: "text-pink-500",
                borderColor: "border-pink-500/30"
              }
            ].map((feature, index) => (
              <div key={index} className="group relative">
                <div className="absolute -inset-2 rounded-lg bg-gradient-to-r from-blue-600/20 to-blue-600/0 opacity-0 group-hover:opacity-100 transition-opacity blur-xl"></div>
                <div className="relative flex gap-4 items-start">
                  <div className="flex-shrink-0 w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center">
                    <feature.icon className="w-6 h-6 text-blue-500" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-blue-400 transition-colors">{feature.title}</h3>
                    <p className="text-gray-400">{feature.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Visual Element */}
          <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 max-w-full w-[400px] sm:w-[800px] h-[400px] sm:h-[800px] opacity-20 overflow-hidden">
            <div className="absolute inset-0 rotate-45 animate-pulse">
              <div className="absolute top-0 left-0 w-48 sm:w-96 h-[2px] bg-gradient-to-r from-transparent via-blue-500 to-transparent"></div>
              <div className="absolute bottom-0 right-0 w-48 sm:w-96 h-[2px] bg-gradient-to-r from-transparent via-purple-500 to-transparent"></div>
              <div className="absolute top-0 right-0 w-[2px] h-48 sm:h-96 bg-gradient-to-b from-transparent via-blue-500 to-transparent"></div>
              <div className="absolute bottom-0 left-0 w-[2px] h-48 sm:h-96 bg-gradient-to-b from-transparent via-purple-500 to-transparent"></div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="relative py-24">
        <div className="absolute inset-0 overflow-hidden">
          {/* Connected Background Elements */}
          <div className="absolute inset-0">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10 blur-3xl"></div>
            
            {/* Connecting Elements */}
            <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gradient-to-r from-blue-500/30 via-purple-500/30 to-pink-500/30"></div>
            
            {/* Step Connectors */}
            <div className="absolute top-1/2 left-[20%] w-[60%] h-0.5 bg-gradient-to-r from-blue-500/50 via-purple-500/50 to-pink-500/50"></div>
            
            {/* Vertical Connectors */}
            <div className="absolute top-1/4 left-[20%] w-0.5 h-40 bg-gradient-to-b from-blue-500/30 to-transparent"></div>
            <div className="absolute top-1/4 left-1/2 w-0.5 h-40 bg-gradient-to-b from-purple-500/30 to-transparent"></div>
            <div className="absolute top-1/4 right-[20%] w-0.5 h-40 bg-gradient-to-b from-pink-500/30 to-transparent"></div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              How It Works
            </h2>
            <p className="mt-4 text-lg text-gray-400">
              Three simple steps to enhance your learning
            </p>
          </div>
          
          <div className="relative">
            <div className="absolute top-8 left-8 right-8 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              <div className="relative">
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 w-16 h-16 bg-gray-900 rounded-full border-4 border-blue-500 flex items-center justify-center">
                  <span className="text-2xl font-bold text-blue-500">1</span>
                </div>
                <div className="pt-12 text-center">
                  <h3 className="text-lg font-semibold text-white mb-2">Paste Video URL</h3>
                  <p className="text-gray-400">Simply paste any educational YouTube video link to get started.</p>
                </div>
              </div>
              
              <div className="relative">
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 w-16 h-16 bg-gray-900 rounded-full border-4 border-purple-500 flex items-center justify-center">
                  <span className="text-2xl font-bold text-purple-500">2</span>
                </div>
                <div className="pt-12 text-center">
                  <h3 className="text-lg font-semibold text-white mb-2">AI Analysis</h3>
                  <p className="text-gray-400">Our AI processes the video and extracts valuable information.</p>
                </div>
              </div>
              
              <div className="relative">
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 w-16 h-16 bg-gray-900 rounded-full border-4 border-pink-500 flex items-center justify-center">
                  <span className="text-2xl font-bold text-pink-500">3</span>
                </div>
                <div className="pt-12 text-center">
                  <h3 className="text-lg font-semibold text-white mb-2">Get Materials</h3>
                  <p className="text-gray-400">Access your personalized learning materials instantly.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="relative py-24">
        <div className="absolute inset-0 overflow-hidden">
          {/* Connected Background Elements */}
          <div className="absolute inset-0">
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-bl from-blue-500/20 to-purple-500/20 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-gradient-to-tr from-purple-500/20 to-pink-500/20 rounded-full blur-3xl"></div>
            
            {/* Connecting Lines */}
            <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gradient-to-r from-blue-500/30 via-purple-500/30 to-pink-500/30"></div>
            <div className="absolute top-1/4 left-1/4 w-0.5 h-96 bg-gradient-to-b from-blue-500/30 to-transparent"></div>
            <div className="absolute top-1/4 right-1/4 w-0.5 h-96 bg-gradient-to-b from-purple-500/30 to-transparent"></div>
            
            {/* Diagonal Connectors */}
            <div className="absolute top-1/4 left-1/4 w-96 h-0.5 bg-gradient-to-r from-blue-500/30 to-transparent transform rotate-45"></div>
            <div className="absolute bottom-1/4 right-1/4 w-96 h-0.5 bg-gradient-to-l from-purple-500/30 to-transparent transform -rotate-45"></div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Simple, Transparent Pricing
            </h2>
            <p className="mt-4 text-lg text-gray-400">
              Choose the plan that works best for you
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <PricingCard 
              title="Free"
              price="$0"
              description="Perfect for trying out TubeInsight"
              features={[
                "3 video summaries per month",
                "Basic AI analysis",
                "Text summaries",
                "Community support"
              ]}
              ctaText="Get Started"
              ctaLink="/auth"
              popular={false}
            />
            <PricingCard 
              title="Pro"
              price="$19.99"
              period="/month"
              description="For power users who want unlimited access"
              features={[
                "Unlimited video summaries",
                "Advanced AI analysis",
                "Text & audio summaries",
                "Flashcards & quizzes",
                "Custom learning paths",
                "Priority support",
                "Export to PDF/Word",
                "Team collaboration"
              ]}
              ctaText="Get Pro Access"
              ctaLink="/auth"
              popular={true}
            />
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="relative py-16 sm:py-24">
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-bl from-blue-500/10 to-purple-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-to-tr from-purple-500/10 to-pink-500/10 rounded-full blur-3xl"></div>
          
          {/* Floating Elements */}
          <div className="absolute top-20 right-10 w-32 h-32 border-2 border-blue-500/20 rounded-full animate-float-slow"></div>
          <div className="absolute bottom-20 left-10 w-40 h-40 border-2 border-purple-500/20 rounded-full animate-float"></div>
          
          {/* Decorative Lines */}
          <div className="absolute top-1/4 left-0 w-48 h-[2px] bg-gradient-to-r from-blue-500/40 to-transparent"></div>
          <div className="absolute bottom-1/4 right-0 w-48 h-[2px] bg-gradient-to-l from-purple-500/40 to-transparent"></div>
          
          {/* Glowing Dots */}
          <div className="absolute top-1/3 right-1/4 w-3 h-3 bg-blue-500/40 rounded-full blur-sm animate-pulse"></div>
          <div className="absolute bottom-1/3 left-1/4 w-3 h-3 bg-purple-500/40 rounded-full blur-sm animate-pulse delay-500"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-600 inline-block">Frequently Asked Questions</h2>
            <p className="mt-4 text-lg text-gray-400">Everything you need to know about TubeInsight</p>
          </div>

          <div className="grid gap-6 max-w-3xl mx-auto">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="group relative bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 hover:bg-gray-800/70 transition-all duration-300"
              >
                {/* Question */}
                <button
                  className="flex w-full text-left"
                  onClick={() => toggleFAQ(index)}
                >
                  <span className="flex-1 text-lg font-semibold text-white">{faq.question}</span>
                  <span className="ml-6 flex h-7 items-center">
                    <div className={`h-6 w-6 rounded-full border-2 border-blue-500/50 flex items-center justify-center transform transition-transform duration-200 ${openFAQ === index ? 'rotate-180 bg-blue-500/20' : ''}`}>
                      <ChevronDown className="h-4 w-4 text-blue-500" />
                    </div>
                  </span>
                </button>

                {/* Answer */}
                <div
                  className={`mt-4 pr-12 transition-all duration-300 overflow-hidden ${
                    openFAQ === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                  }`}
                >
                  <p className="text-gray-400">{faq.answer}</p>
                </div>

                {/* Decorative gradient border */}
                <div className="absolute inset-0 rounded-2xl p-px bg-gradient-to-r from-blue-500/30 via-purple-500/30 to-blue-500/30 -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl mb-6">
            Ready to Transform Your Learning Experience?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Join thousands of users who are already learning smarter with TubeInsight
          </p>
          <Link
            href="/auth"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-blue-600 rounded-xl font-semibold hover:bg-gray-100 transition-colors"
          >
            Get Started Now <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </main>
  );
}
