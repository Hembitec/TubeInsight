import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { formatDuration, formatPublishDate } from '@/utils/formatters';
import Image from 'next/image';

interface Analysis {
  id: string;
  video_id: string;
  metadata: any;
  created_at: string;
}

interface HistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentAnalysisId?: string;
  onSelectAnalysis: (analysis: Analysis) => void;
  analyses?: Analysis[];
}

export default function HistoryModal({ 
  isOpen, 
  onClose, 
  currentAnalysisId,
  onSelectAnalysis,
  analyses: initialAnalyses 
}: HistoryModalProps) {
  const [analyses, setAnalyses] = useState<Analysis[]>(initialAnalyses || []);
  const [loading, setLoading] = useState(!initialAnalyses);
  const [searchTerm, setSearchTerm] = useState('');
  const supabase = createClientComponentClient();

  useEffect(() => {
    if (isOpen && !initialAnalyses) {
      fetchAnalyses();
    } else if (initialAnalyses) {
      setAnalyses(initialAnalyses);
      setLoading(false);
    }
  }, [isOpen, initialAnalyses]);

  const fetchAnalyses = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) return;

      const { data, error } = await supabase
        .from('analyses')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      setAnalyses(data || []);
    } catch (error) {
      console.error('Error fetching analyses:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredAnalyses = analyses.filter(analysis => 
    analysis.metadata?.snippet?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    analysis.metadata?.snippet?.channelTitle?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div 
        className="bg-gradient-to-b from-[#1a1f2e] to-[#151822] rounded-xl w-full max-w-4xl max-h-[85vh] flex flex-col shadow-2xl border border-gray-800"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-800 flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-white">Analysis History</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-gray-800 rounded-lg"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          {/* Search Bar */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search videos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-gray-900/50 text-white placeholder-gray-400 rounded-lg px-4 py-2.5 pl-10 border border-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
            />
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>
        
        {/* Content */}
        <div className="overflow-y-auto flex-1 p-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12 gap-3">
              <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-gray-400">Loading your analysis history...</p>
            </div>
          ) : filteredAnalyses.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 text-gray-600">
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                  />
                </svg>
              </div>
              <p className="text-lg text-gray-400 mb-2">No analyses found</p>
              <p className="text-sm text-gray-500">
                {searchTerm ? 'Try different search terms' : 'Start by analyzing a video'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {filteredAnalyses.map((analysis) => (
                <button
                  key={analysis.id}
                  onClick={() => onSelectAnalysis(analysis)}
                  className={`group w-full text-left rounded-xl transition-all duration-200 ${
                    analysis.id === currentAnalysisId
                      ? 'bg-blue-600 hover:bg-blue-700 ring-2 ring-blue-400'
                      : 'bg-gray-800/50 hover:bg-gray-800 hover:scale-[1.02]'
                  } overflow-hidden`}
                >
                  <div className="flex gap-4 p-4">
                    {/* Thumbnail */}
                    <div className="relative w-[160px] h-[90px] flex-shrink-0 rounded-lg overflow-hidden group-hover:ring-2 ring-white/10 transition-all">
                      <Image
                        src={`https://img.youtube.com/vi/${analysis.video_id}/mqdefault.jpg`}
                        alt={analysis.metadata?.snippet?.title || 'Video thumbnail'}
                        fill
                        className="object-cover"
                        priority
                      />
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-all"></div>
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-white mb-1.5 line-clamp-1 group-hover:text-blue-200 transition-colors">
                        {analysis.metadata?.snippet?.title || 'Untitled Video'}
                      </h3>
                      <p className="text-sm text-gray-400 mb-2 line-clamp-1 group-hover:text-gray-300 transition-colors">
                        {analysis.metadata?.snippet?.channelTitle || 'Unknown Channel'}
                      </p>
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
                        <span className="text-gray-400 flex items-center gap-1.5">
                          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {analysis.metadata?.contentDetails?.duration
                            ? formatDuration(analysis.metadata.contentDetails.duration)
                            : '0:00'}
                        </span>
                        <span className="text-gray-500">•</span>
                        <span className="text-gray-400 flex items-center gap-1.5">
                          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          {formatPublishDate(analysis.created_at)}
                        </span>
                        {analysis.metadata?.statistics?.viewCount && (
                          <>
                            <span className="text-gray-500">•</span>
                            <span className="text-gray-400 flex items-center gap-1.5">
                              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                              </svg>
                              {parseInt(analysis.metadata.statistics.viewCount).toLocaleString()} views
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
