'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import {
    Search,
    Calendar,
    User,
    Tag,
    ArrowRight,
    Loader2,
} from 'lucide-react';
import { Section } from '@/components/ui/Section';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { CategoryFilter } from '@/components/blog/CategoryFilter';
import Link from 'next/link';

interface Blog {
    id: string;
    title: string;
    slug: string;
    excerpt: string;
    category: string;
    author: string;
    publishedAt: string;
    image?: string;
}

const BLOGS_PER_PAGE = 6;

interface BlogClientProps {
    initialBlogs: Blog[];
}

export default function BlogClient({ initialBlogs }: BlogClientProps) {
    const searchParams = useSearchParams();
    const [blogs] = useState<Blog[]>(initialBlogs);
    const [loadingMore, setLoadingMore] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [page, setPage] = useState(1);

    const selectedCategory = searchParams.get('category') || 'All';

    // Extract unique categories
    const categories = React.useMemo(() => {
        const unique = new Set(blogs.map((blog) => blog.category));
        return Array.from(unique);
    }, [blogs]);

    // Reset page when category or search changes
    useEffect(() => {
        setPage(1);
    }, [selectedCategory, searchTerm]);

    const filteredBlogs = React.useMemo(() => {
        let filtered = blogs;

        // Filter by category
        if (selectedCategory !== 'All') {
            filtered = filtered.filter(blog => blog.category === selectedCategory);
        }

        // Filter by search term
        if (searchTerm) {
            filtered = filtered.filter(blog =>
                blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                blog.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        return filtered;
    }, [blogs, selectedCategory, searchTerm]);

    const displayedBlogs = React.useMemo(() => {
        const endIndex = page * BLOGS_PER_PAGE;
        return filteredBlogs.slice(0, endIndex);
    }, [filteredBlogs, page]);

    const hasMore = displayedBlogs.length < filteredBlogs.length;

    const loadMore = () => {
        setLoadingMore(true);
        setTimeout(() => {
            setPage(prev => prev + 1);
            setLoadingMore(false);
        }, 500);
    };

    const handleSearchChange = (value: string) => {
        setSearchTerm(value);
    };

    return (
        <div className="min-h-screen bg-black pt-20">
            {/* Hero Section */}
            <Section className="relative overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute inset-0" style={{
                        backgroundImage: `
                            linear-gradient(rgba(0, 194, 217, 0.1) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(0, 194, 217, 0.1) 1px, transparent 1px)
                        `,
                        backgroundSize: '50px 50px',
                    }} />
                </div>

                <div className="relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-center mb-12"
                    >
                        <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
                            Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan to-ai-purple">Blog</span>
                        </h1>
                        <p className="text-gray-400 max-w-2xl mx-auto text-lg">
                            Insights, tutorials, and updates from the world of technology and innovation
                        </p>
                    </motion.div>

                    {/* Search & Filters */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="max-w-4xl mx-auto mb-12"
                    >
                        <Card className="p-6">
                            {/* Search Bar */}
                            <div className="relative mb-6">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                <input
                                    type="text"
                                    placeholder="Search blogs..."
                                    value={searchTerm}
                                    onChange={(e) => handleSearchChange(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-lg pl-12 pr-4 py-3 text-white placeholder-gray-500 focus:border-cyan focus:outline-none focus:ring-2 focus:ring-cyan/20 transition-all"
                                />
                            </div>
                        </Card>
                    </motion.div>

                    {/* Category Filter */}
                    <CategoryFilter categories={categories} baseUrl="/blog" />
                </div>

                {/* Blog Grid */}
                {displayedBlogs.length === 0 ? (
                    <div className="text-center py-20">
                        <p className="text-gray-400 text-lg">No blogs found</p>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {displayedBlogs.map((blog, index) => {
                                return (
                                    <motion.div
                                        key={blog.id}
                                        initial={{ opacity: 0, y: 30 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.5, delay: (index % 6) * 0.1 }}
                                    >
                                        <Link href={`/blog/${blog.slug}`}>
                                            <Card className="overflow-hidden h-full group cursor-pointer hover:shadow-[0_0_30px_rgba(0,194,217,0.2)] transition-all duration-300">
                                                {/* Featured Image */}
                                                <div className="aspect-video overflow-hidden bg-white/5">
                                                    {blog.image ? (
                                                        <img
                                                            src={blog.image}
                                                            alt={blog.title}
                                                            loading="lazy"
                                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-cyan/10 to-ai-purple/10">
                                                            <Tag size={48} className="text-gray-600" />
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Content */}
                                                <div className="p-6">
                                                    {/* Category Badge */}
                                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-full bg-cyan/10 text-cyan border border-cyan/30 mb-3">
                                                        <Tag size={12} />
                                                        {blog.category}
                                                    </span>

                                                    {/* Title */}
                                                    <h3 className="text-xl font-bold text-white mb-3 line-clamp-2 group-hover:text-cyan transition-colors">
                                                        {blog.title}
                                                    </h3>

                                                    {/* Excerpt */}
                                                    <p className="text-gray-400 text-sm mb-4 line-clamp-3">
                                                        {blog.excerpt}
                                                    </p>

                                                    {/* Meta Info */}
                                                    <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                                                        <div className="flex items-center gap-2">
                                                            <User size={14} />
                                                            <span>{blog.author}</span>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <Calendar size={14} />
                                                            <span>
                                                                {new Date(blog.publishedAt).toLocaleDateString('en-US', {
                                                                    month: 'short',
                                                                    day: 'numeric',
                                                                    year: 'numeric'
                                                                })}
                                                            </span>
                                                        </div>
                                                    </div>

                                                    {/* Read More Button */}
                                                    <div className="flex items-center gap-2 text-cyan text-sm font-medium group-hover:gap-3 transition-all">
                                                        Read More
                                                        <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                                                    </div>
                                                </div>
                                            </Card>
                                        </Link>
                                    </motion.div>
                                )
                            })}
                        </div>

                        {/* Load More Button */}
                        {hasMore && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="flex justify-center mt-12"
                            >
                                <Button
                                    glow
                                    onClick={loadMore}
                                    disabled={loadingMore}
                                    className="px-8"
                                >
                                    {loadingMore ? (
                                        <>
                                            <Loader2 size={16} className="mr-2 animate-spin" />
                                            Loading...
                                        </>
                                    ) : (
                                        'Load More Blogs'
                                    )}
                                </Button>
                            </motion.div>
                        )}
                    </>
                )}
            </Section>
        </div>
    );
}
