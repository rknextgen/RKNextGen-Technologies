'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Download, FileText, Code, PenTool, ExternalLink } from 'lucide-react';
import { Section } from '@/components/ui/Section';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

interface Resource {
    id: number;
    title: string;
    description: string;
    type: 'Template' | 'Guide' | 'Tool' | 'Snippet';
    icon: React.ReactNode;
    downloadCount: string;
}

const resources: Resource[] = [
    {
        id: 1,
        title: 'Next.js Enterprise Boilerplate',
        description: 'Production-ready starter kit with TypeScript, Tailwind, and ESLint configuration.',
        type: 'Template',
        icon: <Code className="w-8 h-8 text-cyan" />,
        downloadCount: '2.5k+',
    },
    {
        id: 2,
        title: 'AI Integration Guide',
        description: 'Step-by-step guide to integrating OpenAI API into your React applications.',
        type: 'Guide',
        icon: <FileText className="w-8 h-8 text-ai-purple" />,
        downloadCount: '1.8k+',
    },
    {
        id: 3,
        title: 'Cloud Cost Calculator',
        description: 'Interactive tool to estimate AWS and Google Cloud infrastructure costs.',
        type: 'Tool',
        icon: <PenTool className="w-8 h-8 text-tech-blue" />,
        downloadCount: '5k+',
    },
    {
        id: 4,
        title: 'React Hooks Library',
        description: 'Collection of 30+ custom hooks for common web development tasks.',
        type: 'Snippet',
        icon: <Code className="w-8 h-8 text-cyan" />,
        downloadCount: '3.2k+',
    },
    {
        id: 5,
        title: 'DevOps CI/CD Pipeline Config',
        description: 'Standardized GitHub Actions workflow templates for automated deployment.',
        type: 'Template',
        icon: <Code className="w-8 h-8 text-ai-purple" />,
        downloadCount: '1.2k+',
    },
    {
        id: 6,
        title: 'Security Checklist 2024',
        description: 'Comprehensive security audit checklist for modern web applications.',
        type: 'Guide',
        icon: <FileText className="w-8 h-8 text-tech-blue" />,
        downloadCount: '4.1k+',
    },
];

export default function ResourcesPage() {
    return (
        <div className="pt-20">
            <Section className="text-center">
                <motion.h1
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-4xl md:text-6xl font-bold text-white mb-6"
                >
                    Free <span className="text-cyan">Resources</span>
                </motion.h1>
                <p className="text-xl text-gray-400 max-w-3xl mx-auto mb-12">
                    Tools, templates, and guides to help you build better software.
                </p>
            </Section>

            <Section>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {resources.map((resource, index) => (
                        <motion.div
                            key={resource.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <Card className="p-8 h-full group relative" hover3D={true}>
                                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                    {resource.icon}
                                </div>

                                <div className="mb-6">
                                    <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-4 group-hover:border-cyan/50 group-hover:shadow-[0_0_15px_rgba(0,194,217,0.2)] transition-all">
                                        {resource.icon}
                                    </div>
                                    <div className="inline-block px-3 py-1 rounded-full bg-white/5 text-xs text-gray-400 mb-2 border border-white/5">
                                        {resource.type}
                                    </div>
                                    <h3 className="text-xl font-bold text-white mb-3 group-hover:text-cyan transition-colors">
                                        {resource.title}
                                    </h3>
                                    <p className="text-gray-400 text-sm leading-relaxed">
                                        {resource.description}
                                    </p>
                                </div>

                                <div className="flex items-center justify-between mt-auto pt-6 border-t border-white/5">
                                    <span className="text-xs text-gray-500">
                                        {resource.downloadCount} downloads
                                    </span>
                                    <Button size="sm" variant="outline" className="gap-2 group-hover:bg-cyan/10 group-hover:text-cyan group-hover:border-cyan/50">
                                        Download <Download size={14} />
                                    </Button>
                                </div>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </Section>

            <Section className="bg-navy/50">
                <div className="text-center max-w-2xl mx-auto">
                    <h2 className="text-2xl font-bold text-white mb-4">Want to contribute?</h2>
                    <p className="text-gray-400 mb-8">
                        Have a useful tool or resource to share with the community? We'd love to feature it.
                    </p>
                    <Button glow className="gap-2">
                        Submit a Resource <ExternalLink size={16} />
                    </Button>
                </div>
            </Section>
        </div>
    );
}
