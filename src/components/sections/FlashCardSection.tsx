'use client';

import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface FlashCard {
  front: string;
  back: string;
}

interface FlashCardSectionProps {
  cards: FlashCard[];
}

export const FlashCardSection: React.FC<FlashCardSectionProps> = ({ cards }) => {
  const [currentCard, setCurrentCard] = useState(0);
  const progress = ((currentCard + 1) / cards.length) * 100;

  const handleNext = () => {
    if (currentCard < cards.length - 1) {
      setCurrentCard(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentCard > 0) {
      setCurrentCard(prev => prev - 1);
    }
  };

  const handleDotClick = (index: number) => {
    setCurrentCard(index);
  };

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') handlePrevious();
      if (e.key === 'ArrowRight') handleNext();
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [currentCard]);

  if (!cards || cards.length === 0) {
    return (
      <div className="text-gray-400 text-center py-4">
        No flash cards available for this video.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h4 className="text-lg font-medium text-white">Flash Cards</h4>
      
      <div className="space-y-2">
        <div className="flex justify-between items-center text-sm text-gray-400">
          <span>Card {currentCard + 1} of {cards.length}</span>
          <span>{Math.round(progress)}% Complete</span>
        </div>
        
        {/* Progress bar */}
        <div className="h-1.5 bg-gray-700/20 rounded-full mt-2">
          <div 
            className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Card Content */}
      <div className="bg-gradient-to-br from-purple-100 via-indigo-50 to-violet-100 rounded-2xl p-8 min-h-[400px] flex flex-col items-center justify-center shadow-lg border border-purple-100">
        <div className="w-full max-w-3xl mx-auto flex flex-col items-center justify-center flex-1">
          <h3 className="text-2xl font-bold text-center mb-8 bg-gradient-to-r from-purple-700 to-indigo-700 bg-clip-text text-transparent">
            {cards[currentCard].front}
          </h3>
          <div className="w-full">
            <p className="text-gray-800 text-lg leading-relaxed whitespace-pre-line text-center">
              {cards[currentCard].back}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation dots and arrows */}
      <div className="flex items-center justify-center gap-3 py-4">
        <button
          onClick={handlePrevious}
          disabled={currentCard === 0}
          className={`p-2 rounded-lg transition-colors ${
            currentCard === 0 
              ? 'text-gray-600 cursor-not-allowed' 
              : 'text-purple-500 hover:bg-purple-100 hover:text-purple-700'
          }`}
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        {cards.map((_, index) => (
          <button
            key={index}
            onClick={() => handleDotClick(index)}
            className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
              index === currentCard 
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 w-8' 
                : 'bg-gray-600 hover:bg-purple-500'
            }`}
          />
        ))}

        <button
          onClick={handleNext}
          disabled={currentCard === cards.length - 1}
          className={`p-2 rounded-lg transition-colors ${
            currentCard === cards.length - 1
              ? 'text-gray-600 cursor-not-allowed'
              : 'text-purple-500 hover:bg-purple-100 hover:text-purple-700'
          }`}
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>

      {/* Keyboard shortcuts */}
      <div className="flex justify-center items-center gap-4 text-sm text-gray-400 mt-4">
        <div className="flex items-center gap-1">
          <kbd className="px-2 py-1 bg-gray-800 rounded">←</kbd>
          <span>Previous</span>
        </div>
        <div className="flex items-center gap-1">
          <kbd className="px-2 py-1 bg-gray-800 rounded">→</kbd>
          <span>Next</span>
        </div>
      </div>
    </div>
  );
};
