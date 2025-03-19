'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

type Props = {
    onAddCard: () => void;
}

const AddCardButton = ({ onAddCard }: Props) => {
    const [showGap, setShowGap] = React.useState(false);
    return (
        <motion.div
            className="w-full relative group cursor-pointer"
            initial={{ height: '0.5rem' }}
            animate={{
                height: showGap ? '2rem' : '0.5rem',
                transition: { duration: 0.3, ease: 'easeInOut' },
            }}
            onHoverStart={() => setShowGap(true)}
            onHoverEnd={() => setShowGap(false)}
        >
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <Plus className="h-3 w-3 text-primary/20 group-hover:text-primary/40 transition-colors duration-200" />
            </div>

            <AnimatePresence>
                {showGap && (
                    <motion.div
                        key="gap-animation"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2, delay: 0.1 }}
                        className="absolute inset-0 flex items-center justify-center"
                    >
                        <div className="flex items-center justify-center w-full gap-2">
                            <div className="w-[40%] h-[1px] bg-primary" />
                            <Button
                                variant="outline"
                                size="sm"
                                className="rounded-full h-8 w-8 p-0 bg-primary hover:bg-primary cursor-pointer"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onAddCard();
                                }}
                                aria-label="Add new card"
                            >
                                <Plus className="h-4 w-4 text-black" />
                            </Button>
                            <div className="w-[40%] h-[1px] bg-primary" />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default AddCardButton;