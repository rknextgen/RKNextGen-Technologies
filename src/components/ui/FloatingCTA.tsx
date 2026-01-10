'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { QuoteModal } from './QuoteModal';

export const FloatingCTA = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <>
            <div className="fixed bottom-8 left-8 z-40 hidden md:block">
                <motion.button
                    initial={{ opacity: 0, scale: 0.8, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsModalOpen(true)}
                    className="group relative flex items-center gap-3 pl-4 pr-6 py-3 bg-navy/80 backdrop-blur-md border border-cyan/30 rounded-full shadow-[0_0_20px_rgba(0,194,217,0.2)] hover:shadow-[0_0_30px_rgba(0,194,217,0.4)] hover:border-cyan transition-all duration-300"
                >
                    {/* Pulsing dot */}
                    <span className="relative flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan"></span>
                    </span>

                    <span className="text-white font-medium group-hover:text-cyan transition-colors">
                        Start a Project
                    </span>

                    <div className="absolute -top-1 -right-1">
                        <Sparkles className="w-4 h-4 text-ai-purple animate-pulse" />
                    </div>
                </motion.button>
            </div>

            <QuoteModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </>
    );
};
