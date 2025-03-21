import { persist } from 'zustand/middleware'
import { create } from 'zustand';
import { devtools } from 'zustand/middleware'
import { OutlineCard } from '@/lib/types';

interface OutlineStore {
    outlines: OutlineCard[],
    resetOutlines: () => void,
    addOutline: (outline: OutlineCard) => void,
    addMultipleOutlines: (outlines: OutlineCard[]) => void,
}

const useScratchStore = create<OutlineStore>()(
    devtools(
        persist(
            (set) => ({
                outlines: [],
                resetOutlines: () => {
                    set({ outlines: [] })
                },
                addOutline: (outline: OutlineCard) => {
                    set((state) => ({
                        outlines: [...state.outlines, outline],
                    }))
                },
                addMultipleOutlines: (outlines: OutlineCard[]) => {
                    set(() => ({
                        outlines: [...outlines],
                    }))
                },
            }),
            { name: 'scratch' }
        )
    )
)

export default useScratchStore;