'use client';

import React from 'react';
import { BookOpen } from 'lucide-react';

interface StudyNoteSectionProps {
  notes: string[];
}

export const StudyNoteSection: React.FC<StudyNoteSectionProps> = ({ notes }) => {
  if (!notes || notes.length === 0) {
    return (
      <div className="text-gray-400 text-center py-4">
        No study notes available for this video.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h4 className="text-lg font-medium text-white flex items-center gap-2">
        <BookOpen className="w-5 h-5" />
        Study Notes
      </h4>

      <div className="grid gap-4">
        {notes.map((note, index) => (
          <div 
            key={index}
            className="bg-[#1E2235] hover:bg-[#252940] p-6 rounded-xl border border-gray-800 transition-colors duration-200"
          >
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-full flex items-center justify-center font-semibold">
                {index + 1}
              </div>
              <p className="text-gray-300 text-lg leading-relaxed">
                {note}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Note count indicator */}
      <div className="text-sm text-gray-400 text-right">
        {notes.length} key notes from the video
      </div>
    </div>
  );
};
