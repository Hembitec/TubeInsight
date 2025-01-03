import os
import requests
from dotenv import load_dotenv

# Load environment variables from .env.local
load_dotenv('../.env.local')

# Get API key from environment variable
api_key = os.getenv('YOUTUBE_API_KEY')
video_id = 'cwdPcbWwb2s'  # The video ID you're trying to analyze

# Construct the API URL
url = f'https://www.googleapis.com/youtube/v3/videos?id={video_id}&key={api_key}&part=snippet'

# Make the request
response = requests.get(url)
data = response.json()

# Print the results
print('API Key:', api_key)
print('Response Status:', response.status_code)
print('Response Data:', data)

if 'items' in data and len(data['items']) > 0:
    print('\nVideo found!')
    print('Title:', data['items'][0]['snippet']['title'])
else:
    print('\nVideo not found or API key invalid')
