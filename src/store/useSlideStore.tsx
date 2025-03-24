import { persist } from 'zustand/middleware'
import { create } from 'zustand';
import { ContentItem, Slide, Theme } from '@/lib/types';
import { Project } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';

interface SlideState {
    slides: Slide[],
    project: Project | null,
    currentTheme: Theme,
    currentSlide: number,
    setSlides: (slides: Slide[]) => void,
    removeSlide: (id: string) => void,
    addSlideAtIndex: (slide: Slide, index: number) => void,
    setProject: (id: Project) => void,
    setCurrentTheme: (theme: Theme) => void,
    getOrderedSlides: () => Slide[],
    reorderSlides: (fromIndex: number, toIndex: number) => void,
    setCurrentSlide(index: number): void,
    updateContentItem: (slideId: string, contentId: string, newContent: string | string[] | string[][]) => void,
    addComponentInSlide: (
        slideId: string,
        item: ContentItem,
        index: number,
        parentId: string,
    ) => void,
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
    persist<SlideState>((set, get) => ({
        slides: [],
        project: null,
        currentTheme: defaultTheme,
        currentSlide: 0,
        setSlides: (slides) => set({ slides }),
        removeSlide: (id) => set((state) => ({
            slides: state.slides.filter((slide) => slide.id !== id)
        })),
        addSlideAtIndex: (slide, index) => set((state) => {
            const newSlides = [...state.slides];
            newSlides.splice(index, 0, { ...slide, id: uuidv4() });
            newSlides.forEach((slide, index) => {
                slide.slideOrder = index;
            });
            return { slides: newSlides, currentSlide: index };
        }),
        setProject: (project) => set({ project }),
        setCurrentTheme: (theme) => set({ currentTheme: theme }),
        getOrderedSlides: () => {
            const state = get();
            return (state.slides || []).slice().sort((a, b) => a.slideOrder - b.slideOrder);
        },
        setCurrentSlide: (index) => set({ currentSlide: index }),
        updateContentItem: (slideId, contentId, newContent) => set((state) => {
            const updateContentRecursively = (item: ContentItem): ContentItem => {
                if (item.id === contentId) {
                    return {
                        ...item,
                        content: newContent
                    }
                }
                if (Array.isArray(item.content) && item.content.every((i) => typeof i !== 'string')) {
                    return {
                        ...item,
                        content: item.content.map((subItem) => {
                            if (typeof subItem !== 'string') {
                                return updateContentRecursively(subItem as ContentItem)
                            }
                            return subItem
                        }) as ContentItem[]
                    }
                }
                return item
            }
            return {
                slides: state.slides.map((slide) =>
                    slide.id === slideId ? { ...slide, content: updateContentRecursively(slide.content) } : slide
                )
            }
        }),
        addComponentInSlide: (slideId, item, index, parentId) => set((state) => {
            const updatedSlides = state.slides.map((slide) => {
                if (slide.id === slideId) {
                    const updateContentRecursively = (content: ContentItem): ContentItem => {
                        if (content.id === parentId && Array.isArray(content.content)) {
                            const newContent = [...content.content];
                            newContent.splice(index, 0, item);
                            return {
                                ...content,
                                content: newContent as unknown as string[],
                            }
                        }
                        return content
                    }
                    return {
                        ...slide,
                        content: updateContentRecursively(slide.content)
                    }
                }
                return slide
            })
            return {
                slides: updatedSlides
            }
        }
        ),
        reorderSlides: (fromIndex: number, toIndex: number) => {
            set((state) => {
                const newSlides = [...state.slides];
                const [movedSlide] = newSlides.splice(fromIndex, 1);
                newSlides.splice(toIndex, 0, movedSlide);
                return {
                    slides: newSlides.map((slide, index) => ({
                        ...slide,
                        slideOrder: index
                    }))
                };
            });
        }
    }), {
        name: 'slides-storage',
    })
)