'use client';

import usePromptStore from '@/store/usePromptStore';
import { AnimatePresence, motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import React from 'react';
import CreatePage from './CreatePage/CreatePage';

const RenderPage = () => {
    const router = useRouter();

    const { page, setPage } = usePromptStore();

    const renderStep = () => {
        switch (page) {
            case 'create':
                return <CreatePage />
            case 'creative-ai':
                return <div className='w-full h-full bg-green-500'>Creative AI</div>
            case 'create-scratch':
                return <div className='w-full h-full bg-blue-500'>Create Scratch</div>
            default:
                return null
        }
    }

    return <AnimatePresence mode="wait">
        <motion.div
            key={page}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
        >
            {renderStep()}
        </motion.div>
    </AnimatePresence>
}

export default RenderPage