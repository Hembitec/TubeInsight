import React, { useState } from 'react';
import { 
  BookOpen, 
  Lightbulb, 
  ListChecks,
  ChevronDown,
  ChevronUp,
  Copy,
  Share2,
  List
} from 'lucide-react';

interface SummarySectionProps {
  title: string;
  icon: 'executive' | 'detailed' | 'takeaways' | 'bullets';
  children: React.ReactNode;
}

export const SummarySection: React.FC<SummarySectionProps> = ({
  title,
  icon,
  children
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isCopied, setIsCopied] = useState(false);

  const getIcon = () => {
    switch (icon) {
      case 'executive':
        return <Lightbulb className="w-5 h-5 text-yellow-400" />;
      case 'detailed':
        return <BookOpen className="w-5 h-5 text-blue-400" />;
      case 'takeaways':
        return <ListChecks className="w-5 h-5 text-green-400" />;
      case 'bullets':
        return <List className="w-5 h-5 text-blue-400" />;
      default:
        return null;
    }
  };

  const handleCopy = async () => {
    try {
      const content = document.getElementById(`${title}-content`)?.textContent;
      if (content) {
        await navigator.clipboard.writeText(content);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
      }
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  const handleShare = async () => {
    try {
      const content = document.getElementById(`${title}-content`)?.textContent;
      if (content) {
        await navigator.share({
          title: title,
          text: content
        });
      }
    } catch (err) {
      console.error('Failed to share:', err);
    }
  };

  return (
    <div className="bg-[#1E2235] rounded-xl overflow-hidden transition-all duration-300">
      {/* Header */}
      <div className="p-5 sm:p-6 border-b border-gray-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-opacity-10 flex items-center justify-center"
                style={{ backgroundColor: icon === 'executive' ? 'rgba(234, 179, 8, 0.1)' :
                                      icon === 'detailed' ? 'rgba(59, 130, 246, 0.1)' :
                                      'rgba(34, 197, 94, 0.1)' }}>
              {getIcon()}
            </div>
            <h3 className="text-lg font-semibold text-white">{title}</h3>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
              title="Copy to clipboard"
            >
              <Copy className={`w-4 h-4 ${isCopied ? 'text-green-400' : 'text-gray-400'}`} />
            </button>
            {typeof navigator !== 'undefined' && 
             typeof navigator.share === 'function' && (
              <button
                onClick={handleShare}
                className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                title="Share"
              >
                <Share2 className="w-4 h-4 text-gray-400" />
              </button>
            )}
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
              title={isExpanded ? 'Collapse' : 'Expand'}
            >
              {isExpanded ? (
                <ChevronUp className="w-4 h-4 text-gray-400" />
              ) : (
                <ChevronDown className="w-4 h-4 text-gray-400" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div
        className={`overflow-hidden transition-all duration-300 ${
          isExpanded ? 'opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="p-5 sm:p-6" id={`${title}-content`}>
          {children}
        </div>
      </div>
    </div>
  );
};
