import { google } from 'googleapis';

// Replace with your actual API key
const API_KEY = 'YOUR_YOUTUBE_API_KEY';

const youtube = google.youtube({
  version: 'v3',
  auth: API_KEY,
});

async function getVideoMetadata(videoId: string) {
  try {
    const response = await youtube.videos.list({
      part: ['snippet', 'statistics'], // Include snippet for title, thumbnails, and statistics for views, likes etc.
      id: [videoId],
    });

    if (response.data.items && response.data.items.length > 0) {
      const video = response.data.items[0];
      const snippet = video.snippet;
      const statistics = video.statistics;

      if (!snippet || !statistics) {
        throw new Error("Missing snippet or statistics data");
      }

      const metadata = {
        title: snippet.title,
        description: snippet.description,
        thumbnails: snippet.thumbnails,
        publishedAt: snippet.publishedAt,
        viewCount: statistics.viewCount,
        likeCount: statistics.likeCount,
        // Other statistics like commentCount, favoriteCount if available
        commentCount: statistics.commentCount || 'N/A', // Handle potentially missing data
      };

      return metadata;
    } else {
      console.log(`No video found with ID: ${videoId}`);
      return null;
    }
  } catch (error) {
    console.error('Error fetching video metadata:', error);
    return null;
  }
}

// Example usage: Replace with the actual video ID
const videoId = 'dQw4w9WgXcQ'; // Example: Never Gonna Give You Up

async function main() {
  const metadata = await getVideoMetadata(videoId);

  if (metadata) {
    console.log('Video Metadata:');
    console.log(JSON.stringify(metadata, null, 2)); // Pretty print the JSON

    // Access individual properties:
    console.log("Title:", metadata.title);
    console.log("Views:", metadata.viewCount);
    console.log("Likes:", metadata.likeCount);
    console.log("Published At:", metadata.publishedAt);

    // Access thumbnails (various sizes available):
    if (metadata.thumbnails && metadata.thumbnails.medium) {
      console.log("Medium Thumbnail URL:", metadata.thumbnails.medium.url);
    }
     if (metadata.thumbnails && metadata.thumbnails.high) {
      console.log("High Thumbnail URL:", metadata.thumbnails.high.url);
    }
  }
}

main();

