from youtube_transcript_api import YouTubeTranscriptApi
import sys
import re

def extract_video_id(url):
    patterns = [
        r'(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})',
    ]
    
    for pattern in patterns:
        match = re.search(pattern, url)
        if match:
            return match.group(1)
    return None

def get_transcript(url):
    try:
        video_id = extract_video_id(url)
        if not video_id:
            print("Error: Invalid YouTube URL")
            return None
            
        transcript = YouTubeTranscriptApi.get_transcript(video_id)
        return " ".join(item['text'] for item in transcript)
    except Exception as e:
        print(f"Error: {str(e)}")
        return None

if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Usage: python transcript.py <youtube_url>")
        sys.exit(1)
        
    url = sys.argv[1]
    transcript = get_transcript(url)
    if transcript:
        print(transcript)
