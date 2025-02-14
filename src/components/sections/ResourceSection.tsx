import React, { useState, useEffect, useRef } from 'react';
import { Download, Loader2, ChevronDown } from 'lucide-react';
import { toast } from 'sonner';

interface ResourceItemProps {
  title: string;
  defaultFormat?: 'PDF' | 'TXT';
  onDownload: (format: 'PDF' | 'TXT') => Promise<void>;
  isLoading?: boolean;
  allowFormatSelection?: boolean;
}

const ResourceItem: React.FC<ResourceItemProps> = ({ 
  title, 
  defaultFormat = 'PDF',
  onDownload, 
  isLoading,
  allowFormatSelection = false
}) => {
  const [localLoading, setLocalLoading] = useState(false);
  const [isFormatMenuOpen, setIsFormatMenuOpen] = useState(false);
  const [selectedFormat, setSelectedFormat] = useState<'PDF' | 'TXT'>(defaultFormat);
  const menuRef = useRef<HTMLDivElement>(null);
  
  const isTextFile = selectedFormat === 'TXT';

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsFormatMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleDownload = async () => {
    if (localLoading || isLoading) return;
    
    setLocalLoading(true);
    try {
      await onDownload(selectedFormat);
      toast.success(`${title} download started`);
    } catch (error) {
      console.error('Download error:', error);
      toast.error('Failed to download file. Please try again.');
    } finally {
      setLocalLoading(false);
    }
  };

  const loading = localLoading || isLoading;

  return (
    <div className="flex items-center justify-between p-4 bg-[#1E2235] rounded-lg hover:bg-[#252B43] transition-colors group">
      <div className="flex items-center gap-3">
        <div className={`text-sm font-medium px-2 py-1 rounded ${
          isTextFile ? 'bg-blue-500/10 text-blue-400' : 'bg-red-500/10 text-red-400'
        }`}>
          {selectedFormat}
        </div>
        <span className="text-gray-300 group-hover:text-gray-200 transition-colors">{title}</span>
      </div>
      <div className="flex items-center gap-2">
        {allowFormatSelection && (
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setIsFormatMenuOpen(!isFormatMenuOpen)}
              className="p-2 hover:bg-gray-700/50 rounded-lg transition-colors flex items-center gap-1 text-sm text-gray-400 hover:text-gray-300"
              aria-label="Select format"
            >
              Format <ChevronDown className="w-4 h-4" />
            </button>
            {isFormatMenuOpen && (
              <div className="absolute right-0 mt-2 w-32 bg-[#252B43] rounded-lg shadow-lg overflow-hidden z-10 border border-gray-700">
                <button
                  onClick={() => {
                    setSelectedFormat('PDF');
                    setIsFormatMenuOpen(false);
                  }}
                  className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-700/50 transition-colors ${
                    selectedFormat === 'PDF' ? 'text-blue-400' : 'text-gray-300'
                  }`}
                >
                  PDF
                </button>
                <button
                  onClick={() => {
                    setSelectedFormat('TXT');
                    setIsFormatMenuOpen(false);
                  }}
                  className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-700/50 transition-colors ${
                    selectedFormat === 'TXT' ? 'text-blue-400' : 'text-gray-300'
                  }`}
                >
                  TXT
                </button>
              </div>
            )}
          </div>
        )}
        <button
          onClick={handleDownload}
          disabled={loading}
          className="p-2 hover:bg-gray-700/50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed group/btn relative"
          title={loading ? 'Downloading...' : `Download as ${selectedFormat}`}
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 text-gray-400 animate-spin" />
              <span className="sr-only">Downloading...</span>
            </>
          ) : (
            <>
              <Download className="w-5 h-5 text-gray-400 group-hover/btn:text-gray-300 transition-colors" />
              <span className="sr-only">Download {title}</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

interface ResourceSectionProps {
  title: string;
  children: React.ReactNode;
}

export const ResourceSection: React.FC<ResourceSectionProps> = ({ title, children }) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-white">{title}</h3>
      <div className="space-y-3">
        {children}
      </div>
    </div>
  );
};

export { ResourceItem };
