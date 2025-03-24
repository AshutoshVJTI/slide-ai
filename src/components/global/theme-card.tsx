import React, { useState, useEffect } from 'react'
import { Theme } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface ThemeCardProps {
  theme: Theme
  onPreview?: () => void
}

// Array of slide types to showcase in the preview
const slideTypes = [
  { name: 'Title', content: 'Main Title' },
  { name: 'Content', content: 'Bullet Points' },
  { name: 'Split', content: 'Text & Image' },
  { name: 'Quote', content: 'Testimonial' },
]

export const ThemeCard: React.FC<ThemeCardProps> = ({ theme, onPreview }) => {
  const [currentSlide, setCurrentSlide] = useState(0)
  
  const handlePreviewClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (onPreview) {
      onPreview()
    }
  }

  // Auto rotate slides
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slideTypes.length)
    }, 3000) // Change slide every 3 seconds
    
    return () => clearInterval(interval)
  }, [])

  const nextSlide = (e: React.MouseEvent) => {
    e.stopPropagation()
    setCurrentSlide((prev) => (prev + 1) % slideTypes.length)
  }
  
  const prevSlide = (e: React.MouseEvent) => {
    e.stopPropagation()
    setCurrentSlide((prev) => (prev - 1 + slideTypes.length) % slideTypes.length)
  }

  return (
    <Card className="overflow-hidden border shadow-sm transition-all hover:shadow-md h-full">
      <CardHeader 
        className="p-0 h-48 flex items-center justify-center relative" 
        style={{ 
          background: theme.gradientBackground || theme.backgroundColor,
          fontFamily: theme.fontFamily
        }}
      >
        <button 
          className="absolute left-2 z-10 w-6 h-6 flex items-center justify-center rounded-full bg-white/30 text-white"
          onClick={prevSlide}
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        
        <div 
          className="w-4/5 h-36 rounded-md flex flex-col items-center justify-center relative overflow-hidden"
          style={{ 
            backgroundColor: theme.slideBackgroundColor,
            color: theme.fontColor
          }}
        >
          {slideTypes.map((slide, index) => (
            <div 
              key={slide.name}
              className={`absolute inset-0 w-full h-full transition-opacity duration-500 flex flex-col items-center justify-center ${currentSlide === index ? 'opacity-100' : 'opacity-0'}`}
            >
              {index === 0 && (
                <h3 
                  className="text-xl font-bold mb-2" 
                  style={{ color: theme.accentColor }}
                >
                  {slide.content}
                </h3>
              )}
              
              {index === 1 && (
                <div className="w-3/4 flex flex-col items-start">
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: theme.accentColor }}></div>
                    <span style={{ color: theme.fontColor }}>Point One</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: theme.accentColor }}></div>
                    <span style={{ color: theme.fontColor }}>Point Two</span>
                  </div>
                </div>
              )}
              
              {index === 2 && (
                <div className="w-full h-full flex">
                  <div className="w-1/2 h-full flex items-center justify-center" style={{ borderRight: `1px solid ${theme.accentColor}20` }}>
                    <div className="w-8 h-8 rounded bg-gray-300"></div>
                  </div>
                  <div className="w-1/2 h-full flex items-center justify-center">
                    <span style={{ color: theme.fontColor }}>Text</span>
                  </div>
                </div>
              )}
              
              {index === 3 && (
                <div className="flex flex-col items-center px-4">
                  <span className="text-xl" style={{ color: theme.accentColor }}>&quot;</span>
                  <span className="text-xs text-center" style={{ color: theme.fontColor }}>
                    Quote text
                  </span>
                </div>
              )}
              
              <div className="absolute bottom-1 right-1 text-xs opacity-50">
                {slide.name}
              </div>
            </div>
          ))}
        </div>
        
        <button 
          className="absolute right-2 z-10 w-6 h-6 flex items-center justify-center rounded-full bg-white/30 text-white"
          onClick={nextSlide}
        >
          <ChevronRight className="w-4 h-4" />
        </button>
        
        {/* Pagination dots */}
        <div className="absolute bottom-2 flex gap-1">
          {slideTypes.map((_, index) => (
            <div 
              key={index} 
              className={`w-1.5 h-1.5 rounded-full ${currentSlide === index ? 'bg-white' : 'bg-white/30'}`}
            />
          ))}
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <CardTitle className="text-lg">{theme.name}</CardTitle>
        <div className="mt-2 flex gap-2">
          <div className="flex gap-1 flex-wrap">
            <div 
              className="w-6 h-6 rounded-full border" 
              title="Background Color"
              style={{ backgroundColor: theme.backgroundColor }} 
            />
            <div 
              className="w-6 h-6 rounded-full border" 
              title="Slide Background Color"
              style={{ backgroundColor: theme.slideBackgroundColor }} 
            />
            <div 
              className="w-6 h-6 rounded-full border" 
              title="Accent Color"
              style={{ backgroundColor: theme.accentColor }} 
            />
            <div 
              className="w-6 h-6 rounded-full border flex items-center justify-center text-xs" 
              title="Font Color"
              style={{ backgroundColor: theme.fontColor, color: theme.fontColor === '#ffffff' ? '#000000' : '#ffffff' }} 
            >
              Aa
            </div>
          </div>
        </div>
        <div className="mt-2 text-xs text-gray-500">
          Font: {theme.fontFamily.split(',')[0].replace(/'/g, '')}
        </div>
        <div className="mt-1 text-xs text-gray-500">
          Type: {theme.type === 'dark' ? 'Dark Mode' : 'Light Mode'}
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button 
          variant="outline" 
          className="w-full" 
          style={{ borderColor: theme.accentColor, color: theme.accentColor }}
          onClick={handlePreviewClick}
        >
          Preview
        </Button>
      </CardFooter>
    </Card>
  )
} 