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
  summary?: string;
  key_points?: string[];
  action_items?: string[];
}
