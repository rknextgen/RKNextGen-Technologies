'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Section } from '@/components/ui/Section';

interface TechBadge {
    name: string;
    icon: string;
    color: string;
}

export const TechBadges = () => {
    const [badges, setBadges] = useState<TechBadge[]>([]);

    useEffect(() => {
        const fetchBadges = async () => {
            try {
                const response = await fetch('/api/tech-badges');
                if (response.ok) {
                    const data = await response.json();
                    setBadges(data);
                }
            } catch (error) {
                console.error('Failed to fetch badges:', error);
            }
        };
        fetchBadges();
    }, []);

    return (
        <Section className="bg-navy/30">
            <div className="text-center mb-16">
                <motion.h2
                    initial={{ opacity: 0, y: -20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-3xl md:text-4xl font-bold text-white mb-4"
                >
                    Our <span className="text-cyan">Tech Stack</span> Authority
                </motion.h2>
                <p className="text-gray-400 max-w-2xl mx-auto">
                    Certified experts in cutting-edge technologies
                </p>
            </div>

            <div className="flex flex-wrap justify-center gap-8 md:gap-12">
                {badges.map((tech, index) => (
                    <motion.div
                        key={tech.name}
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.4, delay: index * 0.05 }}
                        className="relative group flex flex-col items-center"
                    >
                        {/* Hologram badge */}
                        <motion.div
                            whileHover={{ rotate: 360 }}
                            transition={{ duration: 0.6 }}
                            className="relative w-24 h-24 md:w-28 md:h-28"
                        >
                            {/* Outer glow ring */}
                            <div className={`absolute inset-0 rounded-full bg-gradient-to-br ${tech.color} opacity-20 blur-xl group-hover:opacity-40 transition-opacity`} />

                            {/* Badge circle */}
                            <div className={`relative w-full h-full rounded-full bg-gradient-to-br ${tech.color} p-0.5 group-hover:p-1 transition-all`}>
                                <div className="w-full h-full rounded-full bg-navy flex items-center justify-center border-2 border-white/10 group-hover:border-white/30 transition-all">
                                    <span className="text-4xl">{tech.icon}</span>
                                </div>
                            </div>

                            {/* Rotating ring animation */}
                            <motion.div
                                className="absolute inset-0 rounded-full border-2 border-cyan/30 opacity-0 group-hover:opacity-100"
                                animate={{ rotate: 360 }}
                                transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                            />
                        </motion.div>

                        {/* Label - Always visible */}
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 + index * 0.05 }}
                            className="mt-2 z-20"
                        >
                            <div className={`p-[1px] rounded-lg bg-gradient-to-r ${tech.color} shadow-[0_0_15px_rgba(0,0,0,0.5)]`}>
                                <div className="bg-navy/90 backdrop-blur-sm rounded-lg px-4 py-2 relative">
                                    <span className={`bg-gradient-to-r ${tech.color} bg-clip-text text-transparent font-bold whitespace-nowrap`}>
                                        {tech.name}
                                    </span>
                                    {/* Arrow */}
                                    <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2">
                                        <div className={`w-full h-full bg-gradient-to-r ${tech.color} rotate-45`} />
                                        <div className="absolute inset-[1px] bg-navy rotate-45" />
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                ))}
            </div>
        </Section>
    );
};
