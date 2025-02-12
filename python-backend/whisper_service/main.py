from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import whisper
import yt_dlp
import os
import tempfile
from typing import Optional
import re
from pydantic import BaseModel

app = FastAPI()

# CORS setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Whisper model (this will download the model on first run)
print("Loading Whisper model...")
model = whisper.load_model("base")
print("Whisper model loaded!")

class VideoRequest(BaseModel):
    url: str

def extract_video_id(url: str) -> Optional[str]:
    """Extract YouTube video ID from URL"""
    patterns = [
        r'(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})',
    ]
    
    for pattern in patterns:
        match = re.search(pattern, url)
        if match:
            return match.group(1)
    return None

@app.get("/")
async def read_root():
    return {"status": "Whisper service is running"}

@app.post("/transcribe")
async def transcribe_video(request: VideoRequest):
    try:
        video_id = extract_video_id(request.url)
        if not video_id:
            raise HTTPException(status_code=400, detail="Invalid YouTube URL")

        with tempfile.TemporaryDirectory() as temp_dir:
            # Configure yt-dlp
            audio_path = os.path.join(temp_dir, f"{video_id}.mp3")
            ydl_opts = {
                'format': 'bestaudio/best',
                'postprocessors': [{
                    'key': 'FFmpegExtractAudio',
                    'preferredcodec': 'mp3',
                    'preferredquality': '192',
                }],
                'outtmpl': audio_path,
                'quiet': True,
                'no_warnings': True,
                'http_headers': {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                    'Accept-Language': 'en-US,en;q=0.5',
                }
            }

            # Download audio
            print(f"Downloading audio for video {video_id}...")
            with yt_dlp.YoutubeDL(ydl_opts) as ydl:
                try:
                    ydl.download([request.url])
                except Exception as e:
                    raise HTTPException(
                        status_code=500,
                        detail=f"Failed to download video: {str(e)}"
                    )

            # Check if file exists and is not empty
            if not os.path.exists(audio_path) or os.path.getsize(audio_path) == 0:
                raise HTTPException(
                    status_code=500,
                    detail="Failed to download audio file"
                )

            print("Transcribing audio...")
            try:
                result = model.transcribe(audio_path)
                return {
                    "success": True,
                    "transcript": result["text"],
                    "video_id": video_id
                }
            except Exception as e:
                raise HTTPException(
                    status_code=500,
                    detail=f"Transcription failed: {str(e)}"
                )

    except Exception as e:
        if isinstance(e, HTTPException):
            raise e
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000) 