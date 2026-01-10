'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Edit, Trash2, X, Save, Star } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

interface CaseStudy {
    id: string;
    title: string;
    clientName: string;
    problem: string;
    solution: string;
    category: string;
    techStack: string[];
    impactMetrics: Array<{ metric: string; value: string; icon: string }>;
}

export default function CaseStudiesPage() {
    const [caseStudies, setCaseStudies] = useState<CaseStudy[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [editingStudy, setEditingStudy] = useState<CaseStudy | null>(null);

    useEffect(() => {
        fetchCaseStudies();
    }, []);

    const fetchCaseStudies = async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/case-studies');
            const data = await response.json();
            setCaseStudies(data.caseStudies || []);
        } catch (error) {
            console.error('Error fetching case studies:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this case study?')) return;

        try {
            const response = await fetch(`/api/case-studies/${id}`, { method: 'DELETE' });
            if (response.ok) {
                setCaseStudies(caseStudies.filter((cs) => cs.id !== id));
            }
        } catch (error) {
            console.error('Error deleting case study:', error);
        }
    };

    const filteredStudies = caseStudies.filter((study) =>
        study.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        study.clientName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">
                        Case <span className="text-cyan">Studies</span>
                    </h1>
                    <p className="text-gray-400">Manage success stories and case studies</p>
                </div>
                <Button glow onClick={() => setShowCreateModal(true)}>
                    <Plus size={20} className="mr-2" />
                    New Case Study
                </Button>
            </div>

            <Card className="p-4">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search case studies..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-500 focus:border-cyan focus:outline-none focus:ring-1 focus:ring-cyan"
                    />
                </div>
            </Card>

            {loading ? (
                <div className="text-center text-gray-400 py-12">Loading...</div>
            ) : filteredStudies.length === 0 ? (
                <Card className="p-12 text-center">
                    <Star size={48} className="mx-auto mb-4 text-gray-400 opacity-50" />
                    <p className="text-gray-400">No case studies found</p>
                </Card>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {filteredStudies.map((study) => (
                        <motion.div key={study.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                            <Card className="p-6 hover:border-cyan/50 transition-all">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="text-xl font-bold text-white mb-1">{study.title}</h3>
                                        <p className="text-cyan text-sm">{study.clientName}</p>
                                    </div>
                                    <span className="px-2 py-1 text-xs rounded-full bg-ai-purple/10 text-ai-purple border border-ai-purple/30">
                                        {study.category}
                                    </span>
                                </div>

                                <div className="space-y-3 mb-4">
                                    <div>
                                        <p className="text-xs text-gray-500 uppercase mb-1">Problem</p>
                                        <p className="text-sm text-gray-400 line-clamp-2">{study.problem}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 uppercase mb-1">Solution</p>
                                        <p className="text-sm text-gray-400 line-clamp-2">{study.solution}</p>
                                    </div>
                                </div>

                                <div className="flex gap-2 pt-4 border-t border-white/10">
                                    <button
                                        onClick={() => setEditingStudy(study)}
                                        className="p-2 rounded-lg bg-white/5 text-cyan hover:bg-cyan/10 transition-colors"
                                    >
                                        <Edit size={16} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(study.id)}
                                        className="p-2 rounded-lg bg-white/5 text-red-400 hover:bg-red-500/10 transition-colors"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            )}

            <AnimatePresence>
                {(showCreateModal || editingStudy) && (
                    <CaseStudyFormModal
                        study={editingStudy}
                        onClose={() => {
                            setShowCreateModal(false);
                            setEditingStudy(null);
                        }}
                        onSuccess={() => {
                            fetchCaseStudies();
                            setShowCreateModal(false);
                            setEditingStudy(null);
                        }}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}

function CaseStudyFormModal({
    study,
    onClose,
    onSuccess,
}: {
    study: CaseStudy | null;
    onClose: () => void;
    onSuccess: () => void;
}) {
    const [formData, setFormData] = useState({
        title: study?.title || '',
        clientName: study?.clientName || '',
        problem: study?.problem || '',
        solution: study?.solution || '',
        category: study?.category || '',
        techStack: study?.techStack || [],
        impactMetrics: study?.impactMetrics || [{ metric: '', value: '', icon: 'TrendingUp' }],
    });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const url = study ? `/api/case-studies/${study.id}` : '/api/case-studies';
            const method = study ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                onSuccess();
            }
        } catch (error) {
            console.error('Error saving case study:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="relative w-full max-w-2xl bg-navy border border-cyan/30 rounded-2xl shadow-[0_0_50px_rgba(0,194,217,0.2)] max-h-[90vh] overflow-y-auto"
            >
                <div className="p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-white">
                            {study ? 'Edit Case Study' : 'Create New Case Study'}
                        </h2>
                        <button onClick={onClose} className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-white transition-colors">
                            <X size={20} />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Title *</label>
                            <input
                                type="text"
                                required
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-cyan focus:outline-none focus:ring-1 focus:ring-cyan"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Client/Industry *</label>
                            <input
                                type="text"
                                required
                                value={formData.clientName}
                                onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-cyan focus:outline-none focus:ring-1 focus:ring-cyan"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Problem *</label>
                            <textarea
                                required
                                rows={3}
                                value={formData.problem}
                                onChange={(e) => setFormData({ ...formData, problem: e.target.value })}
                                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-cyan focus:outline-none focus:ring-1 focus:ring-cyan"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Solution *</label>
                            <textarea
                                required
                                rows={3}
                                value={formData.solution}
                                onChange={(e) => setFormData({ ...formData, solution: e.target.value })}
                                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-cyan focus:outline-none focus:ring-1 focus:ring-cyan"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Category *</label>
                            <select
                                required
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-cyan focus:outline-none focus:ring-1 focus:ring-cyan"
                            >
                                <option value="" className="bg-navy text-white">Select category</option>
                                <option value="AI Automation" className="bg-navy text-white">AI Automation</option>
                                <option value="Cloud Migration" className="bg-navy text-white">Cloud Migration</option>
                                <option value="Web Platform" className="bg-navy text-white">Web Platform</option>
                                <option value="Data Analytics" className="bg-navy text-white">Data Analytics</option>
                            </select>
                        </div>

                        <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
                            <Button variant="outline" onClick={onClose} type="button">
                                Cancel
                            </Button>
                            <Button glow type="submit" disabled={loading}>
                                <Save size={16} className="mr-2" />
                                {loading ? 'Saving...' : study ? 'Update' : 'Create'}
                            </Button>
                        </div>
                    </form>
                </div>
            </motion.div>
        </div>
    );
}
