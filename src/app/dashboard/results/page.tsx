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
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    analysisId: string | null;
    title: string;
  }>({
    isOpen: false,
    analysisId: null,
    title: ''
  });
  
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const router = useRouter();
  const supabase = createClientComponentClient();

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

  useEffect(() => {
    const fetchAnalyses = async () => {
      if (!user?.id) {
        setAnalyses([]);
        setIsLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('analyses')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;

        setAnalyses(data || []);

        // If there's an ID in the URL, select that analysis
        const id = searchParams.get('id');
        if (id && data) {
          const analysis = data.find(a => a.id === id);
          if (analysis) setSelectedAnalysis(analysis);
        }
      } catch (error) {
        console.error('Error fetching analyses:', error);
        setAnalyses([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnalyses();
  }, [supabase, searchParams, user]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
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
      
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Analyses List */}
          <div className="lg:col-span-1 space-y-4">
            <h2 className="text-xl font-semibold text-white mb-4">Your Analyses</h2>
            <div className="space-y-4">
              {analyses.map((analysis) => (
                <div
                  key={analysis.id}
                  className={`bg-gray-800 rounded-lg overflow-hidden transform hover:scale-105 transition-transform duration-200 ${
                    selectedAnalysis?.id === analysis.id ? 'ring-2 ring-blue-500' : ''
                  }`}
                >
                  <div className="relative">
                    <div 
                      onClick={() => setSelectedAnalysis(analysis)}
                      className="cursor-pointer"
                    >
                      <div className="relative h-32">
                        <Image
                          src={getVideoThumbnail(analysis.video_id)}
                          alt="Video thumbnail"
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="p-4">
                        <h3 className="text-lg font-semibold text-white mb-2 line-clamp-2">
                          {analysis.metadata?.snippet?.title || 'YouTube Video Analysis'}
                        </h3>
                        <p className="text-gray-400 text-sm">
                          {new Date(analysis.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    
                    {/* Delete Button */}
                    <button
                      onClick={() => setDeleteModal({
                        isOpen: true,
                        analysisId: analysis.id,
                        title: analysis.metadata?.snippet?.title || 'YouTube Video Analysis'
                      })}
                      className="absolute top-2 right-2 p-2 bg-gray-900/80 hover:bg-red-500/20 rounded-lg transition-all duration-200 group"
                      disabled={isDeleting === analysis.id}
                    >
                      <Trash2 className={`w-4 h-4 ${isDeleting === analysis.id ? 'text-gray-500' : 'text-gray-400 group-hover:text-red-400'}`} />
                    </button>
                  </div>
                </div>
              ))}
              
              {analyses.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-gray-400">No analyses yet</p>
                </div>
              )}
            </div>
          </div>

          {/* Analysis Details */}
          <div className="lg:col-span-2">
            {selectedAnalysis ? (
              <div className="bg-gray-800 rounded-lg p-6">
                <div className="relative h-64 mb-6">
                  <Image
                    src={getVideoThumbnail(selectedAnalysis.video_id)}
                    alt="Video thumbnail"
                    fill
                    className="object-cover rounded-lg"
                  />
                </div>

                <h2 className="text-2xl font-bold text-white mb-4">
                  {selectedAnalysis.metadata?.snippet?.title || 'Video Analysis'}
                </h2>

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
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="text-gray-400">Select an analysis to view details</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
