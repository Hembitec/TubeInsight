'use client';

import { ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';

export function FAQ({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-gray-800 pb-4">
      <button
        className="w-full flex justify-between items-center py-4"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="text-lg font-semibold">{question}</span>
        {isOpen ? (
          <ChevronUp className="w-5 h-5 text-gray-400" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-400" />
        )}
      </button>
      {isOpen && (
        <p className="text-gray-400 pt-2 pb-4">{answer}</p>
      )}
    </div>
  );
}
