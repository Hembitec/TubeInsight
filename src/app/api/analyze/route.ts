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
        "question": "What is unique about the 21st.dev component library mentioned in the video?",
        "options": [
          "It only contains components from a single author.",
          "It is the most extensive library with components from multiple sources.",
          "It focuses solely on animations.",
          "It is only for landing pages."
        ],
        "answer": "It is the most extensive library with components from multiple sources.",
        "explanation": "The 21st.dev component library is unique because it includes components from multiple sources, making it the most extensive library available, as opposed to other libraries that typically have components from a single author."
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
   - Be 3-4 paragraphs long
   - Not exceed 200 words total
   - Use simple, clear language
   - Explain things step by step
   - Focus on different aspects:
     * First paragraph: Simple overview of what it's about
     * Second paragraph: Main ideas in simple terms
     * Third paragraph: Clear examples
     * Fourth paragraph (if needed): How it helps or why it matters

10. Quiz Questions MUST:
    - Have exactly 5 questions
    - Each question MUST have exactly 4 options
    - One option MUST be clearly correct
    - Include a clear explanation of why the answer is correct
    - Questions should test understanding, not just memory
    - Use simple language that anyone can understand
    - Follow the exact format shown in the example above

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
        quizQuestions: Array<{
          question: string;
          options: string[];
          answer: string;
          explanation: string;
        }>;
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

      // Generate educational content
      const educationalContent = await model.generateContent(`
        Based on the video transcript, generate educational content in the following strict JSON format. Do not include any text outside of the JSON:
        {
          "quizQuestions": [
            {
              "question": "string - a question to test understanding",
              "answer": "string - the correct answer",
              "explanation": "string - why this answer is correct",
              "options": ["string - include 4 possible answers"]
            }
          ],
          "flashCards": [
            {
              "front": "string - a key lesson, insight, or concept explained in the video",
              "back": "string - 1-2 detailed sentences that cover: complete explanation of the concept from the video, specific examples or demonstrations shown, and any technical details, steps, or considerations mentioned"
            }
          ],
          "keyTerms": [
            {
              "term": "string",
              "definition": "string"
            }
          ],
          "studyNotes": ["string"]
        }

        Requirements:
        1. Quiz Questions (4-6 questions):
           - Ask clear, specific questions about key concepts
           - Provide 4 plausible options for each question
           - Include detailed explanations for correct answers
           - Test understanding of important concepts

        2. Flash cards must present key lessons from the video:
           - Front: Present a clear lesson title or concept (e.g., "Key Lesson: Understanding OAuth Flow")
           - Back: Must include at least 2-3 detailed sentences that cover:
             * Complete explanation of the concept from the video
             * Specific examples or demonstrations shown
             * Any technical details, steps, or considerations mentioned
           - Each card should focus on a complete lesson or concept
           - Back content should be comprehensive enough to teach the concept
        
        3. Include exactly 8 flash cards covering the main lessons
        4. Each card should teach something valuable from the video

        Example flash card:
        {
          "front": "Key Lesson: Supabase Database Integration",
          "back": "Supabase serves as a powerful relational database service similar to Firebase, providing built-in authentication and data storage capabilities. In the video, it was demonstrated how Supabase seamlessly integrates with Next.js for efficient web app development, enabling secure user data management and real-time updates. The integration involves setting up environment variables for the project URL and API key, then using the createClient() method to establish the connection."
        }

        Transcript: ${transcript}
      `);

      let educationalContentText = '';
      try {
        educationalContentText = educationalContent.response.text();
      } catch (error) {
        console.error('Error getting response text:', error);
        return NextResponse.json({ 
          error: 'Failed to get AI response' 
        }, { status: 500 });
      }

      console.log('Raw educational content:', educationalContentText);

      let educationalContentJson: {
        quizQuestions: Array<{
          question: string;
          answer: string;
          explanation: string;
          options: string[];
        }>;
        flashCards: Array<{
          front: string;
          back: string;
        }>;
        keyTerms: Array<{ term: string; definition: string }>;
        studyNotes: string[];
      };

      try {
        // Try to find JSON content if there's any extra text
        const jsonMatch = educationalContentText.match(/\{[\s\S]*\}/);
        const jsonStr = jsonMatch ? jsonMatch[0] : educationalContentText;
        
        const parsed = JSON.parse(jsonStr);
        
        // Validate and provide defaults for each section
        educationalContentJson = {
          quizQuestions: Array.isArray(parsed.quizQuestions) ? parsed.quizQuestions : [],
          flashCards: Array.isArray(parsed.flashCards) ? parsed.flashCards : [],
          keyTerms: Array.isArray(parsed.keyTerms) ? parsed.keyTerms : [],
          studyNotes: Array.isArray(parsed.studyNotes) ? parsed.studyNotes : []
        };

        // Ensure we have at least 8 flash cards
        if (educationalContentJson.flashCards.length < 8) {
          // Generate flash cards from key terms if we don't have enough
          const additionalCards = educationalContentJson.keyTerms.map(term => ({
            front: term.term,
            back: term.definition
          }));
          
          educationalContentJson.flashCards = [
            ...educationalContentJson.flashCards,
            ...additionalCards
          ].slice(0, 8); // Ensure we have exactly 8 cards
        }

        // Add the educational content to the analysis
        analysis.educationalContent = {
          ...analysis.educationalContent,
          ...educationalContentJson
        };

      } catch (error) {
        console.error('Error parsing educational content:', error);
        console.error('Raw content:', educationalContentText);
        return NextResponse.json({ 
          error: `Failed to parse educational content: ${error instanceof Error ? error.message : 'Unknown error'}` 
        }, { status: 500 });
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
