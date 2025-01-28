'use client';

import React from 'react';
import { Book } from 'lucide-react';

interface Term {
  term: string;
  definition: string;
}

interface TerminologySectionProps {
  terms: Term[];
}

export const TerminologySection: React.FC<TerminologySectionProps> = ({ terms }) => {
  if (!terms || terms.length === 0) {
    return (
      <div className="text-gray-400 text-center py-4">
        No terminology entries available for this video.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h4 className="text-lg font-medium text-white flex items-center gap-2">
        <Book className="w-5 h-5" />
        Key Terms
      </h4>

      <div className="grid gap-4">
        {terms.map((item, index) => (
          <div 
            key={index}
            className="bg-[#1E2235] hover:bg-[#252940] p-6 rounded-xl border border-gray-800 transition-colors duration-200"
          >
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-full flex items-center justify-center font-semibold">
                  {index + 1}
                </div>
                <h5 className="text-lg font-semibold text-white">
                  {item.term}
                </h5>
              </div>
              <div className="pl-11">
                <p className="text-gray-300 text-base leading-relaxed">
                  {item.definition}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Term count indicator */}
      <div className="text-sm text-gray-400 text-right">
        {terms.length} key terms explained
      </div>
    </div>
  );
};
