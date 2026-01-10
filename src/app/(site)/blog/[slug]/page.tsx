import React from 'react';
import { notFound } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize';
import { Calendar, User, Clock, Tag, Share2, Facebook, Twitter, Linkedin } from 'lucide-react';
import { Section } from '@/components/ui/Section';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import { getBlogBySlug, getPublishedBlogs } from '@/lib/actions';

interface Blog {
    id: string;
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    category: string;
    author: string;
    publishedAt: string;
    image?: string;
    metaTitle?: string;
    metaDescription?: string;
}

function calculateReadingTime(content: string): number {
    const wordsPerMinute = 200;
    const wordCount = content.split(/\s+/).length;
    return Math.ceil(wordCount / wordsPerMinute);
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const blog = await getBlogBySlug(slug);

    if (!blog) {
        return {
            title: 'Blog Not Found | RK NextGen Technologies',
        };
    }

    return {
        title: blog.metaTitle || `${blog.title} | RK NextGen Technologies`,
        description: blog.metaDescription || blog.excerpt,
        openGraph: {
            title: blog.metaTitle || blog.title,
            description: blog.metaDescription || blog.excerpt,
            images: blog.image ? [blog.image] : [],
            type: 'article',
            publishedTime: blog.publishedAt,
            authors: [blog.author],
        },
        twitter: {
            card: 'summary_large_image',
            title: blog.metaTitle || blog.title,
            description: blog.metaDescription || blog.excerpt,
            images: blog.image ? [blog.image] : [],
        },
    };
}

