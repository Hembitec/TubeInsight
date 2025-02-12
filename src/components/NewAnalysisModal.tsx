'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { X, Youtube, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface NewAnalysisModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (url: string) => void;
}

export default function NewAnalysisModal({ isOpen, onClose, onSubmit }: NewAnalysisModalProps) {
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [videoId, setVideoId] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const match = url.match(/^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)/);
    if (match) {
      setVideoId(match[4]);
      setShowPreview(false);
      setIframeLoaded(false);
      setTimeout(() => setShowPreview(true), 500); // Add a delay before showing the preview
    } else {
      setVideoId('');
      setShowPreview(false);
      setIframeLoaded(false);
    }
  }, [url]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;
    setError('');
    setIsLoading(true);

    try {
      // Validate YouTube URL
      if (!url.match(/^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)[a-zA-Z0-9_-]+/)) {
        throw new Error('Please enter a valid YouTube URL');
      }

      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url, userId: user?.id }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to analyze video');
      }

      // Immediately redirect to results page with the analysis ID
      if (data.id) {
        router.push(`/results?id=${data.id}`);
      } else {
        router.push(`/results?url=${encodeURIComponent(url)}`);
      }
      
      onSubmit(url);
      handleClose();
    } catch (error) {
      console.error('Analysis error:', error);
      setError(error instanceof Error ? error.message : 'An error occurred');
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setUrl('');
    setError('');
    setIsLoading(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#1F2937] rounded-lg w-full max-w-md">
        <div className="flex justify-between items-center p-4 border-b border-gray-700">
          <h2 className="text-lg font-medium text-white flex items-center gap-2">
            <Youtube className="w-5 h-5" />
            Analyze New Video
          </h2>
          <button 
            onClick={handleClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="p-4">
            <label className="block text-gray-400 mb-2">YouTube URL</label>
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://youtube.com/watch?v=..."
              className="w-full p-2.5 bg-gray-900 rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {videoId && showPreview && (
              <div 
                className={`mt-4 rounded-md overflow-hidden transition-all duration-500 ease-in-out ${
                  iframeLoaded ? 'opacity-100 max-h-[200px]' : 'opacity-0 max-h-0'
                }`}
              >
                <iframe
                  width="100%"
                  height="200"
                  src={`https://www.youtube.com/embed/${videoId}`}
                  title="YouTube video player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  onLoad={() => setIframeLoaded(true)}
                  style={{ display: iframeLoaded ? 'block' : 'none' }}
                ></iframe>
              </div>
            )}
            {error && (
              <p className="mt-2 text-sm text-red-500">{error}</p>
            )}
          </div>
          <div className="flex justify-end gap-3 p-4 border-t border-gray-700">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                'Analyze'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
