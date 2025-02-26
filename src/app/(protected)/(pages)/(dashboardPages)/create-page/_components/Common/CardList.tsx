'use client';

import { OutlineCard } from '@/lib/types'
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Card from './Card';

type Props = {
    outlines: OutlineCard[]
    editingCard: string | null
    selectedCard: string | null
    editText: string
    addOutline?: (card: OutlineCard) => void
    onEditChange: (value: string) => void
    onCardSelect: (id: string) => void
    onCardDoubleClick: (id: string, title: string) => void
    setEditText: (value: string) => void
    setEditingCard: (id: string | null) => void
    setSelectedCard: (id: string | null) => void
    addMultipleOutlines: (cards: OutlineCard[]) => void
}

const CardList = (props: Props) => {
    const { outlines, editingCard, selectedCard, editText, addOutline, onEditChange,
        onCardSelect, onCardDoubleClick, setEditText, setEditingCard, setSelectedCard, addMultipleOutlines } = props;

    const [draggedItem, setDraggedItem] = useState<OutlineCard | null>(null);
    const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

    const onDragOver = (e: React.DragEvent, index: number) => {
        e.preventDefault()
        if (!draggedItem) return

        const rect = e.currentTarget.getBoundingClientRect();
        const y = e.clientY - rect.top;
        const treshold = rect.height / 2;
        if (y < treshold) {
            setDragOverIndex(index)
        } else {
            setDragOverIndex(index + 1)
        }
    }

    const onDrop = (e: React.DragEvent) => {
        e.preventDefault()
        if (!draggedItem || dragOverIndex === null) return

        const updatedCards = [...outlines];
        const draggedIndex = updatedCards.findIndex((card) => card.id === draggedItem.id);

        if (draggedIndex === -1 || draggedIndex === dragOverIndex) return

        const [removedCard] = updatedCards.splice(draggedIndex, 1);
        updatedCards.splice(dragOverIndex > draggedIndex ? dragOverIndex - 1 : dragOverIndex, 0, removedCard);
        addMultipleOutlines(
            updatedCards.map((card, index) => ({ ...card, order: index + 1 }))
        )
        setDraggedItem(null);
        setDragOverIndex(null)
    }

    return (

        <motion.div
            className="space-y-2 -my-2"
            layout
            onDragOver={(e) => {
                e.preventDefault()
                if (
                    outlines.length === 0 ||
                    e.clientY > e.currentTarget.getBoundingClientRect().bottom - 20
                ) {
                    onDragOver(e, outlines.length)
                }
            }}
            onDrop={(e) => {
                e.preventDefault();
                onDrop(e);
            }}
        >
            <AnimatePresence>
                {outlines.map((card, idex) => (
                    <React.Fragment key={card.id}>
                        <Card />
                    </React.Fragment>
                ))}
            </AnimatePresence>
        </motion.div >
    )
}

export default CardList