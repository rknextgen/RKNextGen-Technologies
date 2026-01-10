'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, User, ArrowRight, Tag } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import NextImage from 'next/image';
import Link from 'next/link';

interface Blog {
    id: string;
    title: string;
    slug: string;
    excerpt: string;
    image: string;
    category: string;
    author: string;
    readTime: string;
    publishedAt: Date | null;
}

interface BlogGridProps {
    blogs: Blog[];
}

export const BlogGrid = ({ blogs }: BlogGridProps) => {
    if (blogs.length === 0) {
        return (
            <div className="text-center py-16">
                <p className="text-gray-400 text-lg mb-4">
                    No articles found in this category yet.
                </p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogs.map((post, index) => (
                <motion.div
                    key={post.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                >
                    <Link href={`/blog/${post.slug}`}>
                        <Card className="h-full group cursor-pointer overflow-hidden p-0" hover3D={true}>
                            <div className="relative h-48 w-full overflow-hidden">
                                <NextImage
                                    src={post.image}
                                    alt={post.title}
                                    fill
                                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-navy to-transparent opacity-60" />
                                <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-navy/80 backdrop-blur border border-cyan/30 text-xs text-cyan font-medium flex items-center gap-1">
                                    <Tag size={12} /> {post.category}
                                </div>
                            </div>

                            <div className="p-6">
                                <div className="flex items-center gap-4 text-xs text-gray-400 mb-4">
                                    <span className="flex items-center gap-1">
                                        <Calendar size={12} /> {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString() : 'Draft'}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <User size={12} /> {post.author}
                                    </span>
                                </div>

                                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-cyan transition-colors line-clamp-2">
                                    {post.title}
                                </h3>
                                <p className="text-gray-400 text-sm mb-6 line-clamp-3">
                                    {post.excerpt}
                                </p>

                                <div className="flex items-center justify-between mt-auto">
                                    <span className="text-xs text-gray-500">{post.readTime}</span>
                                    <span className="text-cyan text-sm font-medium flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                                        Read More <ArrowRight size={16} />
                                    </span>
                                </div>
                            </div>
                        </Card>
                    </Link>
                </motion.div>
            ))}
        </div>
    );
};
