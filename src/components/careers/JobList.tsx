'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Briefcase, MapPin, Clock } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ApplicationForm } from './ApplicationForm';
import Link from 'next/link';

interface Job {
    id: string;
    title: string;
    department: string;
    location: string;
    type: string;
    shortSummary: string;
}

interface JobListProps {
    jobs: Job[];
}

export const JobList = ({ jobs }: JobListProps) => {
    const [selectedJobForApply, setSelectedJobForApply] = useState<Job | null>(null);
    const [isApplicationOpen, setIsApplicationOpen] = useState(false);

    const handleApplyClick = (job: Job) => {
        setSelectedJobForApply(job);
        setIsApplicationOpen(true);
    };

    const handleCloseApplication = () => {
        setIsApplicationOpen(false);
        setSelectedJobForApply(null);
    };

    if (jobs.length === 0) {
        return (
            <div className="text-center py-16">
                <p className="text-gray-400 text-lg mb-4">
                    No open positions found matching your criteria.
                </p>
            </div>
        );
    }

    return (
        <>
            <div className="space-y-6">
                {jobs.map((job, index) => (
                    <motion.div
                        key={job.id}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1 }}
                    >
                        <Card className="p-6 hover:border-cyan/50 transition-colors group">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                <div>
                                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-cyan transition-colors">
                                        {job.title}
                                    </h3>
                                    <div className="flex flex-wrap gap-4 text-sm text-gray-400 mb-3">
                                        <span className="flex items-center gap-1">
                                            <Briefcase size={14} /> {job.department}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <MapPin size={14} /> {job.location}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Clock size={14} /> {job.type}
                                        </span>
                                    </div>
                                    <p className="text-gray-400 text-sm line-clamp-2">{job.shortSummary}</p>
                                </div>
                                <div className="flex gap-3 shrink-0">
                                    <Link href={`/careers/${job.id}`}>
                                        <Button variant="outline" size="sm">
                                            View Details
                                        </Button>
                                    </Link>
                                    <Button glow size="sm" onClick={() => handleApplyClick(job)}>
                                        Apply Now
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    </motion.div>
                ))}
            </div>

            <ApplicationForm
                isOpen={isApplicationOpen}
                onClose={handleCloseApplication}
                jobTitle={selectedJobForApply?.title}
            />
        </>
    );
};
