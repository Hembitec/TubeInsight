from youtube_transcript_api import YouTubeTranscriptApi
import sys
import re
import time
from typing import Optional, Tuple

def extract_video_id(url: str) -> Optional[str]:
    patterns = [
        r'(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})',
    ]
    
    for pattern in patterns:
        match = re.search(pattern, url)
        if match:
            return match.group(1)
    return None

def get_transcript(url: str, max_retries: int = 3, delay_seconds: int = 2) -> Tuple[Optional[str], Optional[str]]:
    """
    Attempts to get the transcript with retries.
    Returns a tuple of (transcript, error_message).
    If successful, error_message will be None.
    If failed, transcript will be None and error_message will contain the error.
    """
    video_id = extract_video_id(url)
    if not video_id:
        return None, "Invalid YouTube URL"
    
    last_error = None
    for attempt in range(max_retries):
        try:
            transcript = YouTubeTranscriptApi.get_transcript(video_id)
            return " ".join(item['text'] for item in transcript), None
            
        except Exception as e:
            last_error = str(e)
            if attempt < max_retries - 1:  # Don't sleep on the last attempt
                time.sleep(delay_seconds)
                
    return None, f"Failed to retrieve transcript after {max_retries} attempts. Error: {last_error}"

if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Usage: python transcript.py <youtube_url>")
        sys.exit(1)
        
    url = sys.argv[1]
    transcript, error = get_transcript(url)
    
    if transcript:
        print(transcript)
    elif error:
        print(f"Error: {error}")
        sys.exit(1)
