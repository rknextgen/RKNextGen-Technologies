import React, { Suspense } from 'react';
import { getPublishedBlogs } from '@/lib/actions';
import BlogClient from './BlogClient';
import { Loader2 } from 'lucide-react';

export const metadata = {
    title: 'Blog | RK NextGen Technologies',
    description: 'Insights, tutorials, and updates from the world of technology and innovation.',
};

export default async function BlogsPage() {
    // Fetch all published blogs on the server
    // We fetch a large limit to allow client-side filtering without re-fetching
    const { blogs } = await getPublishedBlogs({ limit: 1000 });

    return (
        <Suspense fallback={
            <div className="min-h-screen bg-black pt-20 flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-cyan animate-spin" />
            </div>
        }>
            <BlogClient initialBlogs={blogs} />
        </Suspense>
    );
}
