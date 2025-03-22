import React, { useState } from 'react'
import { Theme } from '@/lib/types'
import { Card } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

interface ThemePreviewProps {
  theme: Theme
}

export const ThemePreview: React.FC<ThemePreviewProps> = ({ theme }) => {
  const [activeTab, setActiveTab] = useState('title-slide')

  return (
    <div className="w-full h-full flex flex-col">
      {/* Navbar */}
      <div 
        className="w-full h-12 px-4 flex items-center justify-between"
        style={{ 
          backgroundColor: theme.navbarColor,
          color: theme.fontColor,
          fontFamily: theme.fontFamily
        }}
      >
        <div className="font-semibold">Presentation Title</div>
        <div className="flex gap-2">
          <div className="w-8 h-8 rounded-full flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8 3H5a2 2 0 0 0-2 2v3"/><path d="M21 8V5a2 2 0 0 0-2-2h-3"/><path d="M3 16v3a2 2 0 0 0 2 2h3"/><path d="M16 21h3a2 2 0 0 0 2-2v-3"/></svg>
          </div>
          <div className="w-8 h-8 rounded-full flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div 
        className="flex-1 flex gap-4 p-4"
        style={{ 
          backgroundColor: theme.backgroundColor,
          color: theme.fontColor,
          fontFamily: theme.fontFamily
        }}
      >
        {/* Sidebar */}
        <div 
          className="w-48 h-full rounded-md p-3"
          style={{ 
            backgroundColor: theme.sidebarColor || theme.backgroundColor,
            color: theme.fontColor
          }}
        >
          <div className="font-semibold mb-2">Slides</div>
          <div className="space-y-2">
            <Card 
              className={`h-16 flex items-center justify-center p-2 text-sm cursor-pointer transition-all ${activeTab === 'title-slide' ? 'outline outline-2 outline-offset-2' : ''}`}
              style={{ 
                backgroundColor: theme.slideBackgroundColor,
                color: theme.fontColor,
                outlineColor: activeTab === 'title-slide' ? theme.accentColor : 'transparent'
              }}
              onClick={() => setActiveTab('title-slide')}
            >
              Title Slide
            </Card>
            <Card 
              className={`h-16 flex items-center justify-center p-2 text-sm cursor-pointer transition-all ${activeTab === 'content-slide' ? 'outline outline-2 outline-offset-2' : ''}`}
              style={{ 
                backgroundColor: theme.slideBackgroundColor,
                color: theme.fontColor,
                outlineColor: activeTab === 'content-slide' ? theme.accentColor : 'transparent'
              }}
              onClick={() => setActiveTab('content-slide')}
            >
              Content Slide
            </Card>
            <Card 
              className={`h-16 flex items-center justify-center p-2 text-sm cursor-pointer transition-all ${activeTab === 'split-slide' ? 'outline outline-2 outline-offset-2' : ''}`}
              style={{ 
                backgroundColor: theme.slideBackgroundColor,
                color: theme.fontColor,
                outlineColor: activeTab === 'split-slide' ? theme.accentColor : 'transparent'
              }}
              onClick={() => setActiveTab('split-slide')}
            >
              Split Layout
            </Card>
            <Card 
              className={`h-16 flex items-center justify-center p-2 text-sm cursor-pointer transition-all ${activeTab === 'quote-slide' ? 'outline outline-2 outline-offset-2' : ''}`}
              style={{ 
                backgroundColor: theme.slideBackgroundColor,
                color: theme.fontColor,
                outlineColor: activeTab === 'quote-slide' ? theme.accentColor : 'transparent'
              }}
              onClick={() => setActiveTab('quote-slide')}
            >
              Quote Slide
            </Card>
          </div>
        </div>

        {/* Slide preview */}
        <div className="flex-1 flex flex-col">
          {/* Title Slide */}
          {activeTab === 'title-slide' && (
            <div 
              className="w-full flex-1 rounded-md p-6 flex flex-col items-center justify-center"
              style={{ 
                backgroundColor: theme.slideBackgroundColor,
                color: theme.fontColor
              }}
            >
              <h1 
                className="text-4xl font-bold mb-4 text-center"
                style={{ color: theme.accentColor }}
              >
                Presentation Title
              </h1>
              <p className="text-lg mb-8 text-center max-w-md">
                Subtitle or Description Here
              </p>
              <div className="flex items-center gap-2 text-sm opacity-70 mt-8">
                <span>Presenter Name</span>
                <span>•</span>
                <span>Organization</span>
              </div>
            </div>
          )}

          {/* Content Slide */}
          {activeTab === 'content-slide' && (
            <div 
              className="w-full flex-1 rounded-md p-6 flex flex-col"
              style={{ 
                backgroundColor: theme.slideBackgroundColor,
                color: theme.fontColor
              }}
            >
              <h2 
                className="text-2xl font-bold mb-4"
                style={{ color: theme.accentColor }}
              >
                Content Slide Title
              </h2>
              <div className="flex-1">
                <ul className="space-y-4">
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 rounded-full mt-2" style={{ backgroundColor: theme.accentColor }}></div>
                    <div>
                      <span className="font-medium">Main point one</span>
                      <p className="text-sm opacity-80">Supporting details and explanation for the main point</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 rounded-full mt-2" style={{ backgroundColor: theme.accentColor }}></div>
                    <div>
                      <span className="font-medium">Main point two</span>
                      <p className="text-sm opacity-80">Supporting details and explanation for the main point</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 rounded-full mt-2" style={{ backgroundColor: theme.accentColor }}></div>
                    <div>
                      <span className="font-medium">Main point three</span>
                      <p className="text-sm opacity-80">Supporting details and explanation for the main point</p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          )}

          {/* Split Layout */}
          {activeTab === 'split-slide' && (
            <div 
              className="w-full flex-1 rounded-md flex overflow-hidden"
              style={{ 
                backgroundColor: theme.slideBackgroundColor,
                color: theme.fontColor
              }}
            >
              <div className="w-1/2 p-6 flex flex-col">
                <h2 
                  className="text-xl font-bold mb-4"
                  style={{ color: theme.accentColor }}
                >
                  Left Section
                </h2>
                <div className="space-y-2">
                  <p className="text-sm">This is an example of a split layout slide that has content on both sides.</p>
                  <p className="text-sm">You can use this for comparing items or showing text alongside an image.</p>
                </div>
                <div 
                  className="mt-auto self-start p-2 px-3 rounded text-sm"
                  style={{ 
                    backgroundColor: theme.accentColor,
                    color: theme.slideBackgroundColor
                  }}
                >
                  Action Button
                </div>
              </div>
              <div 
                className="w-1/2 flex items-center justify-center"
                style={{ backgroundColor: `${theme.accentColor}10` }}
              >
                <div className="w-32 h-32 rounded bg-gray-300 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
                </div>
              </div>
            </div>
          )}

          {/* Quote Slide */}
          {activeTab === 'quote-slide' && (
            <div 
              className="w-full flex-1 rounded-md p-6 flex flex-col items-center justify-center"
              style={{ 
                backgroundColor: theme.slideBackgroundColor,
                color: theme.fontColor
              }}
            >
              <div className="max-w-2xl flex flex-col items-center">
                <span 
                  className="text-6xl mb-4"
                  style={{ color: theme.accentColor }}
                >
                  "
                </span>
                <p className="text-xl text-center mb-8">
                  This is an example of a quote or testimonial slide showcasing how this theme handles important quoted content.
                </p>
                <div 
                  className="h-px w-16 mb-4"
                  style={{ backgroundColor: theme.accentColor }}
                ></div>
                <div className="text-center">
                  <p className="font-medium">Person Name</p>
                  <p className="text-sm opacity-70">Position, Organization</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 