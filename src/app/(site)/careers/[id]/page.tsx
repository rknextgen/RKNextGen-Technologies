import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Metadata } from 'next';
import { Briefcase, MapPin, Clock, ArrowLeft, CheckCircle } from 'lucide-react';
import { getJobById, getAllJobIds } from '@/lib/actions';
import { Section } from '@/components/ui/Section';
import { Card } from '@/components/ui/Card';
import { ApplyButton } from '@/components/careers/ApplyButton';

interface JobPageProps {
    params: Promise<{
        id: string;
    }>;
}

// Generate static params for all jobs
export async function generateStaticParams() {
    const jobs = await getAllJobIds();
    return jobs.map((job: { id: string }) => ({
        id: job.id,
    }));
}

// Generate metadata for SEO
export async function generateMetadata({ params }: JobPageProps): Promise<Metadata> {
    const { id } = await params;
    const job = await getJobById(id);

    if (!job) {
        return {
            title: 'Job Not Found',
        };
    }

    return {
        title: `${job.title} | RK NextGen Careers`,
        description: job.shortSummary,
        openGraph: {
            title: `${job.title} at RK NextGen`,
            description: job.shortSummary,
            type: 'website',
        },
    };
}

export default async function JobPage({ params }: JobPageProps) {
    const { id } = await params;
    const job = await getJobById(id);

    if (!job) {
        notFound();
    }

    return (
        <div className="min-h-screen pt-20 pb-20">
            <Section>
                <div className="max-w-4xl mx-auto">
                    <Link
                        href="/careers"
                        className="inline-flex items-center gap-2 text-cyan hover:text-white transition-colors mb-8 group"
                    >
                        <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                        Back to Careers
                    </Link>

                    <Card className="p-8 md:p-12 border-t-4 border-t-cyan">
                        <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-8 border-b border-white/10 pb-8">
                            <div>
                                <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">{job.title}</h1>
                                <div className="flex flex-wrap gap-6 text-gray-400">
                                    <span className="flex items-center gap-2">
                                        <Briefcase size={18} className="text-cyan" /> {job.department}
                                    </span>
                                    <span className="flex items-center gap-2">
                                        <MapPin size={18} className="text-cyan" /> {job.location}
                                    </span>
                                    <span className="flex items-center gap-2">
                                        <Clock size={18} className="text-cyan" /> {job.type}
                                    </span>
                                </div>
                            </div>
                            <div className="shrink-0">
                                <ApplyButton jobTitle={job.title} />
                            </div>
                        </div>

                        <div className="space-y-10 text-gray-300 leading-relaxed">
                            <div>
                                <h2 className="text-xl font-bold text-white mb-4">About the Role</h2>
                                <p>{job.shortSummary}</p>
                            </div>

                            <div>
                                <h2 className="text-xl font-bold text-white mb-4">Key Responsibilities</h2>
                                <ul className="space-y-3">
                                    {job.responsibilities.map((item: string, index: number) => (
                                        <li key={index} className="flex items-start gap-3">
                                            <CheckCircle className="w-5 h-5 text-cyan shrink-0 mt-0.5" />
                                            <span>{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div>
                                <h2 className="text-xl font-bold text-white mb-4">Requirements</h2>
                                <ul className="space-y-3">
                                    {job.requirements.map((item: string, index: number) => (
                                        <li key={index} className="flex items-start gap-3">
                                            <CheckCircle className="w-5 h-5 text-ai-purple shrink-0 mt-0.5" />
                                            <span>{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>


                        </div>

                        <div className="mt-12 pt-8 border-t border-white/10 text-center">
                            <h3 className="text-2xl font-bold text-white mb-6">Ready to join us?</h3>
                            <ApplyButton jobTitle={job.title} />
                        </div>
                    </Card>
                </div>
            </Section>
        </div>
    );
}
