import { getSharedProjectById } from '@/actions/project';
import { NextRequest, NextResponse } from 'next/server';
import PptxGenJS from 'pptxgenjs';

export const dynamic = 'force-dynamic';

console.log('DOWNLOAD API route module loaded');

export async function GET(
  request: NextRequest
) {
  try {
    // Extract the presentationId from URL
    const url = new URL(request.url);
    const pathParts = url.pathname.split('/');
    const presentationId = pathParts[pathParts.length - 1];
    
    console.log(`Download API called for presentation: ${presentationId}`);
    console.log('Request URL:', request.url);
    
    // Get the presentation data
    const res = await getSharedProjectById(presentationId);
    console.log('API response status:', res.status);
    
    if (res.status !== 200 || !res.data) {
      console.error('Presentation not found');
      return NextResponse.json(
        { error: 'Presentation not found' },
        { status: 404 }
      );
    }

    // Add diagnostic logging to understand the structure
    console.log('Presentation data structure:', JSON.stringify({
      title: res.data.title,
      hasSlides: Boolean(res.data.slides),
      slidesIsArray: Array.isArray(res.data.slides),
      slideCount: Array.isArray(res.data.slides) ? res.data.slides.length : 0,
      slideKeys: Array.isArray(res.data.slides) && res.data.slides.length > 0 
        ? Object.keys(res.data.slides[0] as object || {}) 
        : [],
      topLevelKeys: Object.keys(res.data as object || {})
    }));

    // For the first slide, log its complete structure
    if (Array.isArray(res.data.slides) && res.data.slides.length > 0) {
      console.log('First slide sample:', JSON.stringify(res.data.slides[0]));
    }

    // Check if there are any other possible content containers
    if (res.data && typeof res.data === 'object') {
      const dataObj = res.data as Record<string, any>;
      
      // Log other potential content containers
      for (const key of Object.keys(dataObj)) {
        if (key !== 'slides' && key !== 'title' && 
            Array.isArray(dataObj[key]) && dataObj[key].length > 0) {
          console.log(`Found potential content in '${key}':`, 
                      JSON.stringify(dataObj[key][0]));
        }
      }
    }

    console.log('Presentation found:', res.data.title);
    console.log('Slide count:', Array.isArray(res.data.slides) ? res.data.slides.length : 0);

    try {
      // Create a new presentation with more basic approach
      const pptx = new PptxGenJS();
      
      // Set presentation properties
      pptx.title = res.data.title || 'Presentation';
      pptx.subject = 'Generated Presentation';
      pptx.author = 'AI Presentation Generator';
      
      // Create title slide
      const slide1 = pptx.addSlide();
      
      // Add title to first slide
      slide1.addText(res.data.title || 'Presentation', {
        x: 1,
        y: 1,
        w: 8,
        h: 1.5,
        fontSize: 36,
        fontFace: 'Arial',
        bold: true,
        color: '333333',
        align: 'center'
      });
      
      // Add subtitle
      slide1.addText('Generated with AI Presentation Generator', {
        x: 1,
        y: 3,
        w: 8,
        h: 0.5,
        fontSize: 20,
        fontFace: 'Arial',
        color: '666666',
        align: 'center'
      });
      
      // Process slides using a simpler approach
      if (res.data.slides && Array.isArray(res.data.slides) && res.data.slides.length > 0) {
        console.log(`Processing ${res.data.slides.length} slides with simplified approach`);
        
        // Iterate through each slide
        for (let i = 0; i < res.data.slides.length; i++) {
          try {
            const slideData = res.data.slides[i];
            if (!slideData) continue;
            
            const slideId = typeof slideData === 'object' && slideData !== null && 'id' in slideData 
              ? String(slideData.id) 
              : `slide-${i+1}`;
            
            console.log(`Processing slide ${i+1}:`, slideId);
            
            // Create a new slide
            const contentSlide = pptx.addSlide();
            
            // Add a basic title for each slide
            contentSlide.addText(`Slide ${i+1}`, {
              x: 1,
              y: 0.5,
              w: 8,
              h: 1,
              fontSize: 24,
              fontFace: 'Arial',
              bold: true,
              color: '333333',
              align: 'center'
            });
            
            // Simplify content processing by just extracting key info
            if (typeof slideData === 'object' && slideData !== null) {
              if ('slideName' in slideData && slideData.slideName) {
                // Add slide name as a subtitle
                contentSlide.addText(String(slideData.slideName), {
                  x: 1,
                  y: 1.5,
                  w: 8,
                  h: 0.5,
                  fontSize: 18,
                  fontFace: 'Arial',
                  italic: true,
                  color: '666666',
                  align: 'center'
                });
              }
              
              // Add simple text extraction - just the first level of text found
              const extractedTexts = extractTextFromSlide(slideData);
              if (extractedTexts.length > 0) {
                extractedTexts.forEach((text, idx) => {
                  contentSlide.addText(text, {
                    x: 1,
                    y: 2.5 + (idx * 0.6),
                    w: 8,
                    h: 0.5,
                    fontSize: 14,
                    fontFace: 'Arial',
                    color: '333333'
                  });
                });
              } else {
                contentSlide.addText('This slide has no text content', {
                  x: 1,
                  y: 2.5,
                  w: 8,
                  h: 0.5,
                  fontSize: 14,
                  fontFace: 'Arial',
                  color: '666666',
                  align: 'center'
                });
              }
            }
          } catch (slideErr) {
            console.error(`Error processing slide ${i+1}:`, slideErr);
          }
        }
      }
      
      // Generate the PPTX file as a buffer using a simpler approach
      console.log('Generating PPTX buffer...');
      const buffer = await pptx.write({ outputType: 'nodebuffer' });
      console.log('Buffer generated successfully');
      
      // Return the file
      return new NextResponse(buffer, {
        headers: {
          'Content-Type': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
          'Content-Disposition': `attachment; filename="presentation-${presentationId}.pptx"`,
        },
      });
    } catch (pptxError) {
      console.error('PPTX generation error:', pptxError);
      
      // If PPTX generation fails, return a JSON response with the error
      return NextResponse.json({
        error: 'Failed to generate PPTX',
        message: 'There was an error generating the presentation file.',
        details: String(pptxError)
      }, { status: 500 });
    }
  } catch (error) {
    console.error('Download error:', error);
    return NextResponse.json(
      { error: 'Failed to generate PPTX', details: String(error) },
      { status: 500 }
    );
  }
}

