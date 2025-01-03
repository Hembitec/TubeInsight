from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from youtube_transcript_api import YouTubeTranscriptApi
from youtube_transcript_api.formatters import TextFormatter
import re
from pydantic import BaseModel
from typing import Optional

app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class VideoRequest(BaseModel):
    url: str

def extract_video_id(url: str) -> Optional[str]:
    # Regular expressions for different YouTube URL formats
    patterns = [
        r'(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})',
    ]
    
    for pattern in patterns:
        match = re.search(pattern, url)
        if match:
            return match.group(1)
    return None

@app.post("/api/transcript")
async def get_transcript(video_request: VideoRequest):
    try:
        video_id = extract_video_id(video_request.url)
        if not video_id:
            raise HTTPException(status_code=400, detail="Invalid YouTube URL")

        transcript = YouTubeTranscriptApi.get_transcript(video_id)
        formatter = TextFormatter()
        text_transcript = formatter.format_transcript(transcript)
        
        return {
            "success": True,
            "transcript": text_transcript,
            "video_id": video_id
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
