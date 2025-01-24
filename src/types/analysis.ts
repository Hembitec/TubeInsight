export interface Analysis {
  id?: string;
  user_id?: string;
  video_id: string;
  url: string;
  metadata?: any;
  created_at?: string;
  updated_at?: string;
  analysis: {
    executiveSummary: string;
    detailedSummary: string;
    keyTakeaways: string[];
    bulletPoints: string[];
    educationalContent: {
      quizQuestions: Array<{
        question: string;
        answer: string;
        explanation: string;
        options: string[];
      }>;
      keyTerms: Array<{
        term: string;
        definition: string;
      }>;
      studyNotes: string[];
    };
    researchAnalysis: {
      quality: string;
      biases: string;
      furtherResearch: string;
    };
  };
}
