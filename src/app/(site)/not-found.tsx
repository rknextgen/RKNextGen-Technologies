'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Home } from 'lucide-react';

export default function NotFound() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-navy relative overflow-hidden text-center px-4">
            {/* Background Effect */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-cyan/10 via-navy to-black" />

            <div className="relative z-10">
                <h1 className="text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan to-ai-purple mb-4">
                    404
                </h1>
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                    Page Lost in <span className="text-cyan">Cyberspace</span>
                </h2>
                <p className="text-gray-400 text-lg max-w-lg mx-auto mb-10">
                    The page you are looking for has been moved, deleted, or possibly never existed in this dimension.
                </p>

                <Link href="/">
                    <Button glow size="lg" className="gap-2">
                        <Home size={20} /> Return to Home
                    </Button>
                </Link>
            </div>

            {/* Decorative Elements */}
            <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-cyan rounded-full animate-ping" />
            <div className="absolute bottom-1/3 right-1/4 w-3 h-3 bg-ai-purple rounded-full animate-pulse" />
        </div>
    );
}
