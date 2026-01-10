'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export const PageLoader = () => {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 2000); // Simulate initial load time

        return () => clearTimeout(timer);
    }, []);

    return (
        <AnimatePresence>
            {isLoading && (
                <motion.div
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-navy"
                >
                    <div className="relative w-24 h-24 mb-8">
                        {/* Pulsing rings */}
                        <motion.div
                            animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="absolute inset-0 rounded-full border-2 border-cyan/30"
                        />
                        <motion.div
                            animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0, 0.3] }}
                            transition={{ duration: 2, repeat: Infinity, delay: 0.2 }}
                            className="absolute inset-0 rounded-full border-2 border-ai-purple/30"
                        />

                        {/* Logo placeholder */}
                        <div className="absolute inset-0 flex items-center justify-center font-bold text-2xl text-white">
                            RK
                        </div>
                    </div>

                    {/* Progress bar */}
                    <div className="w-48 h-1 bg-white/10 rounded-full overflow-hidden">
                        <motion.div
                            initial={{ x: '-100%' }}
                            animate={{ x: '0%' }}
                            transition={{ duration: 1.5, ease: 'easeInOut' }}
                            className="h-full bg-gradient-to-r from-cyan to-ai-purple"
                        />
                    </div>

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="mt-4 text-cyan text-sm font-medium tracking-widest"
                    >
                        INITIALIZING SYSTEM...
                    </motion.p>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
