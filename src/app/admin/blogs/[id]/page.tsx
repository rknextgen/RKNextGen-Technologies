'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Edit,
    Trash2,
    Copy,
    ArrowLeft,
    Calendar,
    User,
    Tag,
    Eye,
    Globe,
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
    publishedAt: string | null;
    image?: string;
}

export default function BlogPreviewPage() {
    const router = useRouter();
    const params = useParams();
    const [blog, setBlog] = useState<Blog | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchBlog();
    }, [params.id]);

    const fetchBlog = async () => {
        try {
            const response = await fetch(`/api/blogs/${params.id}`);
            const data = await response.json();
            setBlog(data);
        } catch (error) {
            console.error('Error fetching blog:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!confirm('Are you sure you want to delete this blog?')) return;

        try {
            const response = await fetch(`/api/blogs/${params.id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                router.push('/admin/blogs');
            }
        } catch (error) {
            console.error('Error deleting blog:', error);
        }
    };

    const handleDuplicate = async () => {
        if (!blog) return;

        try {
            const response = await fetch('/api/blogs', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...blog,
                    title: `${blog.title} (Copy)`,
                    slug: `${blog.slug}-copy`,
                    status: 'DRAFT',
                }),
            });

            if (response.ok) {
                router.push('/admin/blogs');
            }
        } catch (error) {
            console.error('Error duplicating blog:', error);
        }
    };

    const handleStatusChange = async (newStatus: 'DRAFT' | 'PUBLISHED') => {
        try {
            const response = await fetch(`/api/blogs/${params.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...blog, status: newStatus }),
            });

            if (response.ok) {
                fetchBlog();
            }
        } catch (error) {
            console.error('Error updating status:', error);
        }
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
                        <h1 className="text-2xl font-bold text-white">Blog Preview</h1>
                        <p className="text-gray-400 text-sm mt-1">View and manage blog post</p>
                    </div>
                </div>
                <Button
                    variant="outline"
                    onClick={() => window.open(`/blog/${blog.slug}`, '_blank')}
                >
                    <Globe size={16} className="mr-2" />
                    View Live
                </Button>
            </div>

            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Blog Preview - Left Column (2/3) */}
                <div className="lg:col-span-2">
                    <Card className="overflow-hidden">
                        {/* Featured Image */}
                        {blog.image && (
                            <div className="aspect-video w-full overflow-hidden bg-white/5">
                                <img
                                    src={blog.image}
                                    alt={blog.title}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        )}

                        {/* Content */}
                        <div className="p-8">
                            {/* Meta Info */}
                            <div className="flex flex-wrap items-center gap-4 mb-6">
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-full bg-cyan/10 text-cyan border border-cyan/30">
                                    <Tag size={12} />
                                    {blog.category}
                                </span>
                                <span
                                    className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${blog.status === 'PUBLISHED'
                                        ? 'bg-green-500/10 text-green-400 border border-green-500/30'
                                        : 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/30'
                                        }`}
                                >
                                    {blog.status}
                                </span>
                            </div>

                            {/* Title */}
                            <h1 className="text-4xl font-bold text-white mb-4 leading-tight">
                                {blog.title}
                            </h1>

                            {/* Author & Date */}
                            <div className="flex flex-wrap items-center gap-6 mb-8 text-gray-400">
                                <div className="flex items-center gap-2">
                                    <User size={16} />
                                    <span className="text-sm">{blog.author}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Calendar size={16} />
                                    <span className="text-sm">
                                        {new Date(blog.createdAt).toLocaleDateString('en-US', {
                                            month: 'long',
                                            day: 'numeric',
                                            year: 'numeric',
                                        })}
                                    </span>
                                </div>
                            </div>

                            {/* Excerpt */}
                            <div className="mb-8 p-4 bg-cyan/5 border-l-4 border-cyan rounded-r-lg">
                                <p className="text-gray-300 text-lg italic">{blog.excerpt}</p>
                            </div>

                            {/* Content */}
                            <div className="prose prose-invert max-w-none">
                                <div className="text-gray-300 leading-relaxed whitespace-pre-wrap">
                                    {blog.content}
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Admin Tools Panel - Right Column (1/3) */}
                <div className="space-y-6">
                    {/* Quick Actions */}
                    <Card className="p-6">
                        <h2 className="text-lg font-bold text-white mb-4">Quick Actions</h2>
                        <div className="space-y-3">
                            <Button
                                className="w-full justify-start"
                                variant="outline"
                                onClick={() => router.push(`/admin/blogs/${blog.id}/edit`)}
                            >
                                <Edit size={16} className="mr-2" />
                                Edit Blog
                            </Button>
                            <Button
                                className="w-full justify-start"
                                variant="outline"
                                onClick={handleDuplicate}
                            >
                                <Copy size={16} className="mr-2" />
                                Duplicate
                            </Button>
                            <Button
                                className="w-full justify-start text-red-400 hover:text-red-300 hover:bg-red-500/10"
                                variant="outline"
                                onClick={handleDelete}
                            >
                                <Trash2 size={16} className="mr-2" />
                                Delete Blog
                            </Button>
                        </div>
                    </Card>

                    {/* Status Control */}
                    <Card className="p-6">
                        <h2 className="text-lg font-bold text-white mb-4">Status Control</h2>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                                <span className="text-sm text-gray-400">Current Status</span>
                                <span
                                    className={`px-3 py-1 text-xs font-semibold rounded-full ${blog.status === 'PUBLISHED'
                                        ? 'bg-green-500/10 text-green-400 border border-green-500/30'
                                        : 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/30'
                                        }`}
                                >
                                    {blog.status}
                                </span>
                            </div>
                            {blog.status === 'DRAFT' ? (
                                <Button
                                    className="w-full"
                                    glow
                                    onClick={() => handleStatusChange('PUBLISHED')}
                                >
                                    <Eye size={16} className="mr-2" />
                                    Publish Now
                                </Button>
                            ) : (
                                <Button
                                    className="w-full"
                                    variant="outline"
                                    onClick={() => handleStatusChange('DRAFT')}
                                >
                                    Unpublish
                                </Button>
                            )}
                        </div>
                    </Card>

                    {/* Blog Info */}
                    <Card className="p-6">
                        <h2 className="text-lg font-bold text-white mb-4">Blog Information</h2>
                        <div className="space-y-3">
                            <div>
                                <p className="text-xs text-gray-500 mb-1">Slug</p>
                                <p className="text-sm text-gray-300 font-mono bg-white/5 px-3 py-2 rounded">
                                    /blog/{blog.slug}
                                </p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 mb-1">Created</p>
                                <p className="text-sm text-gray-300">
                                    {new Date(blog.createdAt).toLocaleString('en-US', {
                                        month: 'short',
                                        day: 'numeric',
                                        year: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit',
                                    })}
                                </p>
                            </div>
                            {blog.publishedAt && (
                                <div>
                                    <p className="text-xs text-gray-500 mb-1">Published</p>
                                    <p className="text-sm text-gray-300">
                                        {new Date(blog.publishedAt).toLocaleString('en-US', {
                                            month: 'short',
                                            day: 'numeric',
                                            year: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit',
                                        })}
                                    </p>
                                </div>
                            )}
                        </div>
                    </Card>

                    {/* SEO Preview */}
                    <Card className="p-6">
                        <h2 className="text-lg font-bold text-white mb-4">SEO Preview</h2>
                        <div className="border border-white/10 rounded-lg overflow-hidden">
                            {blog.image && (
                                <img src={blog.image} alt="SEO Preview" className="w-full h-32 object-cover" />
                            )}
                            <div className="p-4 bg-white/5">
                                <h3 className="text-sm font-semibold text-cyan mb-1 line-clamp-1">
                                    {blog.title}
                                </h3>
                                <p className="text-xs text-gray-400 line-clamp-2 mb-2">
                                    {blog.excerpt}
                                </p>
                                <p className="text-xs text-gray-500">rknextgen.com › blog › {blog.slug}</p>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}
