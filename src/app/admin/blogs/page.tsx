'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Plus,
    Search,
    Edit,
    Trash2,
    Eye,
    Filter,
    X,
    Save,
    FileText,
    Image as ImageIcon,
    Calendar,
    User,
    Tag,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

interface Blog {
    id: string;
    title: string;
    slug: string;
    excerpt: string;
    category: string;
    status: 'DRAFT' | 'PUBLISHED';
    author: string;
    createdAt: string;
    publishedAt: string | null;
    image?: string;
}

export default function BlogsPage() {
    const router = useRouter();
    const [blogs, setBlogs] = useState<Blog[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('');
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [editingBlog, setEditingBlog] = useState<Blog | null>(null);

    useEffect(() => {
        fetchBlogs();
    }, [statusFilter]);

    const fetchBlogs = async () => {
        try {
            setLoading(true);
            const params = new URLSearchParams();
            if (statusFilter) params.append('status', statusFilter);

            const response = await fetch(`/api/blogs?${params}`);
            const data = await response.json();
            setBlogs(data.blogs || []);
        } catch (error) {
            console.error('Error fetching blogs:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this blog?')) return;

        try {
            const response = await fetch(`/api/blogs/${id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                setBlogs(blogs.filter((b) => b.id !== id));
            }
        } catch (error) {
            console.error('Error deleting blog:', error);
        }
    };

    const filteredBlogs = blogs.filter((blog) => {
        const matchesSearch = blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            blog.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = !categoryFilter || blog.category === categoryFilter;
        return matchesSearch && matchesCategory;
    });

    const categories = Array.from(new Set(blogs.map(b => b.category)));

    return (
        <div className="w-full max-w-full space-y-6 p-4 md:p-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
                        Manage <span className="text-cyan">Blogs</span>
                    </h1>
                    <p className="text-sm md:text-base text-gray-400">Create, edit, and publish blog posts</p>
                </div>
                <Button glow onClick={() => router.push('/admin/blogs/create')} className="w-full sm:w-auto">
                    <Plus size={20} className="mr-2" />
                    Create New Blog
                </Button>
            </div>

            {/* Filters Card */}
            <Card className="p-4 md:p-6">
                <div className="flex flex-col gap-3 md:gap-4">
                    {/* Search */}
                    <div className="w-full relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search blogs..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-2.5 text-sm md:text-base text-white placeholder-gray-500 focus:border-cyan focus:outline-none focus:ring-1 focus:ring-cyan transition-all"
                        />
                    </div>

                    {/* Filters Row */}
                    <div className="flex flex-col sm:flex-row gap-3">
                        {/* Category Filter */}
                        <select
                            value={categoryFilter}
                            onChange={(e) => setCategoryFilter(e.target.value)}
                            className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 md:px-4 py-2.5 text-sm md:text-base text-white focus:border-cyan focus:outline-none focus:ring-1 focus:ring-cyan"
                        >
                            <option value="" className="bg-navy text-white">All Categories</option>
                            {categories.map(cat => (
                                <option key={cat} value={cat} className="bg-navy text-white">{cat}</option>
                            ))}
                        </select>

                        {/* Status Filter */}
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 md:px-4 py-2.5 text-sm md:text-base text-white focus:border-cyan focus:outline-none focus:ring-1 focus:ring-cyan"
                        >
                            <option value="" className="bg-navy text-white">All Status</option>
                            <option value="DRAFT" className="bg-navy text-white">Draft</option>
                            <option value="PUBLISHED" className="bg-navy text-white">Published</option>
                        </select>
                    </div>
                </div>
            </Card>

            {/* Blog Table */}
            <Card className="overflow-hidden">
                {loading ? (
                    <div className="flex items-center justify-center py-12">
                        <div className="text-gray-400">Loading blogs...</div>
                    </div>
                ) : filteredBlogs.length === 0 ? (
                    <div className="text-center py-12">
                        <FileText size={48} className="mx-auto mb-4 text-gray-600" />
                        <p className="text-gray-400">No blogs found</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-white/5 border-b border-white/10">
                                <tr>
                                    <th className="px-4 md:px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider w-2/5 min-w-[250px]">
                                        Blog
                                    </th>
                                    <th className="px-4 md:px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider hidden md:table-cell w-32">
                                        Category
                                    </th>
                                    <th className="px-4 md:px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider hidden lg:table-cell w-40">
                                        Author
                                    </th>
                                    <th className="px-4 md:px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider w-28">
                                        Status
                                    </th>
                                    <th className="px-4 md:px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider hidden sm:table-cell w-32">
                                        Date
                                    </th>
                                    <th className="px-4 md:px-6 py-4 text-right text-xs font-semibold text-gray-400 uppercase tracking-wider w-32">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/10">
                                {filteredBlogs.map((blog) => (
                                    <motion.tr
                                        key={blog.id}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="hover:bg-white/5 transition-colors group"
                                    >
                                        {/* Blog Info with Thumbnail */}
                                        <td className="px-4 md:px-6 py-4">
                                            <div className="flex items-center gap-3 md:gap-4">
                                                {/* Thumbnail */}
                                                <div className="relative w-16 h-16 md:w-20 md:h-20 flex-shrink-0 rounded-lg overflow-hidden bg-white/5 border border-white/10 group-hover:border-cyan/30 transition-colors">
                                                    {blog.image ? (
                                                        <img
                                                            src={blog.image}
                                                            alt={blog.title}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center">
                                                            <ImageIcon size={20} className="text-gray-600" />
                                                        </div>
                                                    )}
                                                </div>
                                                {/* Title & Excerpt */}
                                                <div className="min-w-0 flex-1">
                                                    <div className="text-sm font-semibold text-white mb-1 line-clamp-2 group-hover:text-cyan transition-colors" title={blog.title}>
                                                        {blog.title}
                                                    </div>
                                                    <div className="text-xs text-gray-400 line-clamp-1 hidden sm:block">
                                                        {blog.excerpt}
                                                    </div>
                                                    {/* Show category on mobile */}
                                                    <div className="md:hidden mt-1">
                                                        <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full bg-cyan/10 text-cyan border border-cyan/30">
                                                            <Tag size={10} />
                                                            {blog.category}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </td>

                                        {/* Category - Hidden on mobile */}
                                        <td className="px-4 md:px-6 py-4 whitespace-nowrap hidden md:table-cell">
                                            <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-full bg-cyan/10 text-cyan border border-cyan/30">
                                                <Tag size={12} />
                                                {blog.category}
                                            </span>
                                        </td>

                                        {/* Author - Hidden on tablet and mobile */}
                                        <td className="px-4 md:px-6 py-4 whitespace-nowrap hidden lg:table-cell">
                                            <div className="flex items-center gap-2 text-sm text-gray-300">
                                                <User size={14} className="text-gray-500" />
                                                {blog.author}
                                            </div>
                                        </td>

                                        {/* Status */}
                                        <td className="px-4 md:px-6 py-4 whitespace-nowrap">
                                            <span
                                                className={`inline-flex px-2 md:px-3 py-1 text-xs font-semibold rounded-full ${blog.status === 'PUBLISHED'
                                                    ? 'bg-green-500/10 text-green-400 border border-green-500/30'
                                                    : 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/30'
                                                    }`}
                                            >
                                                {blog.status}
                                            </span>
                                        </td>

                                        {/* Date - Hidden on mobile */}
                                        <td className="px-4 md:px-6 py-4 whitespace-nowrap hidden sm:table-cell">
                                            <div className="flex items-center gap-2 text-sm text-gray-400">
                                                <Calendar size={14} className="text-gray-500" />
                                                {new Date(blog.createdAt).toLocaleDateString('en-US', {
                                                    month: 'short',
                                                    day: 'numeric',
                                                    year: 'numeric'
                                                })}
                                            </div>
                                        </td>

                                        {/* Actions */}
                                        <td className="px-4 md:px-6 py-4 whitespace-nowrap text-right">
                                            <div className="flex justify-end gap-1 md:gap-2">
                                                <button
                                                    onClick={() => window.open(`/blog/${blog.slug}`, '_blank')}
                                                    className="p-2 rounded-lg bg-white/5 text-gray-400 hover:text-cyan hover:bg-cyan/10 border border-transparent hover:border-cyan/30 transition-all"
                                                    title="View"
                                                >
                                                    <Eye size={16} />
                                                </button>
                                                <button
                                                    onClick={() => router.push(`/admin/blogs/${blog.id}/edit`)}
                                                    className="p-2 rounded-lg bg-white/5 text-gray-400 hover:text-cyan hover:bg-cyan/10 border border-transparent hover:border-cyan/30 transition-all"
                                                    title="Edit"
                                                >
                                                    <Edit size={16} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(blog.id)}
                                                    className="p-2 rounded-lg bg-white/5 text-gray-400 hover:text-red-400 hover:bg-red-500/10 border border-transparent hover:border-red-500/30 transition-all"
                                                    title="Delete"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </Card>

            {/* Results Count */}
            {!loading && filteredBlogs.length > 0 && (
                <div className="text-sm text-gray-400 text-center">
                    Showing {filteredBlogs.length} of {blogs.length} blog{blogs.length !== 1 ? 's' : ''}
                </div>
            )}

            {/* Create/Edit Modal */}
            <AnimatePresence>
                {(showCreateModal || editingBlog) && (
                    <BlogFormModal
                        blog={editingBlog}
                        onClose={() => {
                            setShowCreateModal(false);
                            setEditingBlog(null);
                        }}
                        onSuccess={() => {
                            fetchBlogs();
                            setShowCreateModal(false);
                            setEditingBlog(null);
                        }}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}

// Blog Form Modal Component
function BlogFormModal({
    blog,
    onClose,
    onSuccess,
}: {
    blog: Blog | null;
    onClose: () => void;
    onSuccess: () => void;
}) {
    const [formData, setFormData] = useState({
        title: blog?.title || '',
        slug: blog?.slug || '',
        excerpt: blog?.excerpt || '',
        content: blog?.excerpt || '',
        category: blog?.category || '',
        tags: [] as string[],
        author: blog?.author || '',
        image: blog?.image || '',
        status: blog?.status || 'DRAFT',
    });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const url = blog ? `/api/blogs/${blog.id}` : '/api/blogs';
            const method = blog ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                onSuccess();
            }
        } catch (error) {
            console.error('Error saving blog:', error);
        } finally {
            setLoading(false);
        }
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
                className="relative w-full max-w-2xl bg-navy/95 backdrop-blur-xl border-2 border-cyan/30 rounded-2xl shadow-[0_0_50px_rgba(0,194,217,0.3)] max-h-[90vh] overflow-y-auto"
            >
                <div className="p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-white">
                            {blog ? 'Edit Blog Post' : 'Create New Blog Post'}
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
                                    setFormData({ ...formData, title: e.target.value });
                                    if (!blog) {
                                        setFormData({
                                            ...formData,
                                            title: e.target.value,
                                            slug: e.target.value.toLowerCase().replace(/\s+/g, '-'),
                                        });
                                    }
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
                            <label className="block text-sm font-medium text-gray-400 mb-1">Excerpt *</label>
                            <textarea
                                required
                                rows={3}
                                value={formData.excerpt}
                                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-cyan focus:outline-none focus:ring-1 focus:ring-cyan"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Category *</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.category}
                                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-cyan focus:outline-none focus:ring-1 focus:ring-cyan"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Author *</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.author}
                                    onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-cyan focus:outline-none focus:ring-1 focus:ring-cyan"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Featured Image URL</label>
                            <input
                                type="url"
                                value={formData.image}
                                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                                placeholder="https://example.com/image.jpg"
                                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-cyan focus:outline-none focus:ring-1 focus:ring-cyan"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Status</label>
                            <select
                                value={formData.status}
                                onChange={(e) => setFormData({ ...formData, status: e.target.value as 'DRAFT' | 'PUBLISHED' })}
                                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-cyan focus:outline-none focus:ring-1 focus:ring-cyan"
                            >
                                <option value="DRAFT" className="bg-navy text-white">Draft</option>
                                <option value="PUBLISHED" className="bg-navy text-white">Published</option>
                            </select>
                        </div>

                        <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
                            <Button variant="outline" onClick={onClose} type="button">
                                Cancel
                            </Button>
                            <Button glow type="submit" disabled={loading}>
                                <Save size={16} className="mr-2" />
                                {loading ? 'Saving...' : blog ? 'Update Blog' : 'Create Blog'}
                            </Button>
                        </div>
                    </form>
                </div>
            </motion.div>
        </div>
    );
}
