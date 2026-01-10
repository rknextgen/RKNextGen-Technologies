'use client';

import React from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';

interface CategoryFilterProps {
    categories: string[];
    baseUrl: string;
    paramName?: string;
}

export const CategoryFilter = ({ categories, baseUrl, paramName = 'category' }: CategoryFilterProps) => {
    const searchParams = useSearchParams();
    const currentCategory = searchParams.get(paramName) || 'All';

    const getCategoryUrl = (category: string) => {
        const params = new URLSearchParams(searchParams.toString());
        if (category === 'All') {
            params.delete(paramName);
        } else {
            params.set(paramName, category);
        }
        params.set('page', '1'); // Reset to page 1
        return `${baseUrl}?${params.toString()}`;
    };

    return (
        <div className="flex flex-wrap justify-center gap-4 mb-16">
            {['All', ...categories].map((cat, index) => (
                <Link
                    key={cat}
                    href={getCategoryUrl(cat)}
                    scroll={false}
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.05 }}
                        className={`px-6 py-2 rounded-full border transition-all ${currentCategory === cat
                            ? 'bg-cyan/10 border-cyan text-cyan shadow-[0_0_15px_rgba(0,194,217,0.3)]'
                            : 'bg-white/5 border-white/10 text-gray-400 hover:border-cyan/50 hover:text-cyan'
                            }`}
                    >
                        {cat}
                    </motion.div>
                </Link>
            ))}
        </div>
    );
};