// Simple helper to extract text from slide data
function extractTextFromSlide(slideData: any): string[] {
  const texts: string[] = [];
  
  try {
    // Function to recursively extract text from content
    function extractText(item: any) {
      if (!item) return;
      
      // If it's a string, add it
      if (typeof item === 'string' && item.trim()) {
        texts.push(item);
        return;
      }
      
      // If it's an object
      if (typeof item === 'object') {
        // Check for text content as string
        if (item.content && typeof item.content === 'string' && item.content.trim()) {
          texts.push(item.content);
        }
        
        // Check for text
        if (item.text && typeof item.text === 'string' && item.text.trim()) {
          texts.push(item.text);
        }
        
        // For arrays of strings (like bullet lists)
        if (Array.isArray(item.content) && item.type === 'bulletList') {
          item.content.forEach((bullet: any) => {
            if (typeof bullet === 'string' && bullet.trim()) {
              texts.push(`• ${bullet}`);
            }
          });
        } else if (Array.isArray(item.content) && item.type === 'numberedList') {
          item.content.forEach((point: any, idx: number) => {
            if (typeof point === 'string' && point.trim()) {
              texts.push(`${idx + 1}. ${point}`);
            }
          });
        } else if (Array.isArray(item.content)) {
          // Recursively process content array
          item.content.forEach(extractText);
        }
        
        // Process content property recursively if it's an object
        if (item.content && typeof item.content === 'object' && !Array.isArray(item.content)) {
          extractText(item.content);
        }
      }
    }
    
    // Start extraction with the slide content
    if (slideData.content) {
      extractText(slideData.content);
    }
    
  } catch (error) {
    console.error('Error extracting text:', error);
  }
  
  // Limit to first 10 texts to avoid overloading the slide
  return texts.slice(0, 10);
}

// Helper function to process slide content
function processSlideContent(pptxSlide: any, content: any) {
  if (!content) {
    console.log('No content found');
    return;
  }
  
  // If content is an array, process each item
  if (Array.isArray(content)) {
    console.log(`Processing array of ${content.length} items`);
    content.forEach((item, index) => {
      try {
        processContentItem(pptxSlide, item, index);
      } catch (itemErr) {
        console.error(`Error processing array item ${index}:`, itemErr);
      }
    });
    return;
  }
  
  // If content is an object (potentially a ContentItem), process it
  if (content && typeof content === 'object') {
    console.log(`Processing content object of type: ${content.type}`);
    processContentItem(pptxSlide, content, 0);
    return;
  }
  
  // If content is a string, add it as text
  if (typeof content === 'string') {
    console.log('Processing string content');
    pptxSlide.addText(content, {
      x: 1,
      y: 1,
      fontSize: 18
    });
    return;
  }
  
  console.log('Unrecognized content format:', typeof content);
}

