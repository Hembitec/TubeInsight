export interface Analysis {
  id: string;
  created_at: string;
  url: string;
  video_id: string;
  user_id: string;
  metadata: {
    id: string;
    snippet: {
      title: string;
      description: string;
      channelTitle: string;
      publishedAt: string;
    };
    statistics: {
      viewCount: string;
      likeCount: string;
    };
    contentDetails: {
      duration: string;
    };
  };
  analysis: {
    executiveSummary: string;
    detailedSummary: string;
    keyTakeaways: string[];
    educationalContent: {
      quizQuestions: Array<{ question: string; answer: string }>;
      keyTerms: Array<{ term: string; definition: string }>;
      studyNotes: string[];
    };
    researchAnalysis: {
      quality: string;
      biases: string;
      furtherResearch: string;
    };
  };
}
