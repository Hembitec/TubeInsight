'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useAuth } from '@/contexts/AuthContext';
import Image from 'next/image';
import { Trash2 } from 'lucide-react';
import { formatDuration, formatPublishDate } from '@/utils/formatters';
import HistoryModal from '@/components/HistoryModal';
import { Analysis } from '@/types/analysis';

interface DeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isDeleting: boolean;
  title: string;
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

export default function ResultsPage() {
  const [analyses, setAnalyses] = useState<Analysis[]>([]);
  const [selectedAnalysis, setSelectedAnalysis] = useState<Analysis | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [isReanalyzing, setIsReanalyzing] = useState(false);
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

  const handleReanalyze = async () => {
    if (!selectedAnalysis || isReanalyzing) return;
    
    setIsReanalyzing(true);
    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: selectedAnalysis.url }),
      });

      if (!response.ok) {
        throw new Error('Failed to reanalyze video');
      }

      const updatedAnalysis = await response.json();
      
      setAnalyses(prevAnalyses => 
        prevAnalyses.map(analysis => 
          analysis.id === updatedAnalysis.id ? updatedAnalysis : analysis
        )
      );
      setSelectedAnalysis(updatedAnalysis);
    } catch (error) {
      console.error('Reanalysis error:', error);
    } finally {
      setIsReanalyzing(false);
    }
  };

  const handleDelete = async (analysisId: string) => {
    if (!user?.id || !analysisId) return;
    
    try {
      setIsDeleting(analysisId);

      const { error } = await supabase
        .from('analyses')
        .delete()
        .eq('id', analysisId);

      if (error) {
        console.error('Delete error:', error);
        throw error;
      }

      setAnalyses(prevAnalyses => prevAnalyses.filter(a => a.id !== analysisId));
      if (selectedAnalysis?.id === analysisId) {
        const nextAnalysis = analyses.find(a => a.id !== analysisId);
        setSelectedAnalysis(nextAnalysis || null);
      }

    } catch (error) {
      console.error('Error deleting analysis:', error);
      throw error;
    } finally {
      setIsDeleting(null);
    }
  };

  useEffect(() => {
    const fetchAnalyses = async () => {
      if (!user?.id) return;

      try {
        const { data: analyses, error } = await supabase
          .from('analyses')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (error) throw error;

        const updatedAnalyses = await Promise.all(
          analyses.map(async (analysis) => {
            try {
              if (!analysis.metadata?.snippet?.publishedAt || !analysis.metadata?.contentDetails?.duration) {
                const response = await fetch('/api/analyze', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ url: analysis.url }),
                });
                
                if (response.ok) {
                  const updatedAnalysis = await response.json();
                  return updatedAnalysis;
                }
              }
            } catch (error) {
              console.error('Error updating analysis metadata:', error);
            }
            return analysis;
          })
        );

        setAnalyses(updatedAnalyses);

        const analysisId = searchParams.get('id');
        if (analysisId) {
          const analysis = updatedAnalyses.find(a => a.id === analysisId);
          if (analysis) setSelectedAnalysis(analysis);
        } else {
          setSelectedAnalysis(updatedAnalyses[0]);
        }
      } catch (error) {
        console.error('Error fetching analyses:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnalyses();
  }, [user?.id, supabase, searchParams]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

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
        onConfirm={() => deleteModal.analysisId && handleDelete(deleteModal.analysisId)}
        isDeleting={!!isDeleting}
        title={deleteModal.title}
      />
      <HistoryModal 
        isOpen={historyModal.isOpen}
        onClose={() => setHistoryModal({ isOpen: false })}
        currentAnalysisId={selectedAnalysis?.id}
        analyses={analyses}
        onSelectAnalysis={(analysis: Analysis) => {
          setSelectedAnalysis(() => analysis);
          setHistoryModal({ isOpen: false });
        }}
        onDeleteAnalysis={handleDelete}
      />
      
      <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8">
        {selectedAnalysis ? (
          <div className="max-w-5xl mx-auto">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 gap-3">
              <h1 className="text-xl sm:text-2xl font-bold text-white">Analysis Results</h1>
              <button
                onClick={() => setHistoryModal({ isOpen: true })}
                className="w-full sm:w-auto px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                History
              </button>
            </div>

            <div className="bg-[#1a1f2e] p-4 sm:p-6 rounded-xl">
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-5">
                <div className="relative w-full sm:w-[255px] h-[200px] sm:h-[150px] flex-shrink-0">
                  <Image
                    src={`https://img.youtube.com/vi/${selectedAnalysis.video_id}/maxresdefault.jpg`}
                    alt={selectedAnalysis.metadata?.snippet?.title || 'Video thumbnail'}
                    fill
                    className="object-cover rounded-lg"
                    priority
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <h2 className="text-lg sm:text-xl font-semibold text-white mb-2 line-clamp-2 sm:line-clamp-1">
                    {selectedAnalysis.metadata?.snippet?.title || 'YouTube Video'}
                  </h2>
                  <p className="text-[#94a3b8] mb-3 text-sm">
                    {selectedAnalysis.metadata?.snippet?.channelTitle || 'Unknown Channel'}
                  </p>

                  <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-[#94a3b8] text-sm mb-4 sm:mb-5">
                    <div className="flex items-center gap-1.5">
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      {selectedAnalysis.metadata?.contentDetails?.duration 
                        ? formatDuration(selectedAnalysis.metadata.contentDetails.duration)
                        : '0:00'}
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
                      {selectedAnalysis.metadata?.snippet?.publishedAt 
                        ? formatPublishDate(selectedAnalysis.metadata.snippet.publishedAt)
                        : formatPublishDate(selectedAnalysis.created_at)}
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                    <a
                      href={`https://youtube.com/watch?v=${selectedAnalysis.video_id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors font-medium text-sm text-center"
                    >
                      Watch on YouTube
                    </a>
                    <button
                      onClick={handleReanalyze}
                      disabled={isReanalyzing}
                      className="px-5 py-2 bg-[#3b82f6] hover:bg-blue-600 text-white rounded-lg transition-colors font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {isReanalyzing ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                          <span>Reanalyzing...</span>
                        </>
                      ) : (
                        'Reanalyze Video'
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {selectedAnalysis && (
              <div className="space-y-6 mt-6">
                {/* Executive Summary */}
                <div className="bg-[#1a1f2e] p-4 sm:p-6 rounded-xl">
                  <h2 className="text-xl font-semibold text-white mb-4">Executive Summary</h2>
                  <p className="text-[#94a3b8] whitespace-pre-wrap">
                    {selectedAnalysis.analysis?.executiveSummary}
                  </p>
                </div>

                {/* Detailed Summary */}
                <div className="bg-[#1a1f2e] p-4 sm:p-6 rounded-xl">
                  <h2 className="text-xl font-semibold text-white mb-4">Detailed Summary</h2>
                  <p className="text-[#94a3b8] whitespace-pre-wrap">
                    {selectedAnalysis.analysis?.detailedSummary}
                  </p>
                </div>

                {/* Key Takeaways */}
                {selectedAnalysis.analysis?.keyTakeaways && selectedAnalysis.analysis.keyTakeaways.length > 0 && (
                  <div className="bg-[#1a1f2e] p-4 sm:p-6 rounded-xl">
                    <h2 className="text-xl font-semibold text-white mb-4">Key Takeaways</h2>
                    <ul className="list-disc list-inside space-y-2">
                      {selectedAnalysis.analysis.keyTakeaways.map((takeaway, index) => (
                        <li key={index} className="text-[#94a3b8]">{takeaway}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Educational Content */}
                {selectedAnalysis.analysis?.educationalContent && (
                  <div className="space-y-6">
                    {/* Quiz Questions */}
                    {selectedAnalysis.analysis.educationalContent.quizQuestions && 
                     selectedAnalysis.analysis.educationalContent.quizQuestions.length > 0 && (
                      <div className="bg-[#1a1f2e] p-4 sm:p-6 rounded-xl">
                        <h2 className="text-xl font-semibold text-white mb-4">Quiz Questions</h2>
                        <div className="space-y-4">
                          {selectedAnalysis.analysis.educationalContent.quizQuestions.map((quiz, index) => (
                            <div key={index} className="p-4 bg-gray-800/50 rounded-lg">
                              <p className="text-white font-medium mb-2">Q: {quiz.question}</p>
                              <p className="text-[#94a3b8]">A: {quiz.answer}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Key Terms */}
                    {selectedAnalysis.analysis.educationalContent.keyTerms && 
                     selectedAnalysis.analysis.educationalContent.keyTerms.length > 0 && (
                      <div className="bg-[#1a1f2e] p-4 sm:p-6 rounded-xl">
                        <h2 className="text-xl font-semibold text-white mb-4">Key Terms</h2>
                        <div className="space-y-4">
                          {selectedAnalysis.analysis.educationalContent.keyTerms.map((term, index) => (
                            <div key={index} className="p-4 bg-gray-800/50 rounded-lg">
                              <p className="text-white font-medium mb-2">{term.term}</p>
                              <p className="text-[#94a3b8]">{term.definition}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Study Notes */}
                    {selectedAnalysis.analysis.educationalContent.studyNotes && 
                     selectedAnalysis.analysis.educationalContent.studyNotes.length > 0 && (
                      <div className="bg-[#1a1f2e] p-4 sm:p-6 rounded-xl">
                        <h2 className="text-xl font-semibold text-white mb-4">Study Notes</h2>
                        <ul className="list-disc list-inside space-y-2">
                          {selectedAnalysis.analysis.educationalContent.studyNotes.map((note, index) => (
                            <li key={index} className="text-[#94a3b8]">{note}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}

                {/* Research Analysis */}
                {selectedAnalysis.analysis?.researchAnalysis && (
                  <div className="bg-[#1a1f2e] p-4 sm:p-6 rounded-xl">
                    <h2 className="text-xl font-semibold text-white mb-4">Research Analysis</h2>
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-white font-medium mb-2">Content Quality</h3>
                        <p className="text-[#94a3b8] whitespace-pre-wrap">
                          {selectedAnalysis.analysis.researchAnalysis.quality}
                        </p>
                      </div>
                      <div>
                        <h3 className="text-white font-medium mb-2">Potential Biases</h3>
                        <p className="text-[#94a3b8] whitespace-pre-wrap">
                          {selectedAnalysis.analysis.researchAnalysis.biases}
                        </p>
                      </div>
                      <div>
                        <h3 className="text-white font-medium mb-2">Further Research</h3>
                        <p className="text-[#94a3b8] whitespace-pre-wrap">
                          {selectedAnalysis.analysis.researchAnalysis.furtherResearch}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        ) : null}
      </div>
    </>
  );
}
