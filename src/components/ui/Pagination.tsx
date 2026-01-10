'use client';

import React from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface PaginationProps {
    totalPages: number;
    currentPage: number;
    baseUrl: string;
}

export const Pagination = ({ totalPages, currentPage, baseUrl }: PaginationProps) => {
    const searchParams = useSearchParams();

    const createPageUrl = (page: number) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set('page', page.toString());
        return `${baseUrl}?${params.toString()}`;
    };

    if (totalPages <= 1) return null;

    return (
        <div className="flex justify-center items-center gap-4 mt-12">
            {currentPage > 1 && (
                <Link href={createPageUrl(currentPage - 1)}>
                    <Button variant="outline" size="sm">
                        <ChevronLeft size={16} className="mr-2" /> Previous
                    </Button>
                </Link>
            )}

            <span className="text-gray-400">
                Page <span className="text-white font-semibold">{currentPage}</span> of{' '}
                <span className="text-white font-semibold">{totalPages}</span>
            </span>

            {currentPage < totalPages && (
                <Link href={createPageUrl(currentPage + 1)}>
                    <Button variant="outline" size="sm">
                        Next <ChevronRight size={16} className="ml-2" />
                    </Button>
                </Link>
            )}
        </div>
    );
};
