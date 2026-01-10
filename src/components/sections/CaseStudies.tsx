'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowRight, ExternalLink, TrendingUp, Users, Clock, Award, Zap, Shield, BarChart } from 'lucide-react';
import { Section } from '@/components/ui/Section';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

// Icon mapping
const iconMap: Record<string, any> = {
    TrendingUp,
    Users,
    Clock,
    Award,
    Zap,
    Shield,
    BarChart,
    // Add more as needed
};

// Define interface matching Prisma model or expected prop
interface CaseStudy {
    id: string;
    title: string;
    clientName: string;
    category: string;
    image: string | null; // Changed to optional string
    problem: string;
    solution: string;
    techStack: string[];
    impactMetrics: any[]; // Json in Prisma, array of objects here
    // featured: boolean; // Removed as not in Prisma schema
}

interface CaseStudiesProps {
    caseStudies?: CaseStudy[];
}

export const CaseStudies = ({ caseStudies = [] }: CaseStudiesProps) => {
    const [selectedStudy, setSelectedStudy] = useState<CaseStudy | null>(null);

    if (!caseStudies || caseStudies.length === 0) {
        return null;
    }

    return (
        <Section className="bg-gradient-to-b from-navy/50 to-transparent">
            <div className="text-center mb-16">
                <motion.h2
                    initial={{ opacity: 0, y: -20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-3xl md:text-5xl font-bold text-white mb-4"
                >
                    Success <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan to-ai-purple">Stories</span>
                </motion.h2>
                <p className="text-gray-400 max-w-2xl mx-auto text-lg">
                    Real results from real projects. See how we've helped businesses transform digitally.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {caseStudies.map((study, index) => (
                    <motion.div
                        key={study.id}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        onClick={() => setSelectedStudy(study)}
                    >
                        <Card className="p-6 h-full group relative overflow-hidden cursor-pointer" hover3D={true}>
                            {/* Category badge */}
                            <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-ai-purple/20 border border-ai-purple/30 text-xs text-ai-purple font-medium backdrop-blur-sm">
                                {study.category}
                            </div>

                            <div className="mb-2 text-cyan text-sm font-semibold tracking-wide uppercase">
                                {study.clientName}
                            </div>

                            <h3 className="text-xl font-bold text-white mb-4 pr-4 group-hover:text-cyan transition-colors">
                                {study.title}
                            </h3>

                            <div className="space-y-4 mb-6">
                                <div>
                                    <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Problem</h4>
                                    <p className="text-sm text-gray-400 line-clamp-2">{study.problem}</p>
                                </div>

                                <div>
                                    <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Solution</h4>
                                    <p className="text-sm text-gray-400 line-clamp-2">{study.solution}</p>
                                </div>
                            </div>

                            {/* Tech Stack Tags (Preview) */}
                            <div className="flex flex-wrap gap-2 mb-6">
                                {study.techStack.slice(0, 3).map((tech) => (
                                    <span key={tech} className="text-[10px] px-2 py-1 rounded bg-white/5 text-gray-400 border border-white/5">
                                        {tech}
                                    </span>
                                ))}
                                {study.techStack.length > 3 && (
                                    <span className="text-[10px] px-2 py-1 rounded bg-white/5 text-gray-400 border border-white/5">
                                        +{study.techStack.length - 3}
                                    </span>
                                )}
                            </div>

                            {/* Results overlay - slides in on hover */}
                            <div className="grid grid-cols-3 gap-2 mt-auto border-t border-white/10 pt-4">
                                {study.impactMetrics.map((result, idx) => (
                                    <div key={idx} className="text-center">
                                        <div className="text-lg font-bold text-white group-hover:text-cyan transition-colors">
                                            {result.value}
                                        </div>
                                        <div className="text-[10px] text-gray-500 uppercase">{result.metric}</div>
                                    </div>
                                ))}
                            </div>

                            <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                <div className="p-2 rounded-full bg-cyan/20 text-cyan">
                                    <ArrowRight size={16} />
                                </div>
                            </div>
                        </Card>
                    </motion.div>
                ))}
            </div>

            {/* Case Study Modal */}
            <AnimatePresence>
                {selectedStudy && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedStudy(null)}
                            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="relative w-full max-w-3xl bg-navy border border-cyan/30 rounded-2xl shadow-[0_0_50px_rgba(0,194,217,0.2)] overflow-hidden max-h-[90vh] overflow-y-auto"
                        >
                            {/* Modal Header */}
                            <div className="relative h-48 bg-gradient-to-r from-navy to-ai-purple/20 p-8 flex flex-col justify-end">
                                <button
                                    onClick={() => setSelectedStudy(null)}
                                    className="absolute top-4 right-4 p-2 rounded-full bg-black/20 hover:bg-white/10 text-white transition-colors"
                                >
                                    <X size={24} />
                                </button>
                                <div className="absolute top-4 left-8 px-3 py-1 rounded-full bg-cyan/20 border border-cyan/30 text-cyan text-sm font-medium">
                                    {selectedStudy.category}
                                </div>
                                <h3 className="text-3xl font-bold text-white mb-2">{selectedStudy.title}</h3>
                                <p className="text-cyan font-medium">{selectedStudy.clientName}</p>
                            </div>

                            {/* Modal Content */}
                            <div className="p-8 space-y-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div>
                                        <h4 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                                            <span className="w-1 h-6 bg-red-500 rounded-full" /> The Challenge
                                        </h4>
                                        <p className="text-gray-300 leading-relaxed">{selectedStudy.problem}</p>
                                    </div>
                                    <div>
                                        <h4 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                                            <span className="w-1 h-6 bg-green-500 rounded-full" /> The Solution
                                        </h4>
                                        <p className="text-gray-300 leading-relaxed">{selectedStudy.solution}</p>
                                    </div>
                                </div>

                                {/* Impact Metrics */}
                                <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                                    <h4 className="text-lg font-bold text-white mb-6 text-center">Key Impact Metrics</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        {selectedStudy.impactMetrics.map((result, idx) => {
                                            const IconComponent = typeof result.icon === 'string'
                                                ? iconMap[result.icon] || TrendingUp
                                                : result.icon || TrendingUp;

                                            return (
                                                <div key={idx} className="flex flex-col items-center text-center p-4 bg-navy/50 rounded-lg border border-white/5">
                                                    <div className="p-3 rounded-full bg-cyan/10 text-cyan mb-3">
                                                        <IconComponent size={24} />
                                                    </div>
                                                    <div className="text-3xl font-bold text-white mb-1">{result.value}</div>
                                                    <div className="text-sm text-gray-400">{result.metric}</div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Tech Stack */}
                                <div>
                                    <h4 className="text-lg font-bold text-white mb-4">Technologies Used</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {selectedStudy.techStack.map((tech) => (
                                            <span key={tech} className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-gray-300 text-sm hover:border-cyan/50 hover:text-cyan transition-colors">
                                                {tech}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex justify-end pt-4 border-t border-white/10">
                                    <Button glow onClick={() => setSelectedStudy(null)}>
                                        Close Details
                                    </Button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </Section>
    );
};

