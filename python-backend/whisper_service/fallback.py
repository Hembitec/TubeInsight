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
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global variable for the model
whisper_model = None

def get_whisper_model():
    """Lazy loading of the Whisper model"""
    global whisper_model
    if whisper_model is None:
        try:
            print("Loading Whisper model...")
            whisper_model = whisper.load_model("base")
            print("Whisper model loaded successfully!")
        except Exception as e:
            print(f"Error loading Whisper model: {e}")
            return None
    return whisper_model

class VideoRequest(BaseModel):
    url: str

def extract_video_id(url: str) -> Optional[str]:
    patterns = [
        r'(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})',
    ]
    
    for pattern in patterns:
        match = re.search(pattern, url)
        if match:
            return match.group(1)
    return None

@app.get("/health")
async def health_check():
    """Check if the service is running and if the model can be loaded"""
    model = get_whisper_model()
    return {
        "status": "Whisper fallback service is running",
        "model_loaded": model is not None
    }

@app.post("/fallback-transcribe")
import time

async def transcribe_video(request: VideoRequest):
    max_retries = 3
    delay_seconds = 2
    for attempt in range(max_retries):
        try:
            video_id = extract_video_id(request.url)
            if not video_id:
                raise HTTPException(status_code=400, detail="Invalid YouTube URL")

        # Try to get the model
        model = get_whisper_model()
        if model is None:
            raise HTTPException(
                status_code=500,
                detail="Failed to load Whisper model"
            )

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
                for attempt in range(max_retries):
                    try:
                        time.sleep(2)  # Add a 2-second delay before downloading
                        ydl.download([request.url])
                        break  # If download succeeds, break the retry loop
                    except Exception as e:
                        if attempt < max_retries - 1:
                            time.sleep(delay_seconds * (attempt + 1))
                            print(f"Download failed, retrying... (Attempt {attempt + 2}/{max_retries})")
                        else:
                            raise HTTPException(
                                status_code=500,
                                detail=f"Failed to download video after {max_retries} attempts: {str(e)}"
                            )

            # Check if file exists and is not empty
            if not os.path.exists(audio_path) or os.path.getsize(audio_path) == 0:
                raise HTTPException(
                    status_code=500,
                    detail="Failed to download audio file"
                )

            print("Transcribing audio with Whisper...")
            try:
                result = model.transcribe(audio_path)
                return {
                    "success": True,
                    "transcript": result["text"],
                    "video_id": video_id,
                    "source": "whisper"
            except Exception as e:
                if attempt < max_retries - 1:
                    time.sleep(delay_seconds * (attempt + 1))
                else:
                    raise e
        return None
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
    uvicorn.run(app, host="0.0.0.0", port=8001)  # Note: Using port 8001 to avoid conflict 