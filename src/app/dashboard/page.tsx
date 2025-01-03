'use client';

import { Suspense, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useAuth } from '@/contexts/AuthContext';
import NewAnalysisModal from '@/components/NewAnalysisModal';
import { Clock, FileText, History, HelpCircle, Plus } from 'lucide-react';

interface Analysis {
  id: string;
  created_at: string;
  url: string;
  video_id: string;
}

function RecentActivity({ analyses }: { analyses: Analysis[] }) {
  const router = useRouter();
  
  return (
    <div>
      <h2 className="text-lg font-medium text-white mb-3">Recent Activity</h2>
      <div className="space-y-1">
        {analyses.length > 0 ? (
          analyses.slice(0, 3).map((analysis) => (
            <div
              key={analysis.id}
              className="bg-[#1F2937] hover:bg-gray-800 transition-colors cursor-pointer py-3 px-4 rounded-md flex items-center gap-3"
              onClick={() => router.push(`/dashboard/results?id=${analysis.id}`)}
            >
              <History className="w-5 h-5 text-gray-400" />
              <div>
                <h3 className="font-medium text-white">Video Analysis</h3>
                <p className="text-gray-400">
                  {new Date(analysis.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-6 bg-[#1F2937] rounded-md">
            <HelpCircle className="w-10 h-10 text-gray-600 mx-auto mb-2" />
            <p className="text-gray-400">No analyses yet. Start by analyzing your first video!</p>
          </div>
        )}
      </div>
    </div>
  );
}

function QuickActions({ onNewAnalysis }: { onNewAnalysis: () => void }) {
  const router = useRouter();
  
  return (
    <div>
      <h2 className="text-lg font-medium text-white mb-3">Quick Actions</h2>
      <div className="grid grid-cols-2 gap-2">
        <div 
          onClick={onNewAnalysis}
          className="bg-[#1F2937] rounded-lg p-4 hover:bg-gray-800 transition-colors cursor-pointer flex flex-col items-center justify-center"
        >
          <Plus className="w-6 h-6 text-blue-500 mb-2" />
          <span className="text-white">New Analysis</span>
        </div>
        <div 
          onClick={() => router.push('/dashboard/history')}
          className="bg-[#1F2937] rounded-lg p-4 hover:bg-gray-800 transition-colors cursor-pointer flex flex-col items-center justify-center"
        >
          <History className="w-6 h-6 text-purple-500 mb-2" />
          <span className="text-white">View History</span>
        </div>
        <div 
          onClick={() => router.push('/help')}
          className="bg-[#1F2937] rounded-lg p-4 hover:bg-gray-800 transition-colors cursor-pointer flex flex-col items-center justify-center col-span-2"
        >
          <HelpCircle className="w-6 h-6 text-orange-500 mb-2" />
          <span className="text-white">Tips & Help</span>
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const [analyses, setAnalyses] = useState<Analysis[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user } = useAuth();
  const supabase = createClientComponentClient();
  const router = useRouter();

  useEffect(() => {
    if (!user) return;
    
    const channel = supabase
      .channel('analyses')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'analyses',
          filter: `user_id=eq.${user.id}`
        }, 
        () => {
          fetchAnalyses();
        }
      )
      .subscribe();

    fetchAnalyses();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const fetchAnalyses = async () => {
    if (!user) return;
    
    const { data } = await supabase
      .from('analyses')
      .select('*')
      .order('created_at', { ascending: false });
      
    if (data) {
      setAnalyses(data);
    }
  };

  const handleNewAnalysis = async (url: string) => {
    setIsModalOpen(false);
    router.push(`/dashboard/results?url=${encodeURIComponent(url)}`);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Welcome Card */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 mb-4">
        <h1 className="text-xl font-semibold text-white mb-2">
          Welcome back, {user?.email?.split('@')[0] || 'User'}! 👋
        </h1>
        <p className="text-white/90 mb-4">Ready to analyze more videos?</p>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-white text-blue-600 px-4 py-2 rounded-lg font-medium hover:bg-white/90 transition-colors inline-flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          New Analysis
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-[#1F2937] rounded-lg p-6">
          <div className="flex items-center gap-3 mb-3">
            <FileText className="w-6 h-6 text-blue-500" />
            <span className="text-gray-400">Videos Analyzed</span>
          </div>
          <p className="text-2xl font-semibold text-white">{analyses.length}</p>
        </div>
        
        <div className="bg-[#1F2937] rounded-lg p-6">
          <div className="flex items-center gap-3 mb-3">
            <Clock className="w-6 h-6 text-purple-500" />
            <span className="text-gray-400">Time Saved</span>
          </div>
          <p className="text-2xl font-semibold text-white">{analyses.length}h</p>
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Suspense fallback={
          <div className="animate-pulse space-y-1">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-12 bg-[#1F2937] rounded-md" />
            ))}
          </div>
        }>
          <RecentActivity analyses={analyses} />
        </Suspense>
        <QuickActions onNewAnalysis={() => setIsModalOpen(true)} />
      </div>

      <NewAnalysisModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleNewAnalysis}
      />
    </div>
  );
}
