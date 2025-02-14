import { NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { generatePDF } from '@/utils/pdfGenerator';
import { headers, cookies } from 'next/headers';
import { Database } from '@/types/supabase';

interface Timestamp {
  time: string;
  text: string;
}

export async function OPTIONS(request: Request) {
  const headersList = await headers();
  const origin = headersList.get('origin') || '*';

  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': origin,
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Allow-Credentials': 'true',
    },
  });
}

export async function POST(request: Request) {
  try {
    const cookieStore = cookies();
    const headersList = await headers();
    const origin = headersList.get('origin') || '*';

    // Initialize Supabase client with asynchronous cookie access
    const supabase = createRouteHandlerClient<Database>({
      cookies: () => {
        return cookieStore;
      }
    });

    const { resourceType, analysisId, format = 'PDF' } = await request.json();
    console.log('Download request received for:', { resourceType, analysisId, format });

    // Get session using the initialized client
    const {
      data: { session },
      error: sessionError
    } = await supabase.auth.getSession();

    if (sessionError || !session) {
      console.error('Auth error:', sessionError?.message || 'No session found');
      return NextResponse.json(
        { error: 'Please sign in to download resources' },
        { 
          status: 401,
          headers: {
            'Access-Control-Allow-Credentials': 'true',
            'Access-Control-Allow-Origin': origin
          }
        }
      );
    }

    console.log('Session verified for user:', session.user.id);

    // Get the analysis data with RLS policies applied
    const { data: analysis, error: analysisError } = await supabase
      .from('analyses')
      .select('*')
      .eq('id', analysisId)
      .eq('user_id', session.user.id)
      .single();

    if (analysisError || !analysis) {
      console.error('Analysis retrieval error:', analysisError?.message || 'Analysis not found');
      return NextResponse.json(
        { error: 'Could not find the requested analysis' },
        { 
          status: 404,
          headers: {
            'Access-Control-Allow-Credentials': 'true',
            'Access-Control-Allow-Origin': origin
          }
        }
      );
    }

    console.log('Analysis data retrieved successfully');

    let responseData: Uint8Array | string | Buffer | null = null;
    let fileName: string;
    let contentType: string;

    // Try PDF first if requested
    if (format === 'PDF') {
      try {
        const pdfContent = await generatePDF({
          title: getPDFTitle(resourceType),
          content: getPDFContent(resourceType, analysis),
          type: getPDFType(resourceType)
        });
        responseData = pdfContent;
        fileName = `${resourceType}-${analysis.video_id}.pdf`;
        contentType = 'application/pdf';
        console.log(`Generated ${resourceType} PDF file`);
      } catch (error) {
        // If PDF generation fails, fall back to text
        console.error('PDF generation failed, falling back to text:', error);
        const textContent = getTextContent(resourceType, analysis);
        responseData = textContent;
        fileName = `${resourceType}-${analysis.video_id}.txt`;
        contentType = 'text/plain';
        console.log(`Fallback: Generated ${resourceType} text file`);
      }
    } else {
      // Handle text format directly
      const textContent = getTextContent(resourceType, analysis);
      responseData = textContent;
      fileName = `${resourceType}-${analysis.video_id}.txt`;
      contentType = 'text/plain';
      console.log(`Generated ${resourceType} text file`);
    }

    if (!responseData) {
      throw new Error('Failed to generate requested resource');
    }

    // Return the response with proper headers
    return new NextResponse(responseData, {
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `attachment; filename="${fileName}"`,
        'Access-Control-Allow-Credentials': 'true',
        'Access-Control-Allow-Origin': origin,
        'Cache-Control': 'no-cache'
      }
    });

  } catch (error) {
    console.error('Download error:', error);
    const headersList = await headers();
    const origin = headersList.get('origin') || '*';
    
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Failed to generate download content'
      },
      { 
        status: 500,
        headers: {
          'Access-Control-Allow-Credentials': 'true',
          'Access-Control-Allow-Origin': origin
        }
      }
    );
  }
}

