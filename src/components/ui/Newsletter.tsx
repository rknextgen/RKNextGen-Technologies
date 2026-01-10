'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Check, Loader2 } from 'lucide-react';

export const Newsletter = () => {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;

        setStatus('loading');

        try {
            const response = await fetch('/api/newsletter', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });

            if (!response.ok) {
                throw new Error('Failed to subscribe');
            }

            setStatus('success');
            setEmail('');
        } catch (error) {
            console.error('Subscription error:', error);
            setStatus('idle'); // Reset to idle on error so user can try again
            // Optionally show error message
        }

        setTimeout(() => setStatus('idle'), 3000);
    };

    return (
        <div className="w-full max-w-md">
            <h3 className="text-white font-semibold mb-4">Subscribe to our Newsletter</h3>
            <form onSubmit={handleSubmit} className="relative">
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    disabled={status !== 'idle'}
                    className="w-full bg-white/5 border border-white/10 rounded-full px-5 py-3 pr-14 text-white placeholder:text-gray-500 focus:outline-none focus:border-cyan focus:shadow-[0_0_15px_rgba(0,194,217,0.2)] transition-all disabled:opacity-50"
                />

                <button
                    type="submit"
                    disabled={status !== 'idle'}
                    className="absolute right-1.5 top-1.5 bottom-1.5 w-10 h-10 rounded-full bg-cyan/10 hover:bg-cyan/20 flex items-center justify-center text-cyan transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {status === 'loading' ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                    ) : status === 'success' ? (
                        <Check className="w-4 h-4" />
                    ) : (
                        <Send className="w-4 h-4 ml-0.5" />
                    )}
                </button>
            </form>
            {status === 'success' && (
                <motion.p
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-cyan text-xs mt-2 ml-2"
                >
                    Successfully subscribed to updates!
                </motion.p>
            )}
        </div>
    );
};
