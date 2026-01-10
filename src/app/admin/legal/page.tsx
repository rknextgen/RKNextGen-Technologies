'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Save, Scale, FileText } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

const defaultPages = [
    { id: 'privacy', title: 'Privacy Policy' },
    { id: 'terms', title: 'Terms of Service' },
    { id: 'disclaimer', title: 'Disclaimer' },
    { id: 'cookies', title: 'Cookie Policy' },
];

export default function LegalPage() {
    const [legalPages, setLegalPages] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState<string | null>(null);
    const [activePage, setActivePage] = useState<string>('privacy');

    useEffect(() => {
        fetchLegalPages();
    }, []);

    const fetchLegalPages = async () => {
        try {
            const res = await fetch('/api/legal');
            const data = await res.json();

            // Merge with default pages
            const merged = defaultPages.map(page => {
                const existing = data.legalPages?.find((p: any) => p.id === page.id);
                return existing || { ...page, content: '' };
            });

            setLegalPages(merged);
        } catch (error) {
            console.error('Error fetching legal pages:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setSaving(activePage);
        const page = legalPages.find(p => p.id === activePage);

        try {
            await fetch('/api/legal', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(page),
            });
        } catch (error) {
            console.error('Error saving legal page:', error);
        } finally {
            setSaving(null);
        }
    };

    const handleChange = (content: string) => {
        setLegalPages(prev => prev.map(item =>
            item.id === activePage ? { ...item, content } : item
        ));
    };

    const currentPage = legalPages.find(p => p.id === activePage);

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-white mb-2">
                    Legal <span className="text-cyan">Pages</span>
                </h1>
                <p className="text-gray-400">Manage terms, privacy policy, and other legal documents</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Sidebar */}
                <Card className="p-4 h-fit">
                    <div className="space-y-2">
                        {legalPages.map((page) => (
                            <button
                                key={page.id}
                                onClick={() => setActivePage(page.id)}
                                className={`w-full text-left px-4 py-3 rounded-lg transition-colors flex items-center gap-3 ${activePage === page.id
                                        ? 'bg-cyan/10 text-cyan border border-cyan/20'
                                        : 'text-gray-400 hover:bg-white/5 hover:text-white'
                                    }`}
                            >
                                <FileText size={18} />
                                {page.title}
                            </button>
                        ))}
                    </div>
                </Card>

                {/* Editor Area */}
                <div className="lg:col-span-3">
                    <motion.div
                        key={activePage}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.2 }}
                    >
                        <Card className="p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                    <Scale className="text-cyan" size={24} />
                                    Edit {currentPage?.title}
                                </h2>
                                <Button
                                    onClick={handleSave}
                                    disabled={saving === activePage}
                                >
                                    <Save className="mr-2 h-4 w-4" />
                                    {saving === activePage ? 'Saving...' : 'Save Content'}
                                </Button>
                            </div>

                            <div className="space-y-4">
                                <div className="bg-white/5 border border-white/10 rounded-lg p-2">
                                    {/* Simple Toolbar Placeholder */}
                                    <div className="flex gap-2 border-b border-white/10 pb-2 mb-2 px-2">
                                        <span className="text-xs text-gray-500 uppercase tracking-wider">Markdown Supported</span>
                                    </div>
                                    <textarea
                                        value={currentPage?.content || ''}
                                        onChange={(e) => handleChange(e.target.value)}
                                        className="w-full h-[500px] bg-transparent text-white p-4 focus:outline-none resize-none font-mono text-sm"
                                        placeholder="# Privacy Policy\n\nYour content here..."
                                    />
                                </div>
                            </div>
                        </Card>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
