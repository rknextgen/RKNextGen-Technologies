'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Save,
    Eye,
    Upload,
    Image as ImageIcon,
    ArrowLeft,
    Clock,
    CheckCircle,
    AlertCircle,
    History,
    X,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { useRouter, useParams } from 'next/navigation';

interface Blog {
    id: string;
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    category: string;
    status: 'DRAFT' | 'PUBLISHED';
    author: string;
    createdAt: string;
    updatedAt?: string;
    image?: string;
    metaTitle?: string;
    metaDesc?: string;
    keywords?: string;
}

export default function EditBlogPage() {
    const router = useRouter();
    const params = useParams();
    const [blog, setBlog] = useState<Blog | null>(null);
    const [formData, setFormData] = useState<Partial<Blog>>({});
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [autoSaveStatus, setAutoSaveStatus] = useState<'saved' | 'saving' | 'error'>('saved');
    const [showPreview, setShowPreview] = useState(false);
    const [lastSaved, setLastSaved] = useState<Date | null>(null);

    useEffect(() => {
        fetchBlog();
    }, [params.id]);

    // Auto-save functionality
    useEffect(() => {
        if (!formData.title) return;

        const timer = setTimeout(() => {
            autoSave();
        }, 3000); // Auto-save after 3 seconds of inactivity

        return () => clearTimeout(timer);
    }, [formData]);

    const fetchBlog = async () => {
        try {
            const response = await fetch(`/api/blogs/${params.id}`);
            if (!response.ok) {
                console.error('Failed to fetch blog');
                setLoading(false);
                return;
            }
            const data = await response.json();
            const blogData = data.blog || data; // Handle both {blog: ...} and direct blog object
            setBlog(blogData);
            setFormData(blogData);
        } catch (error) {
            console.error('Error fetching blog:', error);
        } finally {
            setLoading(false);
        }
    };

    const autoSave = async () => {
        if (!formData.title) return;

        setAutoSaveStatus('saving');
        try {
            const response = await fetch(`/api/blogs/${params.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                setAutoSaveStatus('saved');
                setLastSaved(new Date());
            } else {
                setAutoSaveStatus('error');
            }
        } catch (error) {
            setAutoSaveStatus('error');
        }
    };

    const handleSave = async (status?: 'DRAFT' | 'PUBLISHED') => {
        setSaving(true);
        try {
            const response = await fetch(`/api/blogs/${params.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    status: status || formData.status,
                }),
            });

            if (response.ok) {
                setLastSaved(new Date());
                router.push('/admin/blogs');
            }
        } catch (error) {
            console.error('Error saving blog:', error);
        } finally {
            setSaving(false);
        }
    };

    const handleImageUpload = (url: string) => {
        setFormData({ ...formData, image: url });
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan"></div>
            </div>
        );
    }

    if (!blog) {
        return (
            <div className="text-center py-12">
                <p className="text-gray-400">Blog not found</p>
            </div>
        );
    }

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
                            Edit <span className="text-cyan">Blog Post</span>
                        </h1>
                        <div className="flex items-center gap-4 mt-1">
                            <p className="text-gray-400 text-sm">Last updated: {blog.updatedAt ? new Date(blog.updatedAt).toLocaleString() : 'Never'}</p>
                            {/* Auto-save indicator */}
                            <div className="flex items-center gap-2">
                                {autoSaveStatus === 'saving' && (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="flex items-center gap-2 text-yellow-400 text-sm"
                                    >
                                        <Clock size={14} className="animate-spin" />
                                        Saving...
                                    </motion.div>
                                )}
                                {autoSaveStatus === 'saved' && lastSaved && (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="flex items-center gap-2 text-green-400 text-sm"
                                    >
                                        <CheckCircle size={14} />
                                        Saved {lastSaved.toLocaleTimeString()}
                                    </motion.div>
                                )}
                                {autoSaveStatus === 'error' && (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="flex items-center gap-2 text-red-400 text-sm"
                                    >
                                        <AlertCircle size={14} />
                                        Save failed
                                    </motion.div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" onClick={() => setShowPreview(!showPreview)}>
                        <Eye size={16} className="mr-2" />
                        {showPreview ? 'Hide' : 'Show'} Preview
                    </Button>
                    <Button variant="outline" onClick={() => handleSave('DRAFT')} disabled={saving}>
                        <Save size={16} className="mr-2" />
                        Save Draft
                    </Button>
                    <Button glow onClick={() => handleSave('PUBLISHED')} disabled={saving}>
                        {saving ? 'Updating...' : 'Update & Publish'}
                    </Button>
                </div>
            </div>

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
                                    value={formData.title || ''}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
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
                                        value={formData.slug || ''}
                                        onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
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
                                    value={formData.excerpt || ''}
                                    onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                                    placeholder="Brief summary of your blog post..."
                                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:border-cyan focus:outline-none focus:ring-2 focus:ring-cyan/20 transition-all resize-none"
                                />
                                <p className="text-xs text-gray-500 mt-1">{(formData.excerpt || '').length}/160 characters</p>
                            </div>

                            {/* Category & Author */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-2">
                                        Category *
                                    </label>
                                    <select
                                        required
                                        value={formData.category || ''}
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
                                        value={formData.author || ''}
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
                                <div className="relative aspect-video rounded-lg overflow-hidden border border-white/10 group">
                                    <img
                                        src={formData.image}
                                        alt="Featured"
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                                        <button
                                            onClick={() => setFormData({ ...formData, image: '' })}
                                            className="px-4 py-2 bg-red-500 rounded-lg hover:bg-red-600 transition-colors text-white"
                                        >
                                            <X size={16} className="inline mr-2" />
                                            Remove
                                        </button>
                                        <button
                                            onClick={() => {
                                                const url = prompt('Enter new image URL:');
                                                if (url) handleImageUpload(url);
                                            }}
                                            className="px-4 py-2 bg-cyan rounded-lg hover:bg-cyan/90 transition-colors text-white"
                                        >
                                            <Upload size={16} className="inline mr-2" />
                                            Replace
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="border-2 border-dashed border-white/10 rounded-lg p-8 text-center hover:border-cyan/30 transition-colors">
                                    <ImageIcon size={48} className="mx-auto mb-4 text-gray-600" />
                                    <p className="text-gray-400 mb-2">Upload featured image</p>
                                    <input
                                        type="url"
                                        value={formData.image || ''}
                                        onChange={(e) => handleImageUpload(e.target.value)}
                                        placeholder="Enter image URL"
                                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:border-cyan focus:outline-none"
                                    />
                                </div>
                            )}
                        </div>
                    </Card>

                    {/* Content Editor Card */}
                    <Card className="p-6">
                        <h2 className="text-xl font-bold text-white mb-4">Blog Content</h2>
                        <textarea
                            value={formData.content || ''}
                            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                            placeholder="Write your blog content here... (Markdown supported)"
                            rows={20}
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:border-cyan focus:outline-none focus:ring-2 focus:ring-cyan/20 transition-all resize-none font-mono text-sm"
                        />
                        <p className="text-xs text-gray-500 mt-2">Supports Markdown formatting</p>
                    </Card>
                </div>

                {/* Right Column - Admin Tools */}
                <div className="space-y-6">
                    {/* Status Card */}
                    <Card className="p-6">
                        <h2 className="text-lg font-bold text-white mb-4">Status</h2>
                        <select
                            value={formData.status || 'DRAFT'}
                            onChange={(e) => setFormData({ ...formData, status: e.target.value as 'DRAFT' | 'PUBLISHED' })}
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:border-cyan focus:outline-none"
                        >
                            <option value="DRAFT" className="bg-navy">Draft</option>
                            <option value="PUBLISHED" className="bg-navy">Published</option>
                        </select>
                    </Card>

                    {/* Revision History */}
                    <Card className="p-6">
                        <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                            <History size={18} />
                            Revision History
                        </h2>
                        <div className="space-y-3">
                            <div className="p-3 bg-white/5 rounded-lg border border-white/10">
                                <p className="text-sm text-white mb-1">Current Version</p>
                                <p className="text-xs text-gray-400">
                                    {blog.updatedAt ? new Date(blog.updatedAt).toLocaleString() : 'Not saved yet'}
                                </p>
                            </div>
                            <div className="p-3 bg-white/5 rounded-lg border border-white/10">
                                <p className="text-sm text-white mb-1">Original Version</p>
                                <p className="text-xs text-gray-400">
                                    {new Date(blog.createdAt).toLocaleString()}
                                </p>
                            </div>
                        </div>
                    </Card>

                    {/* SEO Settings */}
                    <Card className="p-6">
                        <h2 className="text-lg font-bold text-white mb-4">SEO Settings</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">
                                    Meta Title
                                </label>
                                <input
                                    type="text"
                                    value={formData.metaTitle || ''}
                                    onChange={(e) => setFormData({ ...formData, metaTitle: e.target.value })}
                                    placeholder="SEO title"
                                    maxLength={60}
                                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:border-cyan focus:outline-none"
                                />
                                <p className="text-xs text-gray-500 mt-1">{(formData.metaTitle || '').length}/60 characters</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">
                                    Meta Description
                                </label>
                                <textarea
                                    rows={3}
                                    value={formData.metaDesc || ''}
                                    onChange={(e) => setFormData({ ...formData, metaDesc: e.target.value })}
                                    placeholder="SEO description"
                                    maxLength={160}
                                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:border-cyan focus:outline-none resize-none"
                                />
                                <p className="text-xs text-gray-500 mt-1">{(formData.metaDesc || '').length}/160 characters</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">
                                    Keywords
                                </label>
                                <input
                                    type="text"
                                    value={formData.keywords || ''}
                                    onChange={(e) => setFormData({ ...formData, keywords: e.target.value })}
                                    placeholder="keyword1, keyword2, keyword3"
                                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:border-cyan focus:outline-none"
                                />
                                <p className="text-xs text-gray-500 mt-1">Separate with commas</p>
                            </div>
                        </div>
                    </Card>

                    {/* Social Preview */}
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
                                <p className="text-xs text-gray-400 mb-2 line-clamp-2">
                                    {formData.metaDesc || formData.excerpt || 'Blog description will appear here'}
                                </p>
                                <p className="text-xs text-gray-500">rknextgen.com</p>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>

            {/* Preview Modal */}
            {showPreview && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
                    onClick={() => setShowPreview(false)}
                >
                    <motion.div
                        initial={{ scale: 0.9, y: 20 }}
                        animate={{ scale: 1, y: 0 }}
                        onClick={(e) => e.stopPropagation()}
                        className="w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-2xl"
                    >
                        {formData.image && (
                            <img src={formData.image} alt="Preview" className="w-full h-64 object-cover" />
                        )}
                        <div className="p-8">
                            <h1 className="text-4xl font-bold text-gray-900 mb-4">{formData.title || 'Untitled'}</h1>
                            <p className="text-gray-600 mb-6">{formData.excerpt}</p>
                            <div className="prose max-w-none">
                                <div className="text-gray-800 whitespace-pre-wrap">{formData.content}</div>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </div>
    );
}
