import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { exec } from 'child_process';
import { promisify } from 'util';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

const execAsync = promisify(exec);

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Initialize Google Gemini
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY!);

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

    // Get video transcript
    console.log('Fetching transcript for video:', videoId);
    const transcript = await getVideoTranscript(url);
    console.log('Transcript length:', transcript.length);

    if (!transcript) {
      return NextResponse.json({ error: 'Could not fetch video transcript' }, { status: 400 });
    }

    // Generate analysis using Google Gemini
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
    
    const prompt = `You are a helpful AI assistant that analyzes YouTube video transcripts. Your task is to analyze the provided transcript and return ONLY a JSON object with no additional text or formatting. The JSON must follow this exact structure:

{
  "executiveSummary": "2-3 sentence overview",
  "detailedSummary": "2-3 paragraphs of detailed explanation",
  "keyTakeaways": ["5-7 key points as bullet points"],
  "educationalContent": {
    "quizQuestions": [
      {
        "question": "Question text",
        "answer": "Answer text"
      }
    ],
    "keyTerms": [
      {
        "term": "Term name",
        "definition": "Term definition"
      }
    ],
    "studyNotes": ["Important study points"]
  },
  "researchAnalysis": {
    "quality": "Assessment of content quality",
    "biases": "Potential biases in the content",
    "furtherResearch": "Suggested areas for further research"
  }
}

Remember:
1. Return ONLY the JSON object, no other text
2. Ensure all JSON values are properly escaped strings
3. Do not include any markdown or formatting
4. Make sure all arrays and objects are properly closed

Here is the transcript to analyze:
${transcript}`;

    console.log('Generating analysis with Gemini...');
    const result = await model.generateContent(prompt);
    const analysisText = await result.response.text();
    console.log('Raw analysis:', analysisText);
    
    // Parse the analysis JSON
    let analysis;
    try {
      // Try to clean up the response if needed
      const cleanedText = analysisText
        .trim()
        .replace(/^```json\s*/, '')  // Remove JSON code block start
        .replace(/\s*```$/, '')      // Remove JSON code block end
        .trim();
        
      analysis = JSON.parse(cleanedText);
      
      // Validate the JSON structure
      const requiredFields = ['executiveSummary', 'detailedSummary', 'keyTakeaways', 'educationalContent', 'researchAnalysis'];
      const missingFields = requiredFields.filter(field => !(field in analysis));
      
      if (missingFields.length > 0) {
        throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
      }
    } catch (error) {
      console.error('Error parsing analysis:', error);
      console.error('Raw analysis text:', analysisText);
      return NextResponse.json({ 
        error: `Failed to parse analysis: ${error.message}. Please try again.` 
      }, { status: 500 });
    }

    // Store results in Supabase
    console.log('Storing results in Supabase...');
    const { data: existingAnalysis } = await supabase
      .from('analyses')
      .select('id')
      .eq('video_id', videoId)
      .eq('user_id', user.id)
      .single();

    if (existingAnalysis) {
      // Update existing analysis
      const { data, error } = await supabase
        .from('analyses')
        .update({
          url,
          metadata: {
            id: videoId,
            snippet: {
              title: 'YouTube Video',
              description: 'Video analysis',
            }
          },
          analysis,
          updated_at: new Date().toISOString(),
        })
        .eq('id', existingAnalysis.id)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;
      return NextResponse.json(data);
    } else {
      // Create new analysis
      const { data, error } = await supabase
        .from('analyses')
        .insert({
          user_id: user.id,
          video_id: videoId,
          url,
          metadata: {
            id: videoId,
            snippet: {
              title: 'YouTube Video',
              description: 'Video analysis',
            }
          },
          analysis,
          created_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

      console.log('Analysis complete and stored!');
      return NextResponse.json(data);
    }
  } catch (error: any) {
    console.error('Analysis error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to analyze video' },
      { status: 500 }
    );
  }
}
