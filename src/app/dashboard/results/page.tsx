'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useAuth } from '@/contexts/AuthContext';
import Image from 'next/image';
import { Trash2, X } from 'lucide-react';

interface Analysis {
  id: string;
  created_at: string;
  url: string;
  video_id: string;
  user_id: string;
  metadata: {
    id: string;
    snippet: {
      title: string;
      description: string;
      channelTitle: string;
      publishedAt: string;
    };
    statistics: {
      viewCount: string;
      likeCount: string;
    };
    contentDetails: {
      duration: string;
    };
  };
  analysis: {
    executiveSummary: string;
    detailedSummary: string;
    keyTakeaways: string[];
    educationalContent: {
      quizQuestions: Array<{ question: string; answer: string }>;
      keyTerms: Array<{ term: string; definition: string }>;
      studyNotes: string[];
    };
    researchAnalysis: {
      quality: string;
      biases: string;
      furtherResearch: string;
    };
  };
}

interface DeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isDeleting: boolean;
  title: string;
}

interface HistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  analyses: Analysis[];
  onSelect: (analysis: Analysis) => void;
  currentAnalysisId?: string;
}

function DeleteConfirmationModal({ isOpen, onClose, onConfirm, isDeleting, title }: DeleteModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 transition-opacity duration-200">
      <div 
        className="bg-gray-900 rounded-xl p-6 max-w-md w-full mx-4 relative border border-gray-800 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-red-500 w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg border-4 border-gray-900">
          <Trash2 className="w-8 h-8 text-white" />
        </div>
        
        <div className="mt-4 text-center">
          <h3 className="text-xl font-semibold text-white mb-2">Delete Analysis</h3>
          <p className="text-gray-400 text-sm mb-6">
            Are you sure you want to delete this analysis? This action cannot be undone.
          </p>
          <div className="text-gray-300 bg-gray-800/50 rounded-lg p-3 mb-6">
            <span className="line-clamp-1">{title}</span>
          </div>
        </div>
        
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg transition-colors font-medium"
            disabled={isDeleting}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            disabled={isDeleting}
          >
            {isDeleting ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span>Deleting...</span>
              </>
            ) : (
              'Delete'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

function HistoryModal({ isOpen, onClose, analyses, onSelect, currentAnalysisId }: HistoryModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-gray-900 rounded-xl p-6 max-w-2xl w-full mx-4 relative border border-gray-800 shadow-2xl max-h-[80vh] overflow-hidden flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-white">Analysis History</h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>
        
        <div className="overflow-y-auto flex-1 space-y-4">
          {analyses.map((analysis) => (
            <div
              key={analysis.id}
              className={`bg-gray-800 rounded-lg p-4 cursor-pointer hover:bg-gray-700 transition-colors ${
                currentAnalysisId === analysis.id ? 'ring-2 ring-blue-500' : ''
              }`}
              onClick={() => {
                onSelect(analysis);
                onClose();
              }}
            >
              <div className="flex gap-4">
                <div className="relative w-32 h-20 flex-shrink-0">
                  <Image
                    src={`https://img.youtube.com/vi/${analysis.video_id}/mqdefault.jpg`}
                    alt={analysis.metadata.snippet.title}
                    fill
                    className="object-cover rounded-lg"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-white font-medium mb-1 line-clamp-1">
                    {analysis.metadata.snippet.title}
                  </h3>
                  <p className="text-gray-400 text-sm">
                    {analysis.metadata.snippet.channelTitle}
                  </p>
                  <p className="text-gray-500 text-sm">
                    Analyzed on {new Date(analysis.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function ResultsPage() {
  const [analyses, setAnalyses] = useState<Analysis[]>([]);
  const [selectedAnalysis, setSelectedAnalysis] = useState<Analysis | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    analysisId: string | null;
    title: string;
  }>({
    isOpen: false,
    analysisId: null,
    title: ''
  });
  const [historyModal, setHistoryModal] = useState<{
    isOpen: boolean;
  }>({
    isOpen: false,
  });
  
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const supabase = createClientComponentClient();
  const router = useRouter();

  useEffect(() => {
    const fetchAnalyses = async () => {
      if (!user?.id) return;

      try {
        const { data, error } = await supabase
          .from('analyses')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (error) {
          throw error;
        }

        if (data) {
          setAnalyses(data);
          // Automatically set the most recent analysis (first item) as selected
          if (data.length > 0 && !selectedAnalysis) {
            setSelectedAnalysis(data[0]);
          }
        }
      } catch (error) {
        console.error('Error fetching analyses:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnalyses();
  }, [user, supabase]);

  function getVideoThumbnail(videoId: string) {
    return `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`;
  }

  const handleDelete = async () => {
    if (!user?.id || !deleteModal.analysisId) return;
    
    try {
      setIsDeleting(deleteModal.analysisId);

      const { error } = await supabase
        .from('analyses')
        .delete()
        .eq('id', deleteModal.analysisId);

      if (error) {
        console.error('Delete error:', error);
        throw error;
      }

      // Update local state
      setAnalyses(prevAnalyses => prevAnalyses.filter(a => a.id !== deleteModal.analysisId));
      if (selectedAnalysis?.id === deleteModal.analysisId) {
        setSelectedAnalysis(null);
      }

    } catch (error) {
      console.error('Error deleting analysis:', error);
      alert('Failed to delete analysis. Please try again.');
    } finally {
      setIsDeleting(null);
      setDeleteModal({ isOpen: false, analysisId: null, title: '' });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Show empty state only if there are no analyses at all
  if (analyses.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-white mb-2">No Analyses Yet</h2>
          <p className="text-gray-400 mb-4">Start by analyzing a YouTube video to see your results here.</p>
          <button
            onClick={() => router.push('/dashboard')}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            Analyze New Video
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <DeleteConfirmationModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, analysisId: null, title: '' })}
        onConfirm={handleDelete}
        isDeleting={!!isDeleting}
        title={deleteModal.title}
      />
      <HistoryModal
        isOpen={historyModal.isOpen}
        onClose={() => setHistoryModal({ isOpen: false })}
        analyses={analyses}
        onSelect={(analysis) => setSelectedAnalysis(analysis)}
        currentAnalysisId={selectedAnalysis?.id}
      />
      
      <div className="container mx-auto px-4 py-8">
        {selectedAnalysis ? (
          <div className="max-w-5xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-white">Analysis Results</h1>
              <button
                onClick={() => setHistoryModal({ isOpen: true })}
                className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors flex items-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                History
              </button>
            </div>

            <div className="bg-[#1a1f2e] p-6 rounded-xl">
              <div className="flex gap-5">
                {/* Left side - Video Thumbnail */}
                <div className="relative w-[255px] h-[150px] flex-shrink-0">
                  <Image
                    src={`https://img.youtube.com/vi/${selectedAnalysis.video_id}/maxresdefault.jpg`}
                    alt={selectedAnalysis.metadata?.snippet?.title || 'Video thumbnail'}
                    fill
                    className="object-cover rounded-lg"
                    priority
                  />
                </div>

                {/* Right side - Video Info */}
                <div className="flex-1 min-w-0 py-1">
                  {/* Title and Channel */}
                  <h2 className="text-xl font-semibold text-white mb-2 line-clamp-1">
                    {selectedAnalysis.metadata?.snippet?.title || 'YouTube Video'}
                  </h2>
                  <p className="text-[#94a3b8] mb-3 text-sm">
                    {selectedAnalysis.metadata?.snippet?.channelTitle || 'Unknown Channel'}
                  </p>

                  {/* Stats Row */}
                  <div className="flex items-center gap-4 text-[#94a3b8] text-sm mb-5">
                    <div className="flex items-center gap-1.5">
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      {selectedAnalysis.metadata?.contentDetails?.duration || 'PT0M0S'} min
                    </div>
                    <div className="flex items-center gap-1.5">
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      {selectedAnalysis.metadata?.statistics?.viewCount 
                        ? `${parseInt(selectedAnalysis.metadata.statistics.viewCount).toLocaleString()} views`
                        : '0 views'}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      {selectedAnalysis.metadata?.statistics?.likeCount 
                        ? `${parseInt(selectedAnalysis.metadata.statistics.likeCount).toLocaleString()} likes`
                        : '0 likes'}
                    </div>
                    <div>
                      {new Date(selectedAnalysis.created_at).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    <a
                      href={`https://youtube.com/watch?v=${selectedAnalysis.video_id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors font-medium text-sm"
                    >
                      Watch on YouTube
                    </a>
                    <button
                      onClick={() => {/* Add reanalyze function */}}
                      className="px-5 py-2 bg-[#3b82f6] hover:bg-blue-600 text-white rounded-lg transition-colors font-medium text-sm"
                    >
                      Reanalyze Video
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Analysis Content */}
            <div className="bg-[#1a1f2e] mt-6 p-6 rounded-xl">
              <div className="space-y-6">
                <section>
                  <h3 className="text-xl font-semibold text-white mb-3">Executive Summary</h3>
                  <p className="text-gray-300">{selectedAnalysis.analysis.executiveSummary}</p>
                </section>

                <section>
                  <h3 className="text-xl font-semibold text-white mb-3">Detailed Summary</h3>
                  <p className="text-gray-300 whitespace-pre-line">{selectedAnalysis.analysis.detailedSummary}</p>
                </section>

                <section>
                  <h3 className="text-xl font-semibold text-white mb-3">Key Takeaways</h3>
                  <ul className="list-disc list-inside space-y-2">
                    {selectedAnalysis.analysis.keyTakeaways.map((point, index) => (
                      <li key={index} className="text-gray-300">{point}</li>
                    ))}
                  </ul>
                </section>

                <section>
                  <h3 className="text-xl font-semibold text-white mb-3">Educational Content</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-lg font-medium text-white mb-2">Quiz Questions</h4>
                      <div className="space-y-3">
                        {selectedAnalysis.analysis.educationalContent.quizQuestions.map((qa, index) => (
                          <div key={index} className="bg-gray-700 rounded-lg p-4">
                            <p className="text-white font-medium mb-2">Q: {qa.question}</p>
                            <p className="text-gray-300">A: {qa.answer}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-lg font-medium text-white mb-2">Key Terms</h4>
                      <div className="grid gap-3">
                        {selectedAnalysis.analysis.educationalContent.keyTerms.map((term, index) => (
                          <div key={index} className="bg-gray-700 rounded-lg p-4">
                            <p className="text-white font-medium mb-1">{term.term}</p>
                            <p className="text-gray-300">{term.definition}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-lg font-medium text-white mb-2">Study Notes</h4>
                      <ul className="list-disc list-inside space-y-2">
                        {selectedAnalysis.analysis.educationalContent.studyNotes.map((note, index) => (
                          <li key={index} className="text-gray-300">{note}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </section>

                <section>
                  <h3 className="text-xl font-semibold text-white mb-3">Research Analysis</h3>
                  <div className="space-y-3">
                    <div>
                      <h4 className="text-lg font-medium text-white mb-1">Content Quality</h4>
                      <p className="text-gray-300">{selectedAnalysis.analysis.researchAnalysis.quality}</p>
                    </div>
                    <div>
                      <h4 className="text-lg font-medium text-white mb-1">Potential Biases</h4>
                      <p className="text-gray-300">{selectedAnalysis.analysis.researchAnalysis.biases}</p>
                    </div>
                    <div>
                      <h4 className="text-lg font-medium text-white mb-1">Further Research</h4>
                      <p className="text-gray-300">{selectedAnalysis.analysis.researchAnalysis.furtherResearch}</p>
                    </div>
                  </div>
                </section>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <h2 className="text-xl font-semibold text-white mb-2">No Analysis Selected</h2>
              <p className="text-gray-400 mb-4">Select an analysis from history or analyze a new video</p>
              <button
                onClick={() => setHistoryModal({ isOpen: true })}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                View History
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
