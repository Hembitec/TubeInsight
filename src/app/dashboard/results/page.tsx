'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useAuth } from '@/contexts/AuthContext';
import Image from 'next/image';

interface Analysis {
  id: string;
  created_at: string;
  url: string;
  video_id: string;
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

export default function ResultsPage() {
  const [analyses, setAnalyses] = useState<Analysis[]>([]);
  const [selectedAnalysis, setSelectedAnalysis] = useState<Analysis | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const supabase = createClientComponentClient();

  function getVideoThumbnail(videoId: string) {
    return `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`;
  }

  useEffect(() => {
    const fetchAnalyses = async () => {
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
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnalyses();
  }, [supabase, searchParams]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Analyses List */}
        <div className="lg:col-span-1 space-y-4">
          <h2 className="text-xl font-semibold text-white mb-4">Your Analyses</h2>
          <div className="space-y-4">
            {analyses.map((analysis) => (
              <div
                key={analysis.id}
                onClick={() => setSelectedAnalysis(analysis)}
                className={`bg-gray-800 rounded-lg overflow-hidden cursor-pointer transform hover:scale-105 transition-transform duration-200 ${
                  selectedAnalysis?.id === analysis.id ? 'ring-2 ring-blue-500' : ''
                }`}
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
            ))}
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
  );
}
