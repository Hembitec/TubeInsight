'use client';

import React, { useState, useRef, useEffect } from 'react';

interface QuizQuestion {
  question: string;
  options: string[];
  answer: string;
  explanation: string;
}

interface QuizSectionProps {
  questions: QuizQuestion[];
}

export const QuizSection: React.FC<QuizSectionProps> = ({ questions }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<string[]>(new Array(questions.length).fill(''));
  const [completed, setCompleted] = useState(false);
  const quizRef = useRef<HTMLDivElement>(null);

  const handleAnswerSelect = (option: string) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = option;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else if (answers.every(answer => answer !== '')) {
      // Only complete if all questions are answered
      setCompleted(true);
    }
  };

  const getScore = () => {
    return answers.reduce((score, answer, index) => 
      answer === questions[index].answer ? score + 1 : score, 0
    );
  };

  const progressPercentage = ((currentQuestion + 1) / questions.length) * 100;

  const handleRestart = () => {
    setCurrentQuestion(0);
    setAnswers(new Array(questions.length).fill(''));
    setCompleted(false);
    if (quizRef.current) {
      quizRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Check if all questions up to current are answered
  const canProceed = answers[currentQuestion] !== '';
  // Check if all questions are answered for submit
  const canSubmit = currentQuestion === questions.length - 1 && answers.every(answer => answer !== '');

  if (completed) {
    const correctAnswers = getScore();
    const score = (correctAnswers / questions.length) * 100;

    return (
      <div ref={quizRef} className="space-y-6">
        <div className="flex items-center gap-2">
          <h2 className="text-2xl font-semibold text-white">Interactive Quiz</h2>
          <div className="w-2 h-2 rounded-full bg-green-500"></div>
        </div>

        <div className="bg-[#1A1D2E] rounded-2xl p-8">
          <div className="flex flex-col items-center">
            <div className="relative w-32 h-32">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle
                  className="text-gray-700"
                  strokeWidth="8"
                  stroke="currentColor"
                  fill="transparent"
                  r="42"
                  cx="50"
                  cy="50"
                />
                <circle
                  className="text-blue-500 transition-all duration-1000"
                  strokeWidth="8"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="transparent"
                  r="42"
                  cx="50"
                  cy="50"
                  strokeDasharray={`${score * 2.64}, ${264 - score * 2.64}`}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-bold text-white">{Math.round(score)}%</span>
              </div>
            </div>
            <p className="mt-4 text-gray-400">{correctAnswers} out of {questions.length} correct</p>
          </div>
        </div>

        <div className="space-y-4">
          {questions.map((question, index) => {
            const userAnswer = answers[index];
            const isCorrect = userAnswer === question.answer;

            return (
              <div key={index} className="bg-[#1A1D2E] rounded-2xl p-6">
                <div className="flex items-start gap-3">
                  <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center ${
                    isCorrect ? 'bg-green-500/10' : 'bg-red-500/10'
                  }`}>
                    <span className={isCorrect ? 'text-green-500' : 'text-red-500'}>
                      {isCorrect ? '✓' : '✗'}
                    </span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-medium text-white mb-4">{question.question}</h3>
                    <div className="space-y-2">
                      {question.options.map((option, optionIndex) => (
                        <div
                          key={optionIndex}
                          className={`p-3 rounded-xl ${
                            option === userAnswer
                              ? isCorrect
                                ? 'bg-green-500/10 text-green-500'
                                : 'bg-red-500/10 text-red-500'
                              : option === question.answer
                              ? 'bg-green-500/10 text-green-500'
                              : 'bg-gray-800 text-gray-400'
                          }`}
                        >
                          {option}
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 p-4 bg-gray-800/50 rounded-xl">
                      <p className="text-gray-300">{question.explanation}</p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex justify-center">
          <button
            onClick={handleRestart}
            className="px-6 py-2.5 bg-blue-400 hover:bg-blue-500 text-white font-medium rounded-lg transition-colors flex items-center gap-2"
          >
            Try Again
            <span className="text-lg">↺</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div ref={quizRef} className="space-y-6">
      <div className="flex items-center gap-2">
        <h2 className="text-2xl font-semibold text-white">Interactive Quiz</h2>
        <div className="w-2 h-2 rounded-full bg-green-500"></div>
      </div>

      <div className="flex items-center justify-between text-sm text-gray-400">
        <span>Question {currentQuestion + 1} of {questions.length}</span>
        <span>{Math.round(progressPercentage)}% Complete</span>
      </div>

      {/* Progress Bar */}
      <div className="relative flex items-center justify-between gap-2 px-1">
        {questions.map((_, index) => (
          <React.Fragment key={index}>
            {/* Progress Circle */}
            <div className={`relative w-3 h-3 rounded-full border ${
              index < currentQuestion
                ? 'bg-blue-500 border-blue-500'
                : index === currentQuestion
                ? 'bg-blue-500 border-blue-500'
                : 'bg-transparent border-gray-600'
            }`} />
            
            {/* Connecting Line */}
            {index < questions.length - 1 && (
              <div className={`flex-1 h-[2px] ${
                index < currentQuestion
                  ? 'bg-blue-500'
                  : 'bg-gray-600'
              }`} />
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Question Card */}
      <div className="bg-[#1A1D2E] rounded-2xl p-8">
        <h3 className="text-xl font-medium text-white mb-8">
          {questions[currentQuestion].question}
        </h3>

        {/* Options */}
        <div className="space-y-3">
          {questions[currentQuestion].options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswerSelect(option)}
              className={`w-full p-4 rounded-xl text-left transition-all duration-200 hover:bg-blue-500/10 ${
                answers[currentQuestion] === option
                  ? 'bg-blue-500/10 text-blue-400'
                  : 'text-gray-300'
              }`}
            >
              {option}
            </button>
          ))}
        </div>

        {/* Navigation Buttons */}
        <div className="mt-8 flex justify-between items-center">
          {currentQuestion > 0 ? (
            <button
              onClick={() => setCurrentQuestion(prev => prev - 1)}
              className="px-6 py-2.5 bg-gray-700 hover:bg-gray-600 text-white font-medium rounded-lg transition-colors flex items-center gap-2"
            >
              <span className="text-lg">‹</span>
              Previous
            </button>
          ) : <div />}
          <button
            onClick={handleNext}
            disabled={!canProceed}
            className={`px-6 py-2.5 font-medium rounded-lg transition-colors flex items-center gap-2 ${
              canProceed
                ? currentQuestion === questions.length - 1 && !canSubmit
                  ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                  : 'bg-blue-400 hover:bg-blue-500 text-white cursor-pointer'
                : 'bg-gray-600 text-gray-400 cursor-not-allowed'
            }`}
          >
            {currentQuestion < questions.length - 1 ? (
              <>
                Next
                <span className="text-lg">›</span>
              </>
            ) : (
              <>
                {!canSubmit && (
                  <span className="text-sm mr-2">
                    (Answer all questions to submit)
                  </span>
                )}
                Submit
                <span className="text-lg">›</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
