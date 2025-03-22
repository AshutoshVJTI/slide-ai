'use client'

import React, { useState } from 'react'
import { themes } from '@/lib/constants'
import { ThemeCard } from '@/components/global/theme-card'
import { ThemePreview } from '@/components/global/theme-preview'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Theme } from '@/lib/types'

const TemplatesPage = () => {
  const [selectedTheme, setSelectedTheme] = useState<Theme>(themes[0])
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)

  const handlePreview = (theme: Theme) => {
    setSelectedTheme(theme)
    setIsPreviewOpen(true)
  }

  return (
    <div className="w-full flex flex-col gap-6 relative md:p-0 p-4">
      <div className="flex flex-col-reverse items-start w-full gap-6 sm:flex-row sm:justify-between sm:items-center">
        <div className="flex flex-col items-start">
          <h1 className="text-2xl font-semibold dark:text-primary backdrop-blur-lg">
            Templates
          </h1>
          <p className="text-base font-normal dark:text-secondary">
            Choose a template for your presentation
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {themes.map((theme) => (
          <div key={theme.name} className="cursor-pointer">
            <ThemeCard 
              theme={theme} 
              onPreview={() => handlePreview(theme)} 
            />
          </div>
        ))}
      </div>

      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="sm:max-w-3xl h-[80vh]">
          <DialogHeader>
            <DialogTitle>{selectedTheme.name} Preview</DialogTitle>
          </DialogHeader>
          <div className="flex-1 overflow-hidden">
            <ThemePreview theme={selectedTheme} />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default TemplatesPage