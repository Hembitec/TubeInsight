import requests

def test_transcription():
    # Test URL - use a short YouTube video for testing
    url = "https://www.youtube.com/watch?v=jNQXAC9IVRw"  # "Me at the zoo" - First YouTube video
    
    print("Testing Whisper transcription service...")
    
    try:
        # Test the service
        response = requests.post(
            "http://localhost:8000/transcribe",
            json={"url": url}
        )
        
        if response.status_code == 200:
            data = response.json()
            print("\nSuccess! Transcript received:")
            print("-" * 50)
            print(data["transcript"])
            print("-" * 50)
        else:
            print(f"\nError: {response.status_code}")
            print(response.json())
            
    except Exception as e:
        print(f"\nError connecting to service: {str(e)}")

if __name__ == "__main__":
    test_transcription() 