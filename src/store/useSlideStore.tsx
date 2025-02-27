import { persist } from 'zustand/middleware'
import { create } from 'zustand';
import { Slide, Theme } from '@/lib/types';
import { Project } from '@prisma/client';

interface SlideState {
    slides: Slide[],
    project: Project | null,
    currentTheme: Theme,
    setSlides: (slides: Slide[]) => void,
    setProject: (id: Project) => void,
    setCurrentTheme: (theme: Theme) => void,
}

const defaultTheme: Theme = {
    name: 'Default',
    fontFamily: "'Inter', sans-serif",
    fontColor: '#333333',
    backgroundColor: '#f0f0f0',
    slideBackgroundColor: '#ffffff',
    accentColor: '#3b82f6',
    type: 'light',
}

export const useSlideStore = create(
    persist<SlideState>((set) => ({
        slides: [],
        project: null,
        currentTheme: defaultTheme,
        setSlides: (slides) => set({ slides }),
        setProject: (project) => set({ project }),
        setCurrentTheme: (theme) => set({ currentTheme: theme }),
    }), {
        name: 'slides-storage',
    })
)