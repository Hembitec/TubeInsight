import sys
import subprocess

def check_dependency(module_name):
    try:
        __import__(module_name)
        print(f"✓ {module_name} is installed")
        return True
    except ImportError:
        print(f"✗ {module_name} is not installed")
        return False

def check_ffmpeg():
    try:
        subprocess.run(['ffmpeg', '-version'], capture_output=True)
        print("✓ FFmpeg is installed")
        return True
    except FileNotFoundError:
        print("✗ FFmpeg is not installed")
        return False

def main():
    print("Checking dependencies...")
    print("-" * 50)
    
    dependencies = [
        'whisper',
        'torch',
        'fastapi',
        'uvicorn',
        'yt_dlp'
    ]
    
    all_passed = True
    
    # Check Python dependencies
    for dep in dependencies:
        if not check_dependency(dep):
            all_passed = False
    
    # Check FFmpeg
    if not check_ffmpeg():
        all_passed = False
    
    print("-" * 50)
    if all_passed:
        print("All dependencies are installed correctly! ✨")
        print("You can now run the Whisper service with:")
        print("python main.py")
    else:
        print("Some dependencies are missing. Please install them and try again.")
        print("Run: pip install -r requirements.txt")
        print("And make sure FFmpeg is installed on your system.")

if __name__ == "__main__":
    main() 