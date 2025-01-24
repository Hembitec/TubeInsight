export interface Analysis {
  id: string;
  created_at: string;
  url: string;
  video_id: string;
  user_id: string;
  metadata: {
    snippet: {
      title: string;
      description: string;
      channelTitle: string;
      publishedAt: string;
      thumbnails?: {
        high?: {
          url: string;
        };
      };
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
    bulletPoints: string[];
    educationalContent: {
      quizQuestions: {
        question: string;
        answer: string;
      }[];
      keyTerms: {
        term: string;
        definition: string;
      }[];
      studyNotes: string[];
    };
  };
}
