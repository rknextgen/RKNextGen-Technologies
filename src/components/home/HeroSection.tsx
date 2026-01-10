'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Scene } from '@/components/3d/Scene';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';

export const HeroSection = () => {
    return (
        <section className="relative h-screen w-full overflow-hidden flex items-center">
            {/* 3D Background */}
            <div className="absolute inset-0 w-full h-full">
                <Scene />
            </div>

            {/* Content Overlay */}
            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                    className="text-left"
                >
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="inline-block px-4 py-1 rounded-full border border-cyan/30 bg-cyan/10 text-cyan text-sm font-medium mb-6 backdrop-blur-sm"
                    >
                        AI • ML • Software • Cloud
                    </motion.div>

                    <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
                        RK <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan to-tech-blue">NextGen</span> <br />
                        Technologies
                    </h1>

                    <p className="text-xl md:text-2xl text-gray-300 mb-8 font-light">
                        Next-Gen Solutions for a <span className="text-cyan font-medium">Digital World</span>.
                    </p>

                    <p className="text-gray-400 mb-10 max-w-lg">
                        We help businesses transform, scale, and innovate with smart, scalable, and future-ready technology.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4">
                        <Link href="/contact">
                            <Button size="lg" glow>Start a Project</Button>
                        </Link>
                        <Link href="/services">
                            <Button variant="outline" size="lg">View Services</Button>
                        </Link>
                    </div>
                </motion.div>

                {/* Right side is handled by the 3D scene */}
                <div className="hidden lg:block h-full" />
            </div>
        </section>
    );
};
