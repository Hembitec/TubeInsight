import { NextResponse } from 'next/server';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { generatePDF } from '@/utils/pdfGenerator';

interface Timestamp {
  time: string;
  text: string;
}

export async function POST(request: Request) {
  try {
    const { resourceType, analysisId } = await request.json();
    console.log('Download request received:', { resourceType, analysisId });
    const supabase = createClientComponentClient();

    // Get the current session
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      console.error('Unauthorized access attempt');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get the analysis data
    const { data: analysis, error } = await supabase
      .from('analyses')
      .select('*')
      .eq('id', analysisId)
      .eq('user_id', session.user.id)
      .single();

    if (error || !analysis) {
      console.error('Analysis not found:', error);
      return NextResponse.json({ error: 'Analysis not found' }, { status: 404 });
    }

    console.log('Analysis data retrieved successfully');

    let content: any;
    let fileName: string;
    let contentType: string;
    let pdfBuffer: Buffer | null = null;

    switch (resourceType) {
      case 'executive-summary':
        console.log('Generating Executive Summary PDF');
        pdfBuffer = await generatePDF({
          title: 'Executive Summary',
          content: analysis.analysis.executiveSummary || 'No executive summary available',
          type: 'text'
        });
        fileName = 'executive-summary.pdf';
        contentType = 'application/pdf';
        break;

      case 'detailed-summary':
        console.log('Generating Detailed Summary PDF');
        pdfBuffer = await generatePDF({
          title: 'Detailed Summary',
          content: analysis.analysis.detailedSummary || 'No detailed summary available',
          type: 'text'
        });
        fileName = 'detailed-summary.pdf';
        contentType = 'application/pdf';
        break;

      case 'key-takeaways':
        console.log('Generating Key Takeaways PDF');
        pdfBuffer = await generatePDF({
          title: 'Key Takeaways',
          content: analysis.analysis.keyTakeaways || [],
          type: 'list'
        });
        fileName = 'key-takeaways.pdf';
        contentType = 'application/pdf';
        break;

      case 'study-notes':
        console.log('Generating Study Notes PDF');
        pdfBuffer = await generatePDF({
          title: 'Study Notes',
          content: analysis.analysis.educationalContent?.studyNotes || [],
          type: 'list'
        });
        fileName = 'study-notes.pdf';
        contentType = 'application/pdf';
        break;

      case 'flash-cards':
        console.log('Generating Flash Cards PDF');
        pdfBuffer = await generatePDF({
          title: 'Flash Cards',
          content: (analysis.analysis.educationalContent?.flashCards || []).map(
            (card: { front: string; back: string }) => ({
              term: card.front,
              definition: card.back
            })
          ),
          type: 'terms'
        });
        fileName = 'flash-cards.pdf';
        contentType = 'application/pdf';
        break;

      case 'quiz':
        console.log('Generating Quiz PDF');
        pdfBuffer = await generatePDF({
          title: 'Quiz Questions & Answers',
          content: analysis.analysis.educationalContent?.quizQuestions || [],
          type: 'quiz'
        });
        fileName = 'quiz.pdf';
        contentType = 'application/pdf';
        break;

      case 'key-terms':
        console.log('Generating Key Terms PDF');
        pdfBuffer = await generatePDF({
          title: 'Key Terms Glossary',
          content: (analysis.analysis.educationalContent?.keyTerms || []).map(
            (term: { term: string; definition: string }) => ({
              term: term.term,
              definition: term.definition
            })
          ),
          type: 'terms'
        });
        fileName = 'key-terms.pdf';
        contentType = 'application/pdf';
        break;

      case 'transcript':
        console.log('Generating Transcript');
        content = analysis.transcript || 'No transcript available';
        fileName = 'transcript.txt';
        contentType = 'text/plain';
        break;

      case 'timestamps':
        console.log('Generating Timestamps');
        content = analysis.timestamps?.map((t: Timestamp) => `${t.time}: ${t.text}`).join('\n') || 'No timestamps available';
        fileName = 'timestamps.txt';
        contentType = 'text/plain';
        break;

      default:
        console.error('Invalid resource type requested:', resourceType);
        return NextResponse.json({ error: 'Invalid resource type' }, { status: 400 });
    }

    // Return the appropriate response based on content type
    if (contentType === 'application/pdf' && pdfBuffer) {
      console.log('Sending PDF response');
      return new NextResponse(pdfBuffer, {
        headers: {
          'Content-Type': contentType,
          'Content-Disposition': `attachment; filename="${fileName}"`,
        },
      });
    } else {
      console.log('Sending text response');
      return new NextResponse(content, {
        headers: {
          'Content-Type': contentType,
          'Content-Disposition': `attachment; filename="${fileName}"`,
        },
      });
    }

  } catch (error) {
    console.error('Download error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