export default async function BlogDetailPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const blog = await getBlogBySlug(slug);

    if (!blog) {
        notFound();
    }

    const { blogs: allBlogs } = await getPublishedBlogs({ category: blog.category, limit: 4 });
    const relatedBlogs = allBlogs.filter((b: any) => b.slug !== blog.slug).slice(0, 3);

    const readingTime = calculateReadingTime(blog.content);
    const shareUrl = `https://rknextgen.com/blog/${blog.slug}`;

    const structuredData = {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: blog.title,
        description: blog.excerpt,
        image: blog.image,
        datePublished: blog.publishedAt,
        author: {
            '@type': 'Person',
            name: blog.author,
        },
        publisher: {
            '@type': 'Organization',
            name: 'RK NextGen Technologies',
            logo: {
                '@type': 'ImageObject',
                url: 'https://rknextgen.com/logo.png',
            },
        },
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
            />

            <div className="min-h-screen bg-black pt-20">
                {blog.image && (
                    <div className="w-full h-[400px] md:h-[500px] relative overflow-hidden">
                        <img
                            src={blog.image}
                            alt={blog.title}
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
                    </div>
                )}

                <Section className="relative -mt-32 z-10">
                    <div className="max-w-4xl mx-auto">
                        <Card className="p-8 md:p-12 mb-8">
                            <span className="inline-flex items-center gap-1.5 px-4 py-1.5 text-sm font-medium rounded-full bg-cyan/10 text-cyan border border-cyan/30 mb-6">
                                <Tag size={14} />
                                {blog.category}
                            </span>

                            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
                                {blog.title}
                            </h1>

                            <div className="flex flex-wrap items-center gap-6 text-gray-400 mb-6">
                                <div className="flex items-center gap-2">
                                    <User size={18} />
                                    <span>{blog.author}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Calendar size={18} />
                                    <span>
                                        {new Date(blog.publishedAt).toLocaleDateString('en-US', {
                                            month: 'long',
                                            day: 'numeric',
                                            year: 'numeric',
                                        })}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Clock size={18} />
                                    <span>{readingTime} min read</span>
                                </div>
                            </div>

                            <p className="text-xl text-gray-300 leading-relaxed border-l-4 border-cyan pl-6 py-2 bg-cyan/5">
                                {blog.excerpt}
                            </p>
                        </Card>

                        <Card className="p-8 md:p-12 mb-8">
                            <div className="markdown-content">
                                <ReactMarkdown
                                    remarkPlugins={[remarkGfm]}
                                    rehypePlugins={[rehypeRaw, rehypeSanitize]}
                                    components={{
                                        h1: ({ node, ...props }) => <h1 className="text-4xl font-bold text-white mb-6 mt-8 first:mt-0" {...props} />,
                                        h2: ({ node, ...props }) => <h2 className="text-3xl font-bold text-white mb-5 mt-8 first:mt-0 border-b border-cyan/20 pb-3" {...props} />,
                                        h3: ({ node, ...props }) => <h3 className="text-2xl font-semibold text-white mb-4 mt-6 first:mt-0" {...props} />,
                                        h4: ({ node, ...props }) => <h4 className="text-xl font-semibold text-white mb-3 mt-5 first:mt-0" {...props} />,
                                        p: ({ node, ...props }) => <p className="text-gray-300 leading-relaxed mb-4" {...props} />,
                                        ul: ({ node, ...props }) => <ul className="list-disc list-inside text-gray-300 mb-4 space-y-2 ml-4" {...props} />,
                                        ol: ({ node, ...props }) => <ol className="list-decimal list-inside text-gray-300 mb-4 space-y-2 ml-4" {...props} />,
                                        li: ({ node, ...props }) => <li className="text-gray-300 leading-relaxed" {...props} />,
                                        blockquote: ({ node, ...props }) => (
                                            <blockquote className="border-l-4 border-cyan pl-6 py-2 my-4 bg-cyan/5 italic text-gray-300" {...props} />
                                        ),
                                        code: ({ node, inline, ...props }: any) =>
                                            inline ? (
                                                <code className="bg-white/10 text-cyan px-2 py-1 rounded text-sm font-mono" {...props} />
                                            ) : (
                                                <code className="block bg-white/5 border border-white/10 text-gray-300 p-4 rounded-lg overflow-x-auto font-mono text-sm my-4" {...props} />
                                            ),
                                        pre: ({ node, ...props }) => <pre className="bg-white/5 border border-white/10 rounded-lg overflow-x-auto my-4" {...props} />,
                                        a: ({ node, ...props }) => <a className="text-cyan hover:text-cyan/80 underline transition-colors" {...props} />,
                                        hr: ({ node, ...props }) => <hr className="border-white/10 my-8" {...props} />,
                                        strong: ({ node, ...props }) => <strong className="font-bold text-white" {...props} />,
                                        em: ({ node, ...props }) => <em className="italic text-gray-200" {...props} />,
                                        table: ({ node, ...props }) => (
                                            <div className="overflow-x-auto my-4">
                                                <table className="min-w-full border border-white/10 rounded-lg" {...props} />
                                            </div>
                                        ),
                                        thead: ({ node, ...props }) => <thead className="bg-white/5" {...props} />,
                                        th: ({ node, ...props }) => <th className="border border-white/10 px-4 py-2 text-left text-white font-semibold" {...props} />,
                                        td: ({ node, ...props }) => <td className="border border-white/10 px-4 py-2 text-gray-300" {...props} />,
                                    }}
                                >
                                    {blog.content}
                                </ReactMarkdown>
                            </div>
                        </Card>

                        <Card className="p-6 mb-8">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-semibold text-white">Share this article</h3>
                                <div className="flex gap-3">
                                    <a
                                        href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(blog.title)}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="p-3 rounded-lg bg-white/5 hover:bg-cyan/10 text-gray-400 hover:text-cyan border border-white/10 hover:border-cyan/30 transition-all"
                                    >
                                        <Twitter size={20} />
                                    </a>
                                    <a
                                        href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="p-3 rounded-lg bg-white/5 hover:bg-cyan/10 text-gray-400 hover:text-cyan border border-white/10 hover:border-cyan/30 transition-all"
                                    >
                                        <Linkedin size={20} />
                                    </a>
                                    <a
                                        href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="p-3 rounded-lg bg-white/5 hover:bg-cyan/10 text-gray-400 hover:text-cyan border border-white/10 hover:border-cyan/30 transition-all"
                                    >
                                        <Facebook size={20} />
                                    </a>
                                </div>
                            </div>
                        </Card>

                        {relatedBlogs.length > 0 && (
                            <div className="mb-8">
                                <h2 className="text-3xl font-bold text-white mb-6">
                                    Related <span className="text-cyan">Articles</span>
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    {relatedBlogs.map((relatedBlog: any) => (
                                        <Link key={relatedBlog.id} href={`/blog/${relatedBlog.slug}`}>
                                            <Card className="overflow-hidden h-full group cursor-pointer hover:shadow-[0_0_30px_rgba(0,194,217,0.2)] transition-all">
                                                {relatedBlog.image && (
                                                    <div className="aspect-video overflow-hidden">
                                                        <img
                                                            src={relatedBlog.image}
                                                            alt={relatedBlog.title}
                                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                                        />
                                                    </div>
                                                )}
                                                <div className="p-4">
                                                    <span className="text-xs text-cyan">{relatedBlog.category}</span>
                                                    <h3 className="text-lg font-semibold text-white mt-2 line-clamp-2 group-hover:text-cyan transition-colors">
                                                        {relatedBlog.title}
                                                    </h3>
                                                    <p className="text-sm text-gray-400 mt-2 line-clamp-2">
                                                        {relatedBlog.excerpt}
                                                    </p>
                                                </div>
                                            </Card>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}

                        <Card className="p-8 text-center bg-gradient-to-br from-cyan/10 to-ai-purple/10 border-cyan/30">
                            <h3 className="text-2xl font-bold text-white mb-4">
                                Ready to Transform Your Business?
                            </h3>
                            <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
                                Let's discuss how RK NextGen Technologies can help you achieve your digital transformation goals.
                            </p>
                            <div className="flex justify-center">
                                <Link href="/contact">
                                    <Button glow size="lg">
                                        Get in Touch
                                    </Button>
                                </Link>
                            </div>
                        </Card>
                    </div>
                </Section>
            </div>
        </>
    );
}
