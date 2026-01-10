'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/Card';
import NextImage from 'next/image';
import Link from 'next/link';

interface Project {
    id: string;
    title: string;
    slug: string;
    description: string;
    coverImageUrl?: string | null;
    category: string;
    techStack: string[];
}

interface ProjectGridProps {
    projects: Project[];
}

export const ProjectGrid = ({ projects }: ProjectGridProps) => {
    if (projects.length === 0) {
        return (
            <div className="text-center py-16">
                <p className="text-gray-400 text-lg mb-4">
                    No projects found in this category yet.
                </p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project, index) => (
                <motion.div
                    key={project.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                >
                    <Link href={`/projects/${project.slug}`}>
                        <Card
                            className="group cursor-pointer overflow-hidden border border-white/5 hover:border-cyan/50 transition-all duration-300 h-full"
                            hover3D={true}
                        >
                            <div className="h-48 w-full relative overflow-hidden">
                                <NextImage
                                    src={project.coverImageUrl || '/project-placeholder.png'}
                                    alt={project.title}
                                    fill
                                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-navy to-transparent opacity-60" />

                                {/* Category badge */}
                                <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-cyan/20 backdrop-blur-md border border-cyan/30 text-xs text-cyan font-medium">
                                    {project.category}
                                </div>
                            </div>
                            <div className="p-6">
                                <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-cyan transition-colors">
                                    {project.title}
                                </h3>
                                <p className="text-gray-400 mb-4 line-clamp-2">{project.description}</p>
                                <div className="flex flex-wrap gap-2">
                                    {project.techStack.slice(0, 3).map((tech) => (
                                        <span key={tech} className="px-3 py-1 rounded-full bg-white/5 text-xs text-cyan border border-cyan/20">
                                            {tech}
                                        </span>
                                    ))}
                                    {project.techStack.length > 3 && (
                                        <span className="px-3 py-1 rounded-full bg-white/5 text-xs text-gray-400 border border-white/10">
                                            +{project.techStack.length - 3}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </Card>
                    </Link>
                </motion.div>
            ))}
        </div>
    );
};
