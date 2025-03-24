import { NextRequest, NextResponse } from 'next/server';
import PptxGenJS from 'pptxgenjs';

export const dynamic = 'force-dynamic';

console.log('TEST-PPTX API route module loaded');

export async function GET(request: NextRequest) {
  try {
    console.log('TEST-PPTX API endpoint called');
    console.log('Request URL:', request.url);
    
    try {
      // Create a very basic test presentation
      const pptx = new PptxGenJS();
      
      // Add just a single slide with minimal content
      const slide = pptx.addSlide();
      
      // Add title with simple styling
      slide.addText('Test Presentation', {
        x: 1,
        y: 1,
        w: 8,
        h: 1,
        fontSize: 36,
        fontFace: 'Arial',
        bold: true,
        align: 'center'
      });
      
      // Generate the buffer
      console.log('Generating test PPTX buffer...');
      const buffer = await pptx.write({ outputType: 'nodebuffer' });
      console.log('Test buffer generated successfully');
      
      // Return the file
      return new NextResponse(buffer, {
        headers: {
          'Content-Type': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
          'Content-Disposition': 'attachment; filename="test.pptx"',
        },
      });
    } catch (pptxError) {
      console.error('PPTX generation error:', pptxError);
      
      return NextResponse.json({
        error: 'Failed to generate test PPTX',
        message: 'There was an error generating the test presentation file.',
        details: String(pptxError)
      }, { status: 500 });
    }
  } catch (error) {
    console.error('API test error:', error);
    return NextResponse.json(
      { error: 'API test failed', details: String(error) },
      { status: 500 }
    );
  }
} 