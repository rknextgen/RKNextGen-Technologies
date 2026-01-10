'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Section } from '@/components/ui/Section';

interface TechBadge {
    name: string;
    icon: string;
    color: string;
}

const techStack: TechBadge[] = [
    { name: 'AWS Certified', icon: '☁️', color: 'from-orange-500 to-yellow-500' },
    { name: 'Google Cloud', icon: '🌐', color: 'from-blue-500 to-green-500' },
    { name: 'Python Expert', icon: '🐍', color: 'from-blue-400 to-yellow-400' },
    { name: 'React Master', icon: '⚛️', color: 'from-cyan-400 to-blue-500' },
    { name: 'Node.js Pro', icon: '🟢', color: 'from-green-500 to-green-700' },
    { name: 'AI/ML Specialist', icon: '🤖', color: 'from-purple-500 to-pink-500' },
    { name: 'Docker Expert', icon: '🐳', color: 'from-blue-600 to-cyan-500' },
    { name: 'Kubernetes', icon: '☸️', color: 'from-blue-500 to-indigo-600' },
];

export const TechBadges = () => {
    const [hoveredBadge, setHoveredBadge] = useState<string | null>(null);

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
                {techStack.map((tech, index) => (
                    <motion.div
                        key={tech.name}
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.4, delay: index * 0.05 }}
                        className="relative group"
                        onMouseEnter={() => setHoveredBadge(tech.name)}
                        onMouseLeave={() => setHoveredBadge(null)}
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

                        {/* Tooltip */}
                        {hoveredBadge === tech.name && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="absolute -bottom-10 left-1/2 -translate-x-1/2 px-4 py-2 rounded-lg bg-navy border border-cyan/30 text-cyan text-sm font-medium whitespace-nowrap shadow-[0_0_20px_rgba(0,194,217,0.3)] z-10"
                            >
                                {tech.name}
                                <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-navy border-l border-t border-cyan/30 rotate-45" />
                            </motion.div>
                        )}
                    </motion.div>
                ))}
            </div>
        </Section>
    );
};
