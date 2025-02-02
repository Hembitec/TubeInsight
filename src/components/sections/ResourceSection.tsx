import React from 'react';
import { Download, Loader2 } from 'lucide-react';

interface ResourceItemProps {
  title: string;
  fileType: 'PDF' | 'TXT';
  onDownload: () => void;
  isLoading?: boolean;
}

const ResourceItem: React.FC<ResourceItemProps> = ({ title, fileType, onDownload, isLoading }) => {
  return (
    <div className="flex items-center justify-between p-4 bg-[#1E2235] rounded-lg">
      <div className="flex items-center gap-3">
        <div className={`text-sm font-medium px-2 py-1 rounded ${
          fileType === 'PDF' ? 'bg-red-500/10 text-red-400' : 'bg-blue-500/10 text-blue-400'
        }`}>
          {fileType}
        </div>
        <span className="text-gray-300">{title}</span>
      </div>
      <button
        onClick={onDownload}
        disabled={isLoading}
        className="p-2 hover:bg-gray-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        title={isLoading ? 'Downloading...' : 'Download'}
      >
        {isLoading ? (
          <Loader2 className="w-5 h-5 text-gray-400 animate-spin" />
        ) : (
          <Download className="w-5 h-5 text-gray-400 hover:text-gray-300" />
        )}
      </button>
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
