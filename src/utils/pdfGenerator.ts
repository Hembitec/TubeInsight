import { jsPDF } from 'jspdf';

interface PDFGeneratorOptions {
  title: string;
  content: string | string[] | Array<{ term: string; definition: string }> | Array<{ question: string; answer: string; explanation: string }>;
  type: 'text' | 'list' | 'terms' | 'quiz';
}

export async function generatePDF({ title, content, type }: PDFGeneratorOptions): Promise<Buffer> {
    const doc = new jsPDF();

    doc.setFontSize(24);
    doc.text(title, 105, 20, { align: 'center' });

    doc.setFontSize(12);
    let yOffset = 40;

    switch (type) {
        case 'text':
            doc.text(content as string, 20, yOffset, { maxWidth: 170 });
            break;

        case 'list':
            (content as string[]).forEach((item, index) => {
                doc.text(`${index + 1}. ${item}`, 20, yOffset);
                yOffset += 10;
            });
            break;

        case 'terms':
            (content as Array<{ term: string; definition: string }>).forEach((item) => {
                doc.setFont('helvetica', 'bold');
                doc.text(item.term, 20, yOffset);
                yOffset += 10;
                doc.setFont('helvetica', 'normal');
                doc.text(item.definition, 20, yOffset, { maxWidth: 170 });
                yOffset += 15;
            });
            break;

        case 'quiz':
            (content as Array<{ question: string; answer: string; explanation: string }>).forEach((item, index) => {
                doc.setFont('helvetica', 'bold');
                doc.text(`Question ${index + 1}:`, 20, yOffset);
                yOffset += 10;
                doc.setFont('helvetica', 'normal');
                doc.text(item.question, 20, yOffset, { maxWidth: 170 });
                yOffset += 15;

                doc.setFont('helvetica', 'bold');
                doc.text('Answer:', 20, yOffset);
                yOffset += 10;
                doc.setFont('helvetica', 'normal');
                doc.text(item.answer, 20, yOffset, { maxWidth: 170 });
                yOffset += 15;

                doc.setFont('helvetica', 'bold');
                doc.text('Explanation:', 20, yOffset);
                yOffset += 10;
                doc.setFont('helvetica', 'normal');
                doc.text(item.explanation, 20, yOffset, { maxWidth: 170 });
                yOffset += 20;
            });
            break;
    }
    
    const pdfBuffer = doc.output('arraybuffer');
    return Buffer.from(pdfBuffer);
}
