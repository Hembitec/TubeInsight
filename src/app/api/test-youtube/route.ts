import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const videoId = 'cwdPcbWwb2s'; // Your test video ID
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?id=${videoId}&key=${process.env.YOUTUBE_API_KEY}&part=snippet`
    );
    
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Test error:', error);
    return NextResponse.json({ error: 'Test failed' }, { status: 500 });
  }
}
