import React from 'react';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { Section } from '@/components/ui/Section';
import { Card } from '@/components/ui/Card';
import { getLegalPage } from '@/lib/actions';

interface LegalPageProps {
    params: Promise<{
        slug: string;
    }>;
}

export async function generateMetadata({ params }: LegalPageProps): Promise<Metadata> {
    const { slug } = await params;
    const page = await getLegalPage(slug);

    if (!page) {
        return {
            title: 'Page Not Found',
        };
    }

    return {
        title: `${page.title} | RK NextGen Technologies`,
    };
}

export default async function LegalPage({ params }: LegalPageProps) {
    const { slug } = await params;
    const page = await getLegalPage(slug);

    if (!page) {
        notFound();
    }

    return (
        <div className="pt-20 min-h-screen">
            <Section>
                <div className="max-w-4xl mx-auto">
                    <Card className="p-8 md:p-12">
                        <h1 className="text-3xl md:text-5xl font-bold text-white mb-8 border-b border-white/10 pb-6">
                            {page.title}
                        </h1>
                        <div className="prose prose-invert prose-lg max-w-none prose-headings:text-white prose-a:text-cyan prose-strong:text-white prose-code:text-cyan">
                            <div dangerouslySetInnerHTML={{ __html: page.content }} />
                        </div>
                        <div className="mt-12 pt-6 border-t border-white/10 text-sm text-gray-500">
                            Last Updated: {new Date(page.updatedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                        </div>
                    </Card>
                </div>
            </Section>
        </div>
    );
}
