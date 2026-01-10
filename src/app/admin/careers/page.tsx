'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Briefcase,
    Users,
    Plus,
    Search,
    Edit,
    Trash2,
    Check,
    X,
    ChevronDown,
    FileText,
    ExternalLink,
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export default function CareersPage() {
    const [activeTab, setActiveTab] = useState<'jobs' | 'applications'>('jobs');
    const [jobs, setJobs] = useState<any[]>([]);
    const [applications, setApplications] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showJobModal, setShowJobModal] = useState(false);
    const [editingJob, setEditingJob] = useState<any | null>(null);

    // Fetch data
    const fetchJobs = async () => {
        try {
            const res = await fetch('/api/jobs');
            const data = await res.json();
            setJobs(data.jobs || []);
        } catch (error) {
            console.error('Error fetching jobs:', error);
        }
    };

    const fetchApplications = async () => {
        try {
            const res = await fetch('/api/applications');
            const data = await res.json();
            setApplications(data.applications || []);
        } catch (error) {
            console.error('Error fetching applications:', error);
        }
    };

    useEffect(() => {
        setLoading(true);
        Promise.all([fetchJobs(), fetchApplications()]).finally(() => setLoading(false));
    }, []);

    const handleDeleteJob = async (id: string) => {
        if (!confirm('Are you sure you want to delete this job?')) return;
        try {
            await fetch(`/api/jobs/${id}`, { method: 'DELETE' });
            fetchJobs();
        } catch (error) {
            console.error('Error deleting job:', error);
        }
    };

    const handleUpdateApplicationStatus = async (id: string, status: string) => {
        try {
            await fetch(`/api/applications/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status }),
            });
            fetchApplications();
        } catch (error) {
            console.error('Error updating application:', error);
        }
    };

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">
                        Careers <span className="text-cyan">Management</span>
                    </h1>
                    <p className="text-gray-400">Manage job openings and applications</p>
                </div>
                <div className="flex gap-2">
                    <Button
                        variant={activeTab === 'jobs' ? 'primary' : 'outline'}
                        onClick={() => setActiveTab('jobs')}
                    >
                        <Briefcase className="mr-2 h-4 w-4" />
                        Jobs
                    </Button>
                    <Button
                        variant={activeTab === 'applications' ? 'primary' : 'outline'}
                        onClick={() => setActiveTab('applications')}
                    >
                        <Users className="mr-2 h-4 w-4" />
                        Applications
                    </Button>
                </div>
            </div>

            {/* Content */}
            <AnimatePresence mode="wait">
                {activeTab === 'jobs' ? (
                    <motion.div
                        key="jobs"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="space-y-6"
                    >
                        <div className="flex justify-between items-center">
                            <div className="relative w-64">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                                <input
                                    type="text"
                                    placeholder="Search jobs..."
                                    className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-white focus:outline-none focus:border-cyan/50"
                                />
                            </div>
                            <Button onClick={() => { setEditingJob(null); setShowJobModal(true); }}>
                                <Plus className="mr-2 h-4 w-4" />
                                Add Job
                            </Button>
                        </div>

                        <div className="grid gap-4">
                            {jobs.map((job) => (
                                <Card key={job.id} className="p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                    <div>
                                        <div className="flex items-center gap-3 mb-2">
                                            <h3 className="text-xl font-bold text-white">{job.title}</h3>
                                            <span className={`px-2 py-1 rounded text-xs font-medium ${job.status === 'OPEN' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                                                }`}>
                                                {job.status}
                                            </span>
                                        </div>
                                        <div className="flex flex-wrap gap-4 text-sm text-gray-400">
                                            <span>{job.department}</span>
                                            <span>•</span>
                                            <span>{job.location}</span>
                                            <span>•</span>
                                            <span>{job.type}</span>
                                            <span>•</span>
                                            <span>{job._count?.applications || 0} Applications</span>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => { setEditingJob(job); setShowJobModal(true); }}
                                            className="p-2 hover:bg-white/10 rounded-lg text-cyan transition-colors"
                                        >
                                            <Edit size={18} />
                                        </button>
                                        <button
                                            onClick={() => handleDeleteJob(job.id)}
                                            className="p-2 hover:bg-white/10 rounded-lg text-red-400 transition-colors"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        key="applications"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="space-y-6"
                    >
                        <div className="grid gap-4">
                            {applications.map((app) => (
                                <Card key={app.id} className="p-6">
                                    <div className="flex flex-col md:flex-row justify-between gap-6">
                                        <div className="flex-1">
                                            <div className="flex items-center justify-between mb-4">
                                                <div>
                                                    <h3 className="text-xl font-bold text-white">{app.name}</h3>
                                                    <p className="text-cyan text-sm">{app.job?.title || 'General Application'}</p>
                                                </div>
                                                <select
                                                    value={app.status}
                                                    onChange={(e) => handleUpdateApplicationStatus(app.id, e.target.value)}
                                                    className={`px-3 py-1 rounded-lg text-sm font-medium border-none outline-none cursor-pointer ${app.status === 'NEW' ? 'bg-blue-500/20 text-blue-400' :
                                                        app.status === 'IN_REVIEW' ? 'bg-yellow-500/20 text-yellow-400' :
                                                            app.status === 'SELECTED' ? 'bg-green-500/20 text-green-400' :
                                                                'bg-red-500/20 text-red-400'
                                                        }`}
                                                >
                                                    <option value="NEW" className="bg-navy text-white">New</option>
                                                    <option value="IN_REVIEW" className="bg-navy text-white">In Review</option>
                                                    <option value="SELECTED" className="bg-navy text-white">Selected</option>
                                                    <option value="REJECTED" className="bg-navy text-white">Rejected</option>
                                                </select>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-400 mb-4">
                                                <div className="flex items-center gap-2">
                                                    <Users size={16} />
                                                    {app.email}
                                                </div>
                                                {app.phone && (
                                                    <div className="flex items-center gap-2">
                                                        <Users size={16} />
                                                        {app.phone}
                                                    </div>
                                                )}
                                                {app.linkedIn && (
                                                    <a href={app.linkedIn} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-cyan">
                                                        <ExternalLink size={16} />
                                                        LinkedIn Profile
                                                    </a>
                                                )}
                                                <a href={app.resume} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-cyan">
                                                    <FileText size={16} />
                                                    View Resume
                                                </a>
                                            </div>

                                            {app.message && (
                                                <div className="bg-white/5 p-4 rounded-lg text-sm text-gray-300">
                                                    {app.message}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Job Modal */}
            {showJobModal && (
                <JobModal
                    job={editingJob}
                    onClose={() => setShowJobModal(false)}
                    onSave={() => {
                        setShowJobModal(false);
                        fetchJobs();
                    }}
                />
            )}
        </div>
    );
}

function JobModal({ job, onClose, onSave }: { job?: any; onClose: () => void; onSave: () => void }) {
    const [formData, setFormData] = useState({
        title: job?.title || '',
        department: job?.department || '',
        location: job?.location || '',
        type: job?.type || 'Full-time',
        shortSummary: job?.shortSummary || '',
        responsibilities: job?.responsibilities?.join('\n') || '',
        requirements: job?.requirements?.join('\n') || '',
        status: job?.status || 'OPEN',
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const payload = {
            ...formData,
            responsibilities: formData.responsibilities.split('\n').filter(Boolean),
            requirements: formData.requirements.split('\n').filter(Boolean),
        };

        try {
            const url = job ? `/api/jobs/${job.id}` : '/api/jobs';
            const method = job ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (res.ok) {
                onSave();
            }
        } catch (error) {
            console.error('Error saving job:', error);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-gray-900 border border-white/10 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            >
                <div className="p-6 border-b border-white/10 flex justify-between items-center sticky top-0 bg-gray-900 z-10">
                    <h2 className="text-xl font-bold text-white">{job ? 'Edit Job' : 'Add New Job'}</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white">
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm text-gray-400">Job Title</label>
                            <input
                                type="text"
                                required
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-cyan/50"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm text-gray-400">Department</label>
                            <input
                                type="text"
                                required
                                value={formData.department}
                                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-cyan/50"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm text-gray-400">Location</label>
                            <input
                                type="text"
                                required
                                value={formData.location}
                                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-cyan/50"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm text-gray-400">Type</label>
                            <select
                                value={formData.type}
                                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-cyan/50"
                            >
                                <option value="Full-time" className="bg-navy text-white">Full-time</option>
                                <option value="Part-time" className="bg-navy text-white">Part-time</option>
                                <option value="Contract" className="bg-navy text-white">Contract</option>
                                <option value="Internship" className="bg-navy text-white">Internship</option>
                            </select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm text-gray-400">Short Summary</label>
                        <textarea
                            required
                            value={formData.shortSummary}
                            onChange={(e) => setFormData({ ...formData, shortSummary: e.target.value })}
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-cyan/50 h-24"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm text-gray-400">Responsibilities (One per line)</label>
                        <textarea
                            required
                            value={formData.responsibilities}
                            onChange={(e) => setFormData({ ...formData, responsibilities: e.target.value })}
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-cyan/50 h-32"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm text-gray-400">Requirements (One per line)</label>
                        <textarea
                            required
                            value={formData.requirements}
                            onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-cyan/50 h-32"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm text-gray-400">Status</label>
                        <select
                            value={formData.status}
                            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-cyan/50"
                        >
                            <option value="OPEN" className="bg-navy text-white">Open</option>
                            <option value="CLOSED" className="bg-navy text-white">Closed</option>
                        </select>
                    </div>

                    <div className="flex justify-end gap-4 pt-4 border-t border-white/10">
                        <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
                        <Button type="submit" variant="primary">Save Job</Button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
}
