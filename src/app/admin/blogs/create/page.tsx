'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    Save,
    Eye,
    Upload,
    Image as ImageIcon,
    Link as LinkIcon,
    Code,
    Quote,
    List,
    ListOrdered,
    Bold,
    Italic,
    Underline,
    Heading1,
    Heading2,
    Heading3,
    ArrowLeft,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { useRouter } from 'next/navigation';

export default function CreateBlogPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        title: '',
        slug: '',
        excerpt: '',
        content: '',
        category: '',
        author: '',
        status: 'DRAFT' as 'DRAFT' | 'PUBLISHED',
        image: '',
        metaTitle: '',
        metaDescription: '',
        keywords: '',
        tags: [] as string[],
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleTitleChange = (title: string) => {
        const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        setFormData({ ...formData, title, slug, metaTitle: title });
    };

    const handleSubmit = async (status: 'DRAFT' | 'PUBLISHED') => {
        // Client-side validation
        if (!formData.title) {
            setError('Title is required');
            return;
        }
        if (!formData.excerpt) {
            setError('Excerpt is required');
            return;
        }
        if (!formData.content) {
            setError('Blog Content is required - please write your blog content in the editor below');
            return;
        }
        if (!formData.category) {
            setError('Category is required');
            return;
        }
        if (!formData.author) {
            setError('Author is required');
            return;
        }

        setError('');
        setLoading(true);
        try {
            const response = await fetch('/api/blogs', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...formData, status }),
            });

            if (response.ok) {
                router.push('/admin/blogs');
            } else {
                const data = await response.json();
                setError(data.error || 'Failed to create blog');
            }
        } catch (error) {
            console.error('Error creating blog:', error);
            setError('Network error - please try again');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => router.push('/admin/blogs')}
                        className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <div>
                        <h1 className="text-3xl font-bold text-white">
                            Create New <span className="text-cyan">Blog Post</span>
                        </h1>
                        <p className="text-gray-400 mt-1">Write and publish your blog content</p>
                    </div>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" onClick={() => handleSubmit('DRAFT')} disabled={loading}>
                        <Save size={16} className="mr-2" />
                        Save as Draft
                    </Button>
                    <Button glow onClick={() => handleSubmit('PUBLISHED')} disabled={loading}>
                        <Eye size={16} className="mr-2" />
                        {loading ? 'Publishing...' : 'Publish Blog'}
                    </Button>
                </div>
            </div>

            {/* Error Message */}
            {error && (
                <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 flex items-start gap-3">
                    <div className="text-red-400 mt-0.5">⚠️</div>
                    <div>
                        <p className="text-red-400 font-medium">Error</p>
                        <p className="text-red-300 text-sm mt-1">{error}</p>
                    </div>
                </div>
            )}

            {/* Two Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content - Left Column (2/3) */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Basic Info Card */}
                    <Card className="p-6">
                        <h2 className="text-xl font-bold text-white mb-4">Basic Information</h2>
                        <div className="space-y-4">
                            {/* Title */}
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">
                                    Blog Title *
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={formData.title}
                                    onChange={(e) => handleTitleChange(e.target.value)}
                                    placeholder="Enter your blog title..."
                                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white text-lg placeholder-gray-500 focus:border-cyan focus:outline-none focus:ring-2 focus:ring-cyan/20 transition-all"
                                />
                            </div>

                            {/* Slug */}
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">
                                    URL Slug
                                </label>
                                <div className="flex items-center gap-2">
                                    <span className="text-gray-500 text-sm">/blog/</span>
                                    <input
                                        type="text"
                                        value={formData.slug}
                                        onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                                        placeholder="auto-generated-slug"
                                        className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:border-cyan focus:outline-none focus:ring-2 focus:ring-cyan/20 transition-all"
                                    />
                                </div>
                            </div>

                            {/* Excerpt */}
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">
                                    Excerpt *
                                </label>
                                <textarea
                                    required
                                    rows={3}
                                    value={formData.excerpt}
                                    onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                                    placeholder="Brief summary of your blog post..."
                                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:border-cyan focus:outline-none focus:ring-2 focus:ring-cyan/20 transition-all resize-none"
                                />
                                <p className="text-xs text-gray-500 mt-1">{formData.excerpt.length}/160 characters</p>
                            </div>

                            {/* Category & Author */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-2">
                                        Category *
                                    </label>
                                    <select
                                        required
                                        value={formData.category}
                                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:border-cyan focus:outline-none focus:ring-2 focus:ring-cyan/20 transition-all"
                                    >
                                        <option value="" className="bg-navy">Select category</option>
                                        <option value="Technology" className="bg-navy">Technology</option>
                                        <option value="AI & ML" className="bg-navy">AI & ML</option>
                                        <option value="Cloud Computing" className="bg-navy">Cloud Computing</option>
                                        <option value="Web Development" className="bg-navy">Web Development</option>
                                        <option value="Mobile Apps" className="bg-navy">Mobile Apps</option>
                                        <option value="DevOps" className="bg-navy">DevOps</option>
                                        <option value="Cybersecurity" className="bg-navy">Cybersecurity</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-2">
                                        Author *
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.author}
                                        onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                                        placeholder="Author name"
                                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:border-cyan focus:outline-none focus:ring-2 focus:ring-cyan/20 transition-all"
                                    />
                                </div>
                            </div>
                        </div>
                    </Card>

                    {/* Featured Image Card */}
                    <Card className="p-6">
                        <h2 className="text-xl font-bold text-white mb-4">Featured Image</h2>
                        <div className="space-y-4">
                            {formData.image ? (
                                <div className="relative aspect-video rounded-lg overflow-hidden border border-white/10">
                                    <img
                                        src={formData.image}
                                        alt="Featured"
                                        className="w-full h-full object-cover"
                                    />
                                    <button
                                        onClick={() => setFormData({ ...formData, image: '' })}
                                        className="absolute top-2 right-2 p-2 bg-red-500/80 rounded-lg hover:bg-red-500 transition-colors"
                                    >
                                        <Upload size={16} className="text-white" />
                                    </button>
                                </div>
                            ) : (
                                <div className="border-2 border-dashed border-white/10 rounded-lg p-8 text-center hover:border-cyan/30 transition-colors">
                                    <ImageIcon size={48} className="mx-auto mb-4 text-gray-600" />
                                    <p className="text-gray-400 mb-2">Upload featured image</p>
                                    <input
                                        type="url"
                                        value={formData.image}
                                        onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                                        placeholder="Enter image URL"
                                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:border-cyan focus:outline-none"
                                    />
                                </div>
                            )}
                        </div>
                    </Card>

                    {/* Content Editor Card */}
                    <Card className="p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-bold text-white">Blog Content *</h2>
                            <span className="text-xs text-gray-500">Required field</span>
                        </div>

                        {/* Editor Toolbar */}
                        <div className="flex flex-wrap gap-2 p-3 bg-white/5 border border-white/10 rounded-lg mb-4">
                            <button className="p-2 rounded hover:bg-white/10 text-gray-400 hover:text-cyan transition-colors" title="Heading 1">
                                <Heading1 size={18} />
                            </button>
                            <button className="p-2 rounded hover:bg-white/10 text-gray-400 hover:text-cyan transition-colors" title="Heading 2">
                                <Heading2 size={18} />
                            </button>
                            <button className="p-2 rounded hover:bg-white/10 text-gray-400 hover:text-cyan transition-colors" title="Heading 3">
                                <Heading3 size={18} />
                            </button>
                            <div className="w-px h-6 bg-white/10 my-auto" />
                            <button className="p-2 rounded hover:bg-white/10 text-gray-400 hover:text-cyan transition-colors" title="Bold">
                                <Bold size={18} />
                            </button>
                            <button className="p-2 rounded hover:bg-white/10 text-gray-400 hover:text-cyan transition-colors" title="Italic">
                                <Italic size={18} />
                            </button>
                            <button className="p-2 rounded hover:bg-white/10 text-gray-400 hover:text-cyan transition-colors" title="Underline">
                                <Underline size={18} />
                            </button>
                            <div className="w-px h-6 bg-white/10 my-auto" />
                            <button className="p-2 rounded hover:bg-white/10 text-gray-400 hover:text-cyan transition-colors" title="Bullet List">
                                <List size={18} />
                            </button>
                            <button className="p-2 rounded hover:bg-white/10 text-gray-400 hover:text-cyan transition-colors" title="Numbered List">
                                <ListOrdered size={18} />
                            </button>
                            <div className="w-px h-6 bg-white/10 my-auto" />
                            <button className="p-2 rounded hover:bg-white/10 text-gray-400 hover:text-cyan transition-colors" title="Code Block">
                                <Code size={18} />
                            </button>
                            <button className="p-2 rounded hover:bg-white/10 text-gray-400 hover:text-cyan transition-colors" title="Quote">
                                <Quote size={18} />
                            </button>
                            <button className="p-2 rounded hover:bg-white/10 text-gray-400 hover:text-cyan transition-colors" title="Insert Link">
                                <LinkIcon size={18} />
                            </button>
                            <button className="p-2 rounded hover:bg-white/10 text-gray-400 hover:text-cyan transition-colors" title="Insert Image">
                                <ImageIcon size={18} />
                            </button>
                        </div>

                        {/* Content Textarea */}
                        <textarea
                            value={formData.content}
                            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                            placeholder="Write your blog content here... (Markdown supported)"
                            rows={20}
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:border-cyan focus:outline-none focus:ring-2 focus:ring-cyan/20 transition-all resize-none font-mono text-sm"
                        />
                        <p className="text-xs text-gray-500 mt-2">Supports Markdown formatting</p>
                    </Card>
                </div>

                {/* SEO Settings - Right Column (1/3) */}
                <div className="space-y-6">
                    {/* Status Card */}
                    <Card className="p-6">
                        <h2 className="text-lg font-bold text-white mb-4">Publish Settings</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">Status</label>
                                <select
                                    value={formData.status}
                                    onChange={(e) => setFormData({ ...formData, status: e.target.value as 'DRAFT' | 'PUBLISHED' })}
                                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:border-cyan focus:outline-none"
                                >
                                    <option value="DRAFT" className="bg-navy">Draft</option>
                                    <option value="PUBLISHED" className="bg-navy">Published</option>
                                </select>
                            </div>
                        </div>
                    </Card>

                    {/* SEO Settings Card */}
                    <Card className="p-6">
                        <h2 className="text-lg font-bold text-white mb-4">SEO Settings</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">
                                    Meta Title
                                </label>
                                <input
                                    type="text"
                                    value={formData.metaTitle}
                                    onChange={(e) => setFormData({ ...formData, metaTitle: e.target.value })}
                                    placeholder="SEO title"
                                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:border-cyan focus:outline-none"
                                />
                                <p className="text-xs text-gray-500 mt-1">{formData.metaTitle.length}/60 characters</p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">
                                    Meta Description
                                </label>
                                <textarea
                                    rows={3}
                                    value={formData.metaDescription}
                                    onChange={(e) => setFormData({ ...formData, metaDescription: e.target.value })}
                                    placeholder="SEO description"
                                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:border-cyan focus:outline-none resize-none"
                                />
                                <p className="text-xs text-gray-500 mt-1">{formData.metaDescription.length}/160 characters</p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">
                                    Keywords
                                </label>
                                <input
                                    type="text"
                                    value={formData.keywords}
                                    onChange={(e) => setFormData({ ...formData, keywords: e.target.value })}
                                    placeholder="keyword1, keyword2, keyword3"
                                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:border-cyan focus:outline-none"
                                />
                                <p className="text-xs text-gray-500 mt-1">Separate with commas</p>
                            </div>
                        </div>
                    </Card>

                    {/* Social Preview Card */}
                    <Card className="p-6">
                        <h2 className="text-lg font-bold text-white mb-4">Social Preview</h2>
                        <div className="border border-white/10 rounded-lg overflow-hidden">
                            {formData.image && (
                                <img src={formData.image} alt="Preview" className="w-full h-32 object-cover" />
                            )}
                            <div className="p-4 bg-white/5">
                                <h3 className="text-sm font-semibold text-white mb-1 line-clamp-1">
                                    {formData.metaTitle || formData.title || 'Blog Title'}
                                </h3>
                                <p className="text-xs text-gray-400 line-clamp-2">
                                    {formData.metaDescription || formData.excerpt || 'Blog description will appear here'}
                                </p>
                                <p className="text-xs text-gray-500 mt-2">rknextgen.com</p>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}
