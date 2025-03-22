"use client"

import { createContext, useContext, useEffect, useState } from "react"

type Theme = "dark" | "light" | "system"
type FontSize = "small" | "medium" | "large"

interface ThemeProviderProps {
  children: React.ReactNode
}

interface ThemeContextType {
  theme: Theme
  setTheme: (theme: Theme) => void
  fontSize: FontSize
  setFontSize: (size: FontSize) => void
  systemTheme?: "dark" | "light" // Add for compatibility with next-themes
}

const initialThemeContext: ThemeContextType = {
  theme: "system",
  setTheme: () => null,
  fontSize: "medium",
  setFontSize: () => null,
}

const ThemeContext = createContext<ThemeContextType>(initialThemeContext)

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>("system")
  const [fontSize, setFontSize] = useState<FontSize>("medium")
  const [systemTheme, setSystemTheme] = useState<"dark" | "light">("light")
  const [isLoaded, setIsLoaded] = useState(false)

  // Detect system theme
  useEffect(() => {
    const detectSystemTheme = () => {
      const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches
      setSystemTheme(isDark ? "dark" : "light")
    }
    
    detectSystemTheme()
    
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")
    mediaQuery.addEventListener("change", detectSystemTheme)
    
    return () => {
      mediaQuery.removeEventListener("change", detectSystemTheme)
    }
  }, [])

  useEffect(() => {
    // Load from localStorage on initial mount
    const loadPreferences = () => {
      try {
        if (typeof window !== "undefined") {
          const savedPreferences = localStorage.getItem("userPreferences")
          if (savedPreferences) {
            const { theme, fontSize } = JSON.parse(savedPreferences)
            if (theme) setTheme(theme as Theme)
            if (fontSize) setFontSize(fontSize as FontSize)
          }
          setIsLoaded(true)
        }
      } catch (error) {
        console.error("Error loading theme preferences:", error)
        setIsLoaded(true)
      }
    }

    loadPreferences()
  }, [])

  useEffect(() => {
    if (!isLoaded) return

    // Apply theme
    const root = document.documentElement
    
    if (theme === "system") {
      root.classList.toggle("dark", systemTheme === "dark")
    } else {
      root.classList.toggle("dark", theme === "dark")
    }

    // Apply font size
    root.dataset.fontSize = fontSize

    // Save to localStorage
    localStorage.setItem(
      "userPreferences",
      JSON.stringify({
        theme,
        fontSize,
      })
    )
  }, [theme, fontSize, systemTheme, isLoaded])

  const value = {
    theme,
    setTheme,
    fontSize,
    setFontSize,
    systemTheme
  }

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => useContext(ThemeContext)