// Helper function to get content in text format
function getTextContent(resourceType: string, analysis: any): string {
  switch (resourceType) {
    case 'transcript':
      return analysis.transcript || 'No transcript available';
    
    case 'timestamps':
      return analysis.timestamps?.map((t: Timestamp) => `${t.time}: ${t.text}`).join('\n') || 'No timestamps available';
    
    case 'executive-summary':
      return analysis.analysis.executiveSummary || 'No executive summary available';
    
    case 'detailed-summary':
      return analysis.analysis.detailedSummary || 'No detailed summary available';
    
    case 'key-takeaways':
      return (analysis.analysis.keyTakeaways || [])
        .map((takeaway: string, index: number) => `${index + 1}. ${takeaway}`)
        .join('\n\n');
    
    case 'study-notes':
      return (analysis.analysis.educationalContent?.studyNotes || [])
        .map((note: string, index: number) => `${index + 1}. ${note}`)
        .join('\n\n');
    
    case 'flash-cards':
      return (analysis.analysis.educationalContent?.flashCards || [])
        .map((card: { front: string; back: string }, index: number) => 
          `Card ${index + 1}:\nQ: ${card.front}\nA: ${card.back}`)
        .join('\n\n');
    
    case 'quiz':
      return (analysis.analysis.educationalContent?.quizQuestions || [])
        .map((qa: { question: string; answer: string; explanation: string }, index: number) =>
          `Question ${index + 1}:\n${qa.question}\n\nAnswer: ${qa.answer}\n\nExplanation: ${qa.explanation}`)
        .join('\n\n');
    
    case 'key-terms':
      return (analysis.analysis.educationalContent?.keyTerms || [])
        .map((term: { term: string; definition: string }) => `${term.term}:\n${term.definition}`)
        .join('\n\n');
    
    default:
      return 'No content available';
  }
}

// Helper functions for PDF generation
function getPDFTitle(resourceType: string): string {
  const titles: Record<string, string> = {
    'executive-summary': 'Executive Summary',
    'detailed-summary': 'Detailed Summary',
    'key-takeaways': 'Key Takeaways',
    'study-notes': 'Study Notes',
    'flash-cards': 'Flash Cards',
    'quiz': 'Quiz Questions & Answers',
    'key-terms': 'Key Terms Glossary'
  };
  return titles[resourceType] || 'Document';
}

function getPDFType(resourceType: string): 'text' | 'list' | 'terms' | 'quiz' {
  const types: Record<string, 'text' | 'list' | 'terms' | 'quiz'> = {
    'executive-summary': 'text',
    'detailed-summary': 'text',
    'key-takeaways': 'list',
    'study-notes': 'list',
    'flash-cards': 'terms',
    'quiz': 'quiz',
    'key-terms': 'terms'
  };
  return types[resourceType] || 'text';
}

function getPDFContent(resourceType: string, analysis: any) {
  switch (resourceType) {
    case 'executive-summary':
      return analysis.analysis.executiveSummary || 'No executive summary available';
    case 'detailed-summary':
      return analysis.analysis.detailedSummary || 'No detailed summary available';
    case 'key-takeaways':
      return analysis.analysis.keyTakeaways || [];
    case 'study-notes':
      return analysis.analysis.educationalContent?.studyNotes || [];
    case 'flash-cards':
      return (analysis.analysis.educationalContent?.flashCards || [])
        .map((card: { front: string; back: string }) => ({
          term: card.front,
          definition: card.back
        }));
    case 'quiz':
      return analysis.analysis.educationalContent?.quizQuestions || [];
    case 'key-terms':
      return (analysis.analysis.educationalContent?.keyTerms || [])
        .map((term: { term: string; definition: string }) => ({
          term: term.term,
          definition: term.definition
        }));
    default:
      return [];
  }
}
