import PDFDocument from 'pdfkit';

interface PDFGeneratorOptions {
  title: string;
  content: string | string[] | Array<{ term: string; definition: string }> | Array<{ question: string; answer: string; explanation: string }>;
  type: 'text' | 'list' | 'terms' | 'quiz';
}

export async function generatePDF({ title, content, type }: PDFGeneratorOptions): Promise<Buffer> {
  return new Promise((resolve) => {
    const doc = new PDFDocument({
      size: 'A4',
      margin: 50,
      bufferPages: true
    });

    const chunks: Uint8Array[] = [];
    doc.on('data', (chunk: Uint8Array) => chunks.push(chunk));
    doc.on('end', () => resolve(Buffer.concat(chunks)));

    // Add title
    doc
      .font('Helvetica-Bold')
      .fontSize(24)
      .text(title, { align: 'center' })
      .moveDown(2);

    // Add content based on type
    doc.font('Helvetica').fontSize(12);

    switch (type) {
      case 'text':
        doc.text(content as string, {
          align: 'justify',
          lineGap: 10
        });
        break;

      case 'list':
        (content as string[]).forEach((item, index) => {
          doc
            .text(`${index + 1}. ${item}`, {
              lineGap: 10
            })
            .moveDown(0.5);
        });
        break;

      case 'terms':
        (content as Array<{ term: string; definition: string }>).forEach((item) => {
          doc
            .font('Helvetica-Bold')
            .text(item.term)
            .font('Helvetica')
            .text(item.definition, {
              indent: 20,
              lineGap: 5
            })
            .moveDown(1);
        });
        break;

      case 'quiz':
        const quizContent = content as Array<{ question: string; answer: string; explanation: string }>;
        quizContent.forEach((item, index) => {
          doc
            .font('Helvetica-Bold')
            .text(`Question ${index + 1}:`)
            .font('Helvetica')
            .text(item.question)
            .moveDown(0.5)
            .font('Helvetica-Bold')
            .text('Answer:')
            .font('Helvetica')
            .text(item.answer)
            .moveDown(0.5)
            .font('Helvetica-Bold')
            .text('Explanation:')
            .font('Helvetica')
            .text(item.explanation)
            .moveDown(1.5);
        });
        break;
    }

    // Add footer with page number
    const pageCount = doc.bufferedPageRange().count;
    for (let i = 0; i < pageCount; i++) {
      doc.switchToPage(i);
      doc
        .fontSize(10)
        .text(
          `Page ${i + 1} of ${pageCount}`,
          doc.page.width / 2,
          doc.page.height - 50,
          {
            align: 'center'
          }
        );
    }

    doc.end();
  });
}
