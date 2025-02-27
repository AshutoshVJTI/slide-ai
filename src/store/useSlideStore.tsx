import { persist } from 'zustand/middleware'
import { create } from 'zustand';
import { Slide } from '@/lib/types';
import { Project } from '@prisma/client';

interface SlideState {
    slides: Slide[],
    project: Project | null,
    setSlides: (slides: Slide[]) => void,
    setProject: (id: Project) => void,
}

export const useSlideStore = create(
    persist<SlideState>((set) => ({
        slides: [],
        project: null,
        setSlides: (slides) => set({ slides }),
        setProject: (project) => set({ project }),
    }), {
        name: 'slides-storage',
    })
)