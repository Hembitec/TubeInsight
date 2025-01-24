import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { exec } from 'child_process';
import { promisify } from 'util';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { getVideoMetadata } from '@/utils/youtube';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Initialize Google Gemini
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY!);

const execAsync = promisify(exec);

async function getVideoTranscript(url: string) {
  try {
    const pythonScript = 'python-backend/transcript.py';
    const { stdout, stderr } = await execAsync(`python ${pythonScript} "${url}"`);
    
    if (stderr) {
      console.error('Python script error:', stderr);
      throw new Error(stderr);
    }
    
    if (!stdout.trim()) {
      throw new Error('No transcript available for this video');
    }
    
    return stdout.trim();
  } catch (error) {
    console.error('Error fetching transcript:', error);
    throw error;
  }
}

export async function POST(request: Request) {
  try {
    // Get the authenticated user from the request
    const supabaseAuth = createRouteHandlerClient({ cookies });
    const { data: { user }, error: authError } = await supabaseAuth.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { url } = await request.json();
    
    console.log('Processing URL:', url);
    
    // Extract video ID from URL
    const videoId = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/)?.[1];
    console.log('Extracted video ID:', videoId);
    
    if (!videoId) {
      return NextResponse.json({ error: 'Please provide a valid YouTube URL' }, { status: 400 });
    }

    // Get video metadata from YouTube API
    console.log('Fetching video metadata...');
    let metadata;
    try {
      metadata = await getVideoMetadata(videoId);
      console.log('Video metadata:', metadata);
    } catch (error: any) {
      console.error('Error fetching video metadata:', error);
      return NextResponse.json({ 
        error: `Failed to fetch video metadata: ${error.message}` 
      }, { status: 500 });
    }

    // Get video transcript
    console.log('Fetching transcript for video:', videoId);
    let transcript;
    try {
      transcript = await getVideoTranscript(url);
      console.log('Transcript length:', transcript.length);
    } catch (error: any) {
      console.error('Error fetching transcript:', error);
      return NextResponse.json({ 
        error: `Failed to fetch video transcript: ${error.message}` 
      }, { status: 500 });
    }

    if (!transcript) {
      return NextResponse.json({ error: 'Could not fetch video transcript' }, { status: 400 });
    }

    // Generate analysis using Google Gemini
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
    
    const prompt = `You are a helpful AI assistant that analyzes YouTube video transcripts. Your task is to analyze the provided transcript and return ONLY a JSON object with no additional text or formatting. Use simple, clear English that anyone can understand. The JSON must follow this exact structure:

{
  "executiveSummary": "A simple 2-3 sentence overview that anyone can understand",
  "detailedSummary": "A clear analysis in 3-4 paragraphs (maximum 200 words total) using simple, everyday English. Avoid technical jargon unless necessary, and when used, explain it in simple terms. Each paragraph should focus on a different aspect and be easy to understand.",
  "keyTakeaways": ["Each key takeaway should use simple language and be 2-3 sentences long. For example: 'The video shows us a new tool called 21st.dev that makes building websites easier. It combines different ready-made parts from other tools like Magic UI and Motion Primitives, which saves developers time. This means developers can build better websites faster.'"],
  "bulletPoints": ["Each bullet point should use simple language and be 2-3 sentences long. For example: 'The new 21st.dev tool brings together different website building blocks in one place. It takes useful parts from other tools like Magic UI and Motion Primitives. This makes it easier for developers to build websites without having to look in many different places.'"],
  "educationalContent": {
    "quizQuestions": [
      {
        "question": "Simple, clear question",
        "answer": "Simple, clear answer"
      }
    ],
    "keyTerms": [
      {
        "term": "Simple term",
        "definition": "Clear, simple definition that anyone can understand"
      }
    ],
    "studyNotes": ["Simple, clear study points"]
  },
  "researchAnalysis": {
    "quality": "Simple assessment of content quality",
    "biases": "Clear explanation of any biases",
    "furtherResearch": "Simple suggestions for more learning"
  }
}

Remember:
1. Return ONLY the JSON object, no other text
2. Ensure all JSON values are properly escaped strings
3. Do not include any markdown or formatting
4. Make sure all arrays and objects are properly closed
5. ALWAYS include at least 7 items in both keyTakeaways and bulletPoints arrays
6. Use simple, everyday English that anyone can understand
7. Avoid technical terms unless necessary, and when used, explain them simply
8. Each key takeaway and bullet point MUST:
   - Use simple language
   - Be 2-3 sentences long
   - Explain one main idea clearly
   - Connect ideas with words like "this means" or "because"
9. The detailedSummary MUST:
   - Be 4-5 paragraphs long
   - Not exceed 200 words total
   - Use simple, clear language
   - Explain things step by step
   - Focus on different aspects:
     * First paragraph: Simple overview of what it's about
     * Second paragraph: Main ideas in simple terms
     * Third paragraph: Clear examples
     * Fourth paragraph: How it helps or why it matters
     * Fifth paragraph (if needed): What's next or final thoughts

Here is the transcript to analyze:
${transcript}`;

    console.log('Generating analysis with Gemini...');
    const result = await model.generateContent(prompt);
    const analysisText = await result.response.text();
    console.log('Raw analysis:', analysisText);
    
    // Parse the analysis JSON
    let analysis: {
      executiveSummary: string;
      detailedSummary: string;
      keyTakeaways: string[];
      bulletPoints: string[];
      educationalContent: {
        quizQuestions: Array<{ question: string; answer: string }>;
        keyTerms: Array<{ term: string; definition: string }>;
        studyNotes: string[];
      };
      researchAnalysis: {
        quality: string;
        biases: string;
        furtherResearch: string;
      };
    } | null = null;

    try {
      // Try to clean up the response if needed
      const cleanedText = analysisText
        .trim()
        .replace(/^```json\s*/, '')  // Remove JSON code block start
        .replace(/\s*```$/, '')      // Remove JSON code block end
        .trim();
        
      analysis = JSON.parse(cleanedText);
      
      // Validate the JSON structure
      const requiredFields = ['executiveSummary', 'detailedSummary', 'keyTakeaways', 'bulletPoints', 'educationalContent', 'researchAnalysis'];
      const missingFields = requiredFields.filter(field => !(field in (analysis || {})));
      
      if (!analysis || missingFields.length > 0) {
        throw new Error(`Invalid analysis structure. Missing fields: ${missingFields.join(', ')}`);
      }

      // Store the analysis in Supabase
      const { data: existingAnalysis } = await supabase
        .from('analyses')
        .select('id, created_at')
        .eq('video_id', videoId)
        .eq('user_id', user.id)
        .single();

      const { data: updatedAnalysis, error: updateError } = await supabase
        .from('analyses')
        .upsert({
          id: existingAnalysis?.id,
          url,
          video_id: videoId,
          user_id: user.id,
          metadata,
          analysis,
          created_at: existingAnalysis?.created_at || new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select('*')
        .single();

      if (updateError) {
        throw new Error(`Failed to store analysis: ${updateError.message}`);
      }

      return NextResponse.json(updatedAnalysis);
    } catch (error) {
      console.error('Error processing analysis:', error);
      return NextResponse.json({ 
        error: `Failed to process analysis: ${error instanceof Error ? error.message : 'Unknown error'}`
      }, { status: 500 });
    }
  } catch (error: any) {
    console.error('Analysis error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to analyze video' },
      { status: 500 }
    );
  }
}
