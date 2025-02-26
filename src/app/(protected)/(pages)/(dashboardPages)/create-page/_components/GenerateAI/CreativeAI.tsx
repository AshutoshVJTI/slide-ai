'use client'

import { useRouter } from 'next/navigation';
import React from 'react';
import { motion } from 'framer-motion';
import { containerVariants, itemVariants } from '@/lib/constants';
import { Button } from '@/components/ui/button';
import { ChevronLeft, Loader2, RotateCcw } from 'lucide-react';
import { Input } from '@/components/ui/input';
import useCreativeAIStore from '@/store/useCreativeAiStore';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import CardList from '../Common/CardList';

type Props = {
    onBack: () => void;
}

const CreativeAI = ({
    onBack
}: Props) => {
    const router = useRouter();
    const { currentAiPrompt, setCurrentAiPrompt, outlines, resetOutlines, addOutline, addMultipleOutlines } = useCreativeAIStore();
    const [noOfCards, setNoOfCards] = React.useState(0);
    const [editingCard, setEditingCard] = React.useState<string | null>(null);
    const [isGenerating, setIsGenerating] = React.useState(false);
    const [selectedCard, setSelectedCard] = React.useState<string | null>(null);
    const [editText, setEditText] = React.useState('');

    const handleBack = () => {
        onBack();
    }

    const resetCards = () => {
        setEditingCard(null);
        setSelectedCard(null);
        setEditText('');

        setCurrentAiPrompt('');
        resetOutlines();
    }

    // const generateOutline = () => {}  //TODO: Implement this function

    return (
        <motion.div
            className='space-y-6 w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8'
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            <Button
                onClick={handleBack}
                variant="outline"
                className='mb-4'>
                <ChevronLeft className="mr-2 h-4 w-4" />
                Back
            </Button>
            <motion.div
                variants={itemVariants}
                className="text-center space-y-2">
                <h1 className="text-4xl font-bold text-primary">Creative AI</h1>
                <p className='text-secondary'>What would you like to create today?</p>
            </motion.div>
            <motion.div
                className='bg-primary/10 p-4 rounded-xl'
                variants={itemVariants}>
                <div className="flex flex-col sm:flex-row justify-between gap-3 items-center rounded-xl">
                    <Input
                        placeholder='Enter prompt and add to the cards...'
                        className='text-base sm:text-xl border-0 focus-visible:ring-0 shadow-none p-0 bg-transparent flex-grow'
                        required
                        value={currentAiPrompt}
                        onChange={(e) => setCurrentAiPrompt(e.target.value)}
                    />
                    <div className="flex items-center gap-3">
                        <Select value={noOfCards.toString()} onValueChange={(val) => setNoOfCards(parseInt(val))}>
                            <SelectTrigger className="w-fit gap-2 font-semibold shadow-xl">
                                <SelectValue placeholder="Select number of cards" />
                            </SelectTrigger>
                            <SelectContent className="w-fit">{outlines.length === 0 ? (
                                <SelectItem value="0" className="font-semibold">No cards</SelectItem>
                            ) : (
                                Array.from({ length: outlines.length }, (_, i) => i + 1).map((num) => (
                                    <SelectItem key={num} value={num.toString()} className="font-semibold">
                                        {num} {num === 1 ? 'card' : 'cards'}
                                    </SelectItem>
                                ))
                            )}
                            </SelectContent>
                        </Select>

                        <Button
                            variant="destructive"
                            onClick={resetCards}
                            size="icon"
                            aria-label="Reset cards"
                        >
                            <RotateCcw className='h-4 w-4' />
                        </Button>
                    </div>
                </div>
            </motion.div>
            <div className="w-full flex justify-center items-center">
                <Button
                    className="font-medium text-lg gap-2 flex items-center"
                // onClick={generateOutline}
                >
                    {isGenerating ? (
                        <>
                            <Loader2 className='animate-spin mr-2' /> Generating...
                        </>
                    ) : (
                        'Generate Outline'
                    )}
                </Button>
            </div>
            <CardList
                outlines={outlines}
                addOutline={addOutline}
                editingCard={editingCard}
                selectedCard={selectedCard}
                editText={editText}
                onEditChange={setEditText}
                onCardSelect={setSelectedCard}
                onCardDoubleClick={(id, title) => {
                    setEditingCard(id);
                    setEditText(title);
                }}
                setEditText={setEditText}
                setEditingCard={setEditingCard}
                setSelectedCard={setSelectedCard}
                addMultipleOutlines={addMultipleOutlines}
            />
        </motion.div>
    )
}

export default CreativeAI