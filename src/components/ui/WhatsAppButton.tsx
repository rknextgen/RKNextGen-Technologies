'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { MessageCircle } from 'lucide-react';

export const WhatsAppButton = () => {
    const phoneNumber = '918823857525'; // +91 8823857525
    const message = 'Hi, I would like to discuss a project with RK NextGen Technologies.';

    const handleClick = () => {
        const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
        window.open(url, '_blank');
    };

    return (
        <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleClick}
            className="fixed bottom-8 right-8 z-40 flex items-center justify-center w-14 h-14 bg-[#25D366] rounded-full shadow-[0_0_20px_rgba(37,211,102,0.4)] hover:shadow-[0_0_30px_rgba(37,211,102,0.6)] transition-all duration-300 group"
        >
            <div className="absolute inset-0 rounded-full border-2 border-white/20 animate-ping opacity-20" />
            <MessageCircle className="w-7 h-7 text-white fill-white" />

            {/* Tooltip */}
            <div className="absolute right-full mr-4 px-3 py-1.5 bg-navy/90 backdrop-blur border border-white/10 rounded-lg text-white text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                Chat with us
            </div>
        </motion.button>
    );
};