// Process a single content item
function processContentItem(pptxSlide: any, item: any, index: number) {
  if (!item) {
    console.log('Empty item, skipping');
    return;
  }
  
  console.log(`Processing item ${index}, type:`, item.type || 'unknown');
  
  // Handle different content types based on the ContentType enum
  switch (item.type) {
    case 'title':
    case 'heading1':
    case 'heading2':
    case 'heading3':
      // Add headings with appropriate styling
      addTextElement(pptxSlide, item, {
        fontSize: getHeadingFontSize(item.type),
        bold: true,
        y: index * 0.6 + 0.5
      });
      break;
      
    case 'paragraph':
    case 'text':
      // Add paragraph text
      addTextElement(pptxSlide, item, {
        fontSize: 14,
        y: index * 0.6 + 0.5
      });
      break;
      
    case 'image':
      // Add image
      addImageElement(pptxSlide, item);
      break;
      
    case 'bulletList':
      // Process bullet list
      addBulletList(pptxSlide, item, index);
      break;
      
    case 'numberedList':
      // Process numbered list
      addNumberedList(pptxSlide, item, index);
      break;
      
    case 'column':
    case 'row':
    case 'resizable-column':
      // Process container elements recursively
      if (item.content) {
        console.log(`Processing ${item.type} container with content:`, 
                   Array.isArray(item.content) ? `array[${item.content.length}]` : typeof item.content);
        processSlideContent(pptxSlide, item.content);
      }
      break;
      
    default:
      console.log(`Unhandled content type: ${item.type}`);
      // If type is unknown but content exists, try to process it
      if (item.content) {
        processSlideContent(pptxSlide, item.content);
      } else if (item.text) {
        // Fallback for text content
        pptxSlide.addText(item.text, {
          x: 1,
          y: index * 0.6 + 0.5,
          fontSize: 12
        });
      }
  }
}

// Helper to add text elements with consistent styling
function addTextElement(pptxSlide: any, item: any, options: any = {}) {
  const textContent = extractTextContent(item);
  if (!textContent) return;
  
  pptxSlide.addText(textContent, {
    x: 0.5,
    y: 0.5,
    w: 9,
    fontSize: 12,
    color: '333333',
    ...options
  });
}

// Helper to extract text content from various possible formats
function extractTextContent(item: any): string {
  if (!item) return '';
  
  if (typeof item.content === 'string') {
    return item.content || item.placeholder || '';
  }
  
  if (typeof item.text === 'string') {
    return item.text;
  }
  
  if (item.name && typeof item.name === 'string' && !item.content) {
    return item.name;
  }
  
  return item.placeholder || '';
}

// Helper to add image elements
function addImageElement(pptxSlide: any, item: any) {
  let imageSrc = '';
  
  if (typeof item.content === 'string' && item.content.startsWith('http')) {
    imageSrc = item.content;
  } else if (item.src && typeof item.src === 'string') {
    imageSrc = item.src;
  } else if (item.url && typeof item.url === 'string') {
    imageSrc = item.url;
  }
  
  if (!imageSrc) {
    console.log('No valid image source found');
    return;
  }
  
  console.log('Adding image:', imageSrc);
  
  try {
    pptxSlide.addImage({
      path: imageSrc,
      x: 1,
      y: 1,
      w: 4,
      h: 3
    });
  } catch (imageErr) {
    console.error('Error adding image:', imageErr);
    // Add placeholder text instead
    pptxSlide.addText('[Image could not be loaded]', {
      x: 1,
      y: 1,
      w: 4,
      color: 'CC0000'
    });
  }
}

// Helper to add bullet lists
function addBulletList(pptxSlide: any, item: any, startIndex: number) {
  if (!item.content || !Array.isArray(item.content)) {
    console.log('Bullet list has no valid content array');
    return;
  }
  
  item.content.forEach((bulletItem: string, i: number) => {
    pptxSlide.addText(bulletItem, {
      x: 0.7,
      y: startIndex * 0.6 + i * 0.4 + 0.5,
      w: 8.5,
      bullet: { type: 'bullet' }
    });
  });
}

// Helper to add numbered lists
function addNumberedList(pptxSlide: any, item: any, startIndex: number) {
  if (!item.content || !Array.isArray(item.content)) {
    console.log('Numbered list has no valid content array');
    return;
  }
  
  item.content.forEach((listItem: string, i: number) => {
    pptxSlide.addText(listItem, {
      x: 0.7,
      y: startIndex * 0.6 + i * 0.4 + 0.5,
      w: 8.5,
      bullet: { type: 'number' }
    });
  });
}

// Get appropriate font size for heading levels
function getHeadingFontSize(headingType: string): number {
  switch (headingType) {
    case 'title': return 32;
    case 'heading1': return 24;
    case 'heading2': return 20;
    case 'heading3': return 18;
    default: return 16;
  }
}

// Map shape types to PptxGenJS shape types
// Commented out as it's currently unused
// function mapShapeType(type: string): string {
//   const shapeMap: {[key: string]: string} = {
//     'rect': 'rect',
//     'rectangle': 'rect',
//     'circle': 'ellipse',
//     'ellipse': 'ellipse',
//     'triangle': 'triangle',
//     'line': 'line',
//     'arrow': 'rightArrow'
//   };
//   
//   return shapeMap[type.toLowerCase()] || 'rect';
// } 