'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import NextImage from 'next/image';
import { motion } from 'framer-motion';
import {
    ArrowLeft,
    ExternalLink,
    Github,
    Calendar,
    Layers,
    CheckCircle2,
    Target,
    TrendingUp
} from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface Project {
    id: string;
    title: string;
    slug: string;
    description: string;
    fullDescription: string;
    category: string;
    techStack: string[];
    coverImageUrl?: string;
    galleryImageUrls?: string[];
    demoUrl?: string;
    githubUrl?: string;
    clientName?: string;
    industry?: string;
    problem?: string;
    solution?: string;
    impact?: string[];
    createdAt: string;
}

export default function ProjectPage() {
    const params = useParams();
    const router = useRouter();
    const [project, setProject] = useState<Project | null>(null);
    const [relatedProjects, setRelatedProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        const fetchProject = async () => {
            try {
                setLoading(true);
                const res = await fetch(`/api/projects/${params.slug}`);
                if (!res.ok) {
                    setError(true);
                    return;
                }
                const data = await res.json();
                setProject(data.project);

                // Fetch related projects
                if (data.project?.category) {
                    const relatedRes = await fetch(`/api/projects?category=${data.project.category}&limit=3`);
                    if (relatedRes.ok) {
                        const relatedData = await relatedRes.json();
                        setRelatedProjects(
                            relatedData.projects.filter((p: Project) => p.slug !== params.slug).slice(0, 3)
                        );
                    }
                }
            } catch (err) {
                console.error('Error fetching project:', err);
                setError(true);
            } finally {
                setLoading(false);
            }
        };

        if (params.slug) {
            fetchProject();
        }
    }, [params.slug]);

    if (loading) {
        return (
            <div className="min-h-screen bg-[#020617] flex items-center justify-center">
                <div className="animate-pulse text-[#00C2D9] text-xl">Loading project...</div>
            </div>
        );
    }

    if (error || !project) {
        return (
            <div className="min-h-screen bg-[#020617] flex items-center justify-center px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-md w-full bg-[rgba(15,23,42,0.95)] border border-[rgba(148,163,184,0.35)] rounded-2xl p-8 text-center backdrop-blur-xl"
                >
                    <h1 className="text-3xl font-bold text-[#E5F0FF] mb-4">Project Not Found</h1>
                    <p className="text-[#9CA3AF] mb-6">The project you're looking for doesn't exist or has been removed.</p>
                    <Link href="/projects">
                        <Button className="w-full bg-[#00C2D9] hover:bg-[#00A8BD] text-white">
                            <ArrowLeft size={18} className="mr-2" />
                            Back to Projects
                        </Button>
                    </Link>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#020617] text-[#E5F0FF]">
            {/* HERO SECTION */}
            <section className="relative min-h-[60vh] flex items-center overflow-hidden">
                {/* Subtle gradient background */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#020617] via-[#0A1628] to-[#020617]">
                    <div className="absolute top-20 right-20 w-96 h-96 bg-[#00C2D9] opacity-5 blur-[120px] rounded-full" />
                    <div className="absolute bottom-20 left-20 w-96 h-96 bg-[#8A2BE2] opacity-5 blur-[120px] rounded-full" />
                </div>

                <div className="container mx-auto px-4 py-20 relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        {/* Left: Content */}
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6 }}
                        >
                            {/* Breadcrumb */}
                            <div className="flex items-center gap-2 text-sm text-[#9CA3AF] mb-6">
                                <Link href="/" className="hover:text-[#00C2D9] transition-colors">Home</Link>
                                <span>/</span>
                                <Link href="/projects" className="hover:text-[#00C2D9] transition-colors">Projects</Link>
                                <span>/</span>
                                <span className="text-[#00C2D9]">{project.category}</span>
                            </div>

                            {/* Category pill */}
                            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#00C2D9]/10 border border-[#00C2D9]/30 text-[#00C2D9] text-sm font-medium mb-6">
                                <Layers size={14} />
                                {project.category}{project.industry && ` · ${project.industry}`}
                            </div>

                            {/* Title */}
                            <motion.h1
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2, duration: 0.6 }}
                                className="text-4xl lg:text-5xl xl:text-6xl font-bold text-[#E5F0FF] mb-4 leading-tight"
                            >
                                {project.title}
                            </motion.h1>

                            {/* Subtitle */}
                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3, duration: 0.6 }}
                                className="text-lg text-[#9CA3AF] mb-6 leading-relaxed"
                            >
                                {project.description}
                            </motion.p>

                            {/* Meta info */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4, duration: 0.6 }}
                                className="flex flex-wrap items-center gap-6 text-sm text-[#9CA3AF] mb-8 pb-8 border-b border-[rgba(148,163,184,0.35)]"
                            >
                                {project.clientName && (
                                    <div className="flex items-center gap-2">
                                        <span className="font-medium text-[#E5F0FF]">Client:</span>
                                        {project.clientName}
                                    </div>
                                )}
                                <div className="flex items-center gap-2">
                                    <Calendar size={16} />
                                    {new Date(project.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                                </div>
                            </motion.div>

                            {/* Action buttons */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5, duration: 0.6 }}
                                className="flex flex-wrap gap-4"
                            >
                                {project.demoUrl && (
                                    <a href={project.demoUrl} target="_blank" rel="noopener noreferrer">
                                        <Button className="bg-[#00C2D9] hover:bg-[#00A8BD] text-white shadow-[0_0_20px_rgba(0,194,217,0.3)] hover:shadow-[0_0_30px_rgba(0,194,217,0.5)] transition-all">
                                            <ExternalLink size={18} className="mr-2" />
                                            View Live Demo
                                        </Button>
                                    </a>
                                )}
                                {project.githubUrl && (
                                    <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                                        <Button className="bg-transparent border border-[rgba(148,163,184,0.35)] hover:border-[#00C2D9] text-[#E5F0FF] hover:text-[#00C2D9] transition-all">
                                            <Github size={18} className="mr-2" />
                                            View Source Code
                                        </Button>
                                    </a>
                                )}
                            </motion.div>
                        </motion.div>

                        {/* Right: Mockup */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.3, duration: 0.8 }}
                            className="relative hidden lg:block"
                        >
                            <div className="relative group">
                                <div className="absolute inset-0 bg-gradient-to-br from-[#00C2D9]/20 to-[#8A2BE2]/20 rounded-2xl blur-2xl group-hover:blur-3xl transition-all" />
                                <div className="relative bg-[rgba(15,23,42,0.95)] border border-[rgba(148,163,184,0.35)] rounded-2xl p-4 backdrop-blur-xl transform group-hover:scale-[1.02] transition-transform duration-500">
                                    <div className="relative h-[400px] rounded-xl overflow-hidden">
                                        <NextImage
                                            src={project.coverImageUrl || '/project-placeholder.png'}
                                            alt={project.title}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* MAIN CONTENT */}
            <section className="container mx-auto px-4 py-16">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* LEFT COLUMN */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Project Overview */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                            className="bg-[rgba(15,23,42,0.95)] border border-[rgba(148,163,184,0.35)] rounded-2xl p-8 backdrop-blur-xl"
                        >
                            <h2 className="text-2xl font-bold text-[#E5F0FF] mb-6 flex items-center gap-3">
                                <span className="w-1 h-8 bg-gradient-to-b from-[#00C2D9] to-[#1E90FF] rounded-full" />
                                Project Overview
                            </h2>
                            <div className="prose prose-invert prose-lg max-w-none">
                                <p className="text-[#9CA3AF] leading-relaxed whitespace-pre-wrap">
                                    {project.fullDescription}
                                </p>
                            </div>
                        </motion.div>

                        {/* Problem → Solution → Impact */}
                        {(project.problem || project.solution || (project.impact && project.impact.length > 0)) && (
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: 0.1 }}
                                className="space-y-6"
                            >
                                {/* Problem */}
                                {project.problem && (
                                    <div className="bg-[rgba(15,23,42,0.95)] border border-[rgba(148,163,184,0.35)] rounded-2xl p-8 backdrop-blur-xl">
                                        <div className="flex items-start gap-4">
                                            <div className="w-12 h-12 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center justify-center flex-shrink-0">
                                                <Target size={24} className="text-red-400" />
                                            </div>
                                            <div>
                                                <h3 className="text-xl font-bold text-[#E5F0FF] mb-3">The Challenge</h3>
                                                <p className="text-[#9CA3AF] leading-relaxed">{project.problem}</p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Solution */}
                                {project.solution && (
                                    <div className="bg-[rgba(15,23,42,0.95)] border border-[rgba(148,163,184,0.35)] rounded-2xl p-8 backdrop-blur-xl">
                                        <div className="flex items-start gap-4">
                                            <div className="w-12 h-12 rounded-xl bg-[#00C2D9]/10 border border-[#00C2D9]/30 flex items-center justify-center flex-shrink-0">
                                                <CheckCircle2 size={24} className="text-[#00C2D9]" />
                                            </div>
                                            <div>
                                                <h3 className="text-xl font-bold text-[#E5F0FF] mb-3">Our Solution</h3>
                                                <p className="text-[#9CA3AF] leading-relaxed">{project.solution}</p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Impact */}
                                {project.impact && project.impact.length > 0 && (
                                    <div className="bg-[rgba(15,23,42,0.95)] border border-[rgba(148,163,184,0.35)] rounded-2xl p-8 backdrop-blur-xl">
                                        <div className="flex items-start gap-4">
                                            <div className="w-12 h-12 rounded-xl bg-green-500/10 border border-green-500/30 flex items-center justify-center flex-shrink-0">
                                                <TrendingUp size={24} className="text-green-400" />
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="text-xl font-bold text-[#E5F0FF] mb-4">Results & Impact</h3>
                                                <ul className="space-y-2">
                                                    {project.impact.map((item, idx) => (
                                                        <li key={idx} className="flex items-start gap-3 text-[#9CA3AF]">
                                                            <span className="text-green-400 mt-1">→</span>
                                                            <span>{item}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        )}

                        {/* Gallery */}
                        {project.galleryImageUrls && project.galleryImageUrls.length > 0 && (
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: 0.2 }}
                            >
                                <h2 className="text-2xl font-bold text-[#E5F0FF] mb-6">Project Gallery</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {project.galleryImageUrls.map((img, idx) => (
                                        <motion.div
                                            key={idx}
                                            whileHover={{ scale: 1.02 }}
                                            className="group relative h-64 rounded-xl overflow-hidden border border-[rgba(148,163,184,0.35)] hover:border-[#00C2D9]/50 transition-all cursor-pointer bg-[rgba(15,23,42,0.95)] backdrop-blur-xl"
                                        >
                                            <NextImage
                                                src={img}
                                                alt={`${project.title} screenshot ${idx + 1}`}
                                                fill
                                                className="object-cover group-hover:scale-110 transition-transform duration-700"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                                                <span className="text-white text-sm">Click to view fullscreen</span>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </motion.div>
                        )}
                    </div>

                    {/* RIGHT COLUMN - Sticky Details Card */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="lg:sticky lg:top-24 h-fit"
                    >
                        <div className="bg-[rgba(15,23,42,0.95)] border border-[rgba(148,163,184,0.35)] rounded-2xl p-6 backdrop-blur-xl hover:border-[#00C2D9]/30 transition-colors">
                            <h3 className="text-xl font-bold text-[#E5F0FF] mb-6 pb-4 border-b border-[rgba(148,163,184,0.35)]">
                                Project Details
                            </h3>

                            <div className="space-y-6">
                                {/* Category */}
                                <div>
                                    <span className="text-sm text-[#9CA3AF] block mb-2">Category</span>
                                    <span className="text-[#E5F0FF] font-medium">{project.category}</span>
                                </div>

                                {/* Industry */}
                                {project.industry && (
                                    <div>
                                        <span className="text-sm text-[#9CA3AF] block mb-2">Industry</span>
                                        <span className="text-[#E5F0FF] font-medium">{project.industry}</span>
                                    </div>
                                )}

                                {/* Client */}
                                {project.clientName && (
                                    <div>
                                        <span className="text-sm text-[#9CA3AF] block mb-2">Client</span>
                                        <span className="text-[#E5F0FF] font-medium">{project.clientName}</span>
                                    </div>
                                )}

                                {/* Date */}
                                <div>
                                    <span className="text-sm text-[#9CA3AF] block mb-2">Delivered</span>
                                    <span className="text-[#E5F0FF] font-medium flex items-center gap-2">
                                        <Calendar size={16} className="text-[#00C2D9]" />
                                        {new Date(project.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                                    </span>
                                </div>

                                <div className="border-t border-[rgba(148,163,184,0.35)] pt-6">
                                    <span className="text-sm text-[#9CA3AF] block mb-3">Tech Stack</span>
                                    <div className="flex flex-wrap gap-2">
                                        {project.techStack.map((tech) => (
                                            <span
                                                key={tech}
                                                className="px-3 py-1.5 rounded-full bg-[#00C2D9]/10 border border-[#00C2D9]/30 text-sm text-[#00C2D9] hover:bg-[#00C2D9]/20 transition-colors cursor-default shadow-[0_0_10px_rgba(0,194,217,0.1)]"
                                            >
                                                {tech}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="border-t border-[rgba(148,163,184,0.35)] pt-6 space-y-3">
                                    {project.demoUrl && (
                                        <a href={project.demoUrl} target="_blank" rel="noopener noreferrer" className="block">
                                            <Button className="w-full justify-center bg-[#00C2D9] hover:bg-[#00A8BD] text-white shadow-[0_0_20px_rgba(0,194,217,0.2)] hover:shadow-[0_0_30px_rgba(0,194,217,0.4)] transition-all">
                                                <ExternalLink size={18} className="mr-2" />
                                                Live Demo
                                            </Button>
                                        </a>
                                    )}
                                    {project.githubUrl && (
                                        <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="block">
                                            <Button className="w-full justify-center bg-transparent border border-[rgba(148,163,184,0.35)] hover:border-[#00C2D9] text-[#E5F0FF] hover:text-[#00C2D9] transition-all">
                                                <Github size={18} className="mr-2" />
                                                View Source
                                            </Button>
                                        </a>
                                    )}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* RELATED PROJECTS */}
            {relatedProjects.length > 0 && (
                <section className="container mx-auto px-4 py-16 border-t border-[rgba(148,163,184,0.35)]">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <div className="flex items-center justify-between mb-12">
                            <h2 className="text-3xl font-bold text-[#E5F0FF]">
                                Similar <span className="text-[#00C2D9]">Projects</span>
                            </h2>
                            <Link href="/projects">
                                <Button className="bg-transparent border border-[rgba(148,163,184,0.35)] hover:border-[#00C2D9] text-[#E5F0FF] hover:text-[#00C2D9]">
                                    View All Projects
                                </Button>
                            </Link>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {relatedProjects.map((related, idx) => (
                                <motion.div
                                    key={related.id}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.6, delay: idx * 0.1 }}
                                    whileHover={{ y: -8 }}
                                >
                                    <Link href={`/projects/${related.slug}`}>
                                        <div className="group bg-[rgba(15,23,42,0.95)] border border-[rgba(148,163,184,0.35)] rounded-xl overflow-hidden hover:border-[#00C2D9]/50 transition-all cursor-pointer h-full flex flex-col backdrop-blur-xl">
                                            <div className="relative h-48 overflow-hidden">
                                                <NextImage
                                                    src={related.coverImageUrl || '/project-placeholder.png'}
                                                    alt={related.title}
                                                    fill
                                                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                                                />
                                                <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-black/50 backdrop-blur-md text-xs text-white border border-white/20">
                                                    {related.category}
                                                </div>
                                            </div>
                                            <div className="p-6 flex-1 flex flex-col">
                                                <h3 className="text-xl font-bold text-[#E5F0FF] mb-2 group-hover:text-[#00C2D9] transition-colors">
                                                    {related.title}
                                                </h3>
                                                <p className="text-[#9CA3AF] text-sm line-clamp-2 mb-4 flex-1">
                                                    {related.description}
                                                </p>
                                                <div className="text-[#00C2D9] text-sm font-medium flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                                                    View Project <ArrowLeft size={16} className="rotate-180" />
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                </section>
            )}
        </div>
    );
}
