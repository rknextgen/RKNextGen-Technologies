'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Plus,
    Search,
    Edit,
    Trash2,
    Star,
    X,
    Save,
    Briefcase,
    Eye,
    EyeOff,
    StarOff,
    Image as ImageIcon,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import MediaSelectorModal from '@/components/admin/MediaSelectorModal';

interface Project {
    id: string;
    title: string;
    slug: string;
    description: string;
    fullDescription?: string;
    category: string;
    techStack: string[];
    coverImageId?: string;
    coverImageUrl?: string;
    galleryImageIds?: string[];
    galleryImageUrls?: string[];
    demoUrl?: string;
    githubUrl?: string;
    featured: boolean;
    clientName?: string;
    industry?: string;
    problem?: string;
    solution?: string;
    impact?: string[];
    createdAt: string;
}

export default function ProjectsPage() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('');
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [editingProject, setEditingProject] = useState<Project | null>(null);

    useEffect(() => {
        fetchProjects();
    }, [categoryFilter]);

    const fetchProjects = async () => {
        try {
            setLoading(true);
            const params = new URLSearchParams();
            if (categoryFilter) params.append('category', categoryFilter);

            const response = await fetch(`/api/projects?${params}`);
            const data = await response.json();
            setProjects(data.projects || []);
        } catch (error) {
            console.error('Error fetching projects:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this project?')) return;

        try {
            const response = await fetch(`/api/projects/${id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                setProjects(projects.filter((p) => p.id !== id));
            }
        } catch (error) {
            console.error('Error deleting project:', error);
        }
    };

    const toggleFeatured = async (project: Project) => {
        try {
            const response = await fetch(`/api/projects/${project.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ featured: !project.featured }),
            });

            if (response.ok) {
                fetchProjects();
            }
        } catch (error) {
            console.error('Error toggling featured:', error);
        }
    };

    const filteredProjects = projects.filter((project) =>
        project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">
                        Projects <span className="text-cyan">Management</span>
                    </h1>
                    <p className="text-gray-400">Manage your portfolio projects</p>
                </div>
                <Button glow onClick={() => setShowCreateModal(true)}>
                    <Plus size={20} className="mr-2" />
                    New Project
                </Button>
            </div>

            {/* Filters */}
            <Card className="p-4">
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search projects..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-500 focus:border-cyan focus:outline-none focus:ring-1 focus:ring-cyan"
                        />
                    </div>
                    <select
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                        className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-cyan focus:outline-none focus:ring-1 focus:ring-cyan"
                    >
                        <option value="" className="bg-navy text-white">All Categories</option>
                        <option value="AI" className="bg-navy text-white">AI</option>
                        <option value="Web" className="bg-navy text-white">Web</option>
                        <option value="Cloud" className="bg-navy text-white">Cloud</option>
                        <option value="Automation" className="bg-navy text-white">Automation</option>
                    </select>
                </div>
            </Card>

            {/* Projects Grid */}
            {loading ? (
                <div className="text-center text-gray-400 py-12">Loading...</div>
            ) : filteredProjects.length === 0 ? (
                <Card className="p-12 text-center">
                    <Briefcase size={48} className="mx-auto mb-4 text-gray-400 opacity-50" />
                    <p className="text-gray-400">No projects found</p>
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredProjects.map((project) => (
                        <motion.div
                            key={project.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            <Card className="p-6 h-full relative group hover:border-cyan/50 transition-all">
                                {project.featured && (
                                    <div className="absolute top-4 right-4">
                                        <Star size={20} className="text-yellow-400 fill-yellow-400" />
                                    </div>
                                )}

                                <h3 className="text-xl font-bold text-white mb-2 pr-8">
                                    {project.title}
                                </h3>
                                <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                                    {project.description}
                                </p>

                                <div className="mb-4">
                                    <span className="px-2 py-1 text-xs rounded-full bg-cyan/10 text-cyan border border-cyan/30">
                                        {project.category}
                                    </span>
                                </div>

                                <div className="flex flex-wrap gap-2 mb-4">
                                    {project.techStack.slice(0, 3).map((tech) => (
                                        <span key={tech} className="text-xs px-2 py-1 rounded bg-white/5 text-gray-400">
                                            {tech}
                                        </span>
                                    ))}
                                    {project.techStack.length > 3 && (
                                        <span className="text-xs px-2 py-1 rounded bg-white/5 text-gray-400">
                                            +{project.techStack.length - 3}
                                        </span>
                                    )}
                                </div>

                                <div className="flex gap-2 mt-auto pt-4 border-t border-white/10">
                                    <button
                                        onClick={() => toggleFeatured(project)}
                                        className={`p-2 rounded-lg transition-colors ${project.featured
                                            ? 'bg-yellow-500/10 text-yellow-400'
                                            : 'bg-white/5 text-gray-400 hover:bg-white/10'
                                            }`}
                                        title="Toggle Featured"
                                    >
                                        <Star size={16} />
                                    </button>
                                    <button
                                        onClick={() => setEditingProject(project)}
                                        className="p-2 rounded-lg bg-white/5 text-cyan hover:bg-cyan/10 transition-colors"
                                    >
                                        <Edit size={16} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(project.id)}
                                        className="p-2 rounded-lg bg-white/5 text-red-400 hover:bg-red-500/10 transition-colors"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            )}

            {/* Create/Edit Modal */}
            <AnimatePresence>
                {(showCreateModal || editingProject) && (
                    <ProjectFormModal
                        project={editingProject}
                        onClose={() => {
                            setShowCreateModal(false);
                            setEditingProject(null);
                        }}
                        onSuccess={() => {
                            fetchProjects();
                            setShowCreateModal(false);
                            setEditingProject(null);
                        }}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}

// Project Form Modal
function ProjectFormModal({
    project,
    onClose,
    onSuccess,
}: {
    project: Project | null;
    onClose: () => void;
    onSuccess: () => void;
}) {
    const [formData, setFormData] = useState({
        title: project?.title || '',
        slug: project?.slug || '',
        description: project?.description || '',
        fullDescription: project?.fullDescription || '',
        category: project?.category || '',
        techStack: project?.techStack || [],
        demoUrl: project?.demoUrl || '',
        githubUrl: project?.githubUrl || '',
        featured: project?.featured || false,
        clientName: project?.clientName || '',
        industry: project?.industry || '',
        problem: project?.problem || '',
        solution: project?.solution || '',
        impact: project?.impact || [],
    });
    const [techInput, setTechInput] = useState('');
    const [impactInput, setImpactInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [showCoverModal, setShowCoverModal] = useState(false);
    const [showGalleryModal, setShowGalleryModal] = useState(false);
    const [coverImage, setCoverImage] = useState<{ id: string, url: string } | null>(
        project?.coverImageId && project?.coverImageUrl
            ? { id: project.coverImageId, url: project.coverImageUrl }
            : null
    );
    const [galleryImages, setGalleryImages] = useState<{ id: string, url: string }[]>(() => {
        if (project?.galleryImageIds && project?.galleryImageUrls && project.galleryImageIds.length > 0) {
            return project.galleryImageIds
                .map((id: string, idx: number) => ({
                    id,
                    url: project.galleryImageUrls?.[idx] || ''
                }))
                .filter(img => img.url && img.url.trim() !== ''); // Filter out empty URLs
        }
        return [];
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const url = project ? `/api/projects/${project.id}` : '/api/projects';
            const method = project ? 'PUT' : 'POST';

            // Handle optional URL fields - send undefined if empty string
            const validGalleryImages = galleryImages.filter(img => img.url && img.url.trim() !== '');
            console.log('Valid gallery images:', validGalleryImages);

            const payload = {
                ...formData,
                coverImageId: coverImage?.id || undefined,
                coverImageUrl: coverImage?.url || undefined,
                galleryImageIds: validGalleryImages.length > 0 ? validGalleryImages.map(img => img.id) : undefined,
                galleryImageUrls: validGalleryImages.length > 0 ? validGalleryImages.map(img => img.url) : undefined,
                demoUrl: formData.demoUrl?.trim() || undefined,
                githubUrl: formData.githubUrl?.trim() || undefined,
            };

            console.log('Payload being sent:', payload);

            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (response.ok) {
                onSuccess();
            }
        } catch (error) {
            console.error('Error saving project:', error);
        } finally {
            setLoading(false);
        }
    };

    const addTech = () => {
        if (techInput.trim() && !formData.techStack.includes(techInput.trim())) {
            setFormData({
                ...formData,
                techStack: [...formData.techStack, techInput.trim()],
            });
            setTechInput('');
        }
    };

    const removeTech = (tech: string) => {
        setFormData({
            ...formData,
            techStack: formData.techStack.filter((t) => t !== tech),
        });
    };

    const addImpact = () => {
        if (impactInput.trim() && !formData.impact.includes(impactInput.trim())) {
            setFormData({
                ...formData,
                impact: [...formData.impact, impactInput.trim()],
            });
            setImpactInput('');
        }
    };

    const removeImpact = (item: string) => {
        setFormData({
            ...formData,
            impact: formData.impact.filter((i) => i !== item),
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="relative w-full max-w-2xl bg-navy border border-cyan/30 rounded-2xl shadow-[0_0_50px_rgba(0,194,217,0.2)] max-h-[90vh] overflow-y-auto"
            >
                <div className="p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-white">
                            {project ? 'Edit Project' : 'Create New Project'}
                        </h2>
                        <button
                            onClick={onClose}
                            className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-white transition-colors"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Title *</label>
                            <input
                                type="text"
                                required
                                value={formData.title}
                                onChange={(e) => {
                                    const title = e.target.value;
                                    setFormData({
                                        ...formData,
                                        title,
                                        slug: !project ? title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') : formData.slug,
                                    });
                                }}
                                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-cyan focus:outline-none focus:ring-1 focus:ring-cyan"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Slug *</label>
                            <input
                                type="text"
                                required
                                value={formData.slug}
                                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-cyan focus:outline-none focus:ring-1 focus:ring-cyan"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Description *</label>
                            <textarea
                                required
                                rows={2}
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-cyan focus:outline-none focus:ring-1 focus:ring-cyan"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Full Description *</label>
                            <textarea
                                required
                                rows={5}
                                value={formData.fullDescription}
                                onChange={(e) => setFormData({ ...formData, fullDescription: e.target.value })}
                                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-cyan focus:outline-none focus:ring-1 focus:ring-cyan"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Category *</label>
                            <select
                                required
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-cyan focus:outline-none focus:ring-1 focus:ring-cyan"
                            >
                                <option value="" className="bg-navy text-white">Select category</option>
                                <option value="AI" className="bg-navy text-white">AI</option>
                                <option value="Web" className="bg-navy text-white">Web</option>
                                <option value="Cloud" className="bg-navy text-white">Cloud</option>
                                <option value="Automation" className="bg-navy text-white">Automation</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Tech Stack</label>
                            <div className="flex gap-2 mb-2">
                                <input
                                    type="text"
                                    value={techInput}
                                    onChange={(e) => setTechInput(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTech())}
                                    placeholder="Add technology..."
                                    className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-cyan focus:outline-none focus:ring-1 focus:ring-cyan"
                                />
                                <Button type="button" onClick={addTech} variant="outline">
                                    Add
                                </Button>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {formData.techStack.map((tech) => (
                                    <span
                                        key={tech}
                                        className="px-3 py-1 rounded-full bg-cyan/10 text-cyan border border-cyan/30 text-sm flex items-center gap-2"
                                    >
                                        {tech}
                                        <button
                                            type="button"
                                            onClick={() => removeTech(tech)}
                                            className="hover:text-red-400"
                                        >
                                            <X size={14} />
                                        </button>
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Demo URL</label>
                                <input
                                    type="url"
                                    value={formData.demoUrl}
                                    onChange={(e) => setFormData({ ...formData, demoUrl: e.target.value })}
                                    placeholder="https://..."
                                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-cyan focus:outline-none focus:ring-1 focus:ring-cyan"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">GitHub URL</label>
                                <input
                                    type="url"
                                    value={formData.githubUrl}
                                    onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                                    placeholder="https://..."
                                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-cyan focus:outline-none focus:ring-1 focus:ring-cyan"
                                />
                            </div>
                        </div>

                        {/* Image Selection */}
                        <div className="border-t border-white/10 pt-6 mt-6">
                            <h3 className="text-lg font-semibold text-white mb-4">Project Images</h3>

                            {/* Cover Image */}
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-400 mb-2">Cover Image</label>
                                <Button
                                    type="button"
                                    onClick={() => setShowCoverModal(true)}
                                    variant="outline"
                                    className="mb-2"
                                >
                                    <ImageIcon size={18} className="mr-2" />
                                    {coverImage ? 'Change Cover Image' : 'Select Cover Image'}
                                </Button>
                                {coverImage && (
                                    <div className="mt-2 relative w-48 h-32 rounded-lg overflow-hidden border border-white/10">
                                        <img src={coverImage.url} alt="Cover" className="w-full h-full object-cover" />
                                        <button
                                            type="button"
                                            onClick={() => setCoverImage(null)}
                                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                                        >
                                            <X size={14} />
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* Gallery Images */}
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">Gallery Images</label>
                                <Button
                                    type="button"
                                    onClick={() => setShowGalleryModal(true)}
                                    variant="outline"
                                >
                                    <ImageIcon size={18} className="mr-2" />
                                    Add Gallery Images
                                </Button>
                                {galleryImages.length > 0 && (
                                    <div className="grid grid-cols-4 gap-2 mt-3">
                                        {galleryImages.map((img, idx) => (
                                            <div key={img.id} className="relative aspect-square rounded-lg overflow-hidden border border-white/10">
                                                <img src={img.url} className="w-full h-full object-cover" alt={`Gallery ${idx + 1}`} />
                                                <button
                                                    type="button"
                                                    onClick={() => setGalleryImages(prev => prev.filter((_, i) => i !== idx))}
                                                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                                                >
                                                    <X size={12} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Optional Enhanced Fields */}
                        <div className="border-t border-white/10 pt-6 mt-6">
                            <h3 className="text-lg font-semibold text-white mb-4">Optional Details (Case Study)</h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-1">Client Name</label>
                                    <input
                                        type="text"
                                        value={formData.clientName}
                                        onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                                        placeholder="e.g., Godfrey Phillips India"
                                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-cyan focus:outline-none focus:ring-1 focus:ring-cyan"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-1">Industry</label>
                                    <input
                                        type="text"
                                        value={formData.industry}
                                        onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                                        placeholder="e.g., Enterprise, Healthcare"
                                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-cyan focus:outline-none focus:ring-1 focus:ring-cyan"
                                    />
                                </div>
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-400 mb-1">Problem / Challenge</label>
                                <textarea
                                    rows={3}
                                    value={formData.problem}
                                    onChange={(e) => setFormData({ ...formData, problem: e.target.value })}
                                    placeholder="Describe the problem or challenge the client faced..."
                                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-cyan focus:outline-none focus:ring-1 focus:ring-cyan"
                                />
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-400 mb-1">Solution</label>
                                <textarea
                                    rows={3}
                                    value={formData.solution}
                                    onChange={(e) => setFormData({ ...formData, solution: e.target.value })}
                                    placeholder="Describe how you solved the problem..."
                                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-cyan focus:outline-none focus:ring-1 focus:ring-cyan"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Impact / Results</label>
                                <div className="flex gap-2 mb-2">
                                    <input
                                        type="text"
                                        value={impactInput}
                                        onChange={(e) => setImpactInput(e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addImpact())}
                                        placeholder="Add impact point (e.g., 40% faster reporting)..."
                                        className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-cyan focus:outline-none focus:ring-1 focus:ring-cyan"
                                    />
                                    <Button type="button" onClick={addImpact} variant="outline">
                                        Add
                                    </Button>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {formData.impact.map((item) => (
                                        <span
                                            key={item}
                                            className="px-3 py-1 rounded-full bg-green-500/10 text-green-400 border border-green-500/30 text-sm flex items-center gap-2"
                                        >
                                            {item}
                                            <button
                                                type="button"
                                                onClick={() => removeImpact(item)}
                                                className="hover:text-red-400"
                                            >
                                                <X size={14} />
                                            </button>
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                id="featured"
                                checked={formData.featured}
                                onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                                className="w-4 h-4 rounded border-white/10 bg-white/5 text-cyan focus:ring-cyan"
                            />
                            <label htmlFor="featured" className="text-sm text-gray-400">
                                Mark as featured project
                            </label>
                        </div>

                        <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
                            <Button variant="outline" onClick={onClose} type="button">
                                Cancel
                            </Button>
                            <Button glow type="submit" disabled={loading}>
                                <Save size={16} className="mr-2" />
                                {loading ? 'Saving...' : project ? 'Update Project' : 'Create Project'}
                            </Button>
                        </div>
                    </form>

                    {/* Media Selector Modals */}
                    <MediaSelectorModal
                        isOpen={showCoverModal}
                        onClose={() => setShowCoverModal(false)}
                        onSelect={(media) => setCoverImage(media as { id: string, url: string })}
                        mode="single"
                    />

                    <MediaSelectorModal
                        isOpen={showGalleryModal}
                        onClose={() => setShowGalleryModal(false)}
                        onSelect={(media) => setGalleryImages(media as { id: string, url: string }[])}
                        mode="multiple"
                        selectedIds={galleryImages.map(img => img.id)}
                    />
                </div>
            </motion.div >
        </div >
    );
}
