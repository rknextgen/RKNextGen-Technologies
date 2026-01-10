'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Save, Globe, Search } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

const defaultPages = [
    { id: 'home', pageName: 'Home Page' },
    { id: 'about', pageName: 'About Us' },
    { id: 'services', pageName: 'Services' },
    { id: 'projects', pageName: 'Projects' },
    { id: 'blog', pageName: 'Blog' },
    { id: 'careers', pageName: 'Careers' },
    { id: 'contact', pageName: 'Contact' },
];

export default function SEOPage() {
    const [seoSettings, setSeoSettings] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState<string | null>(null);

    useEffect(() => {
        fetchSEOSettings();
    }, []);

    const fetchSEOSettings = async () => {
        try {
            const res = await fetch('/api/seo');
            const data = await res.json();

            // Merge with default pages to ensure all are present
            const merged = defaultPages.map(page => {
                const existing = data.seoSettings?.find((s: any) => s.id === page.id);
                return existing || { ...page, metaTitle: '', metaDesc: '', ogImage: '' };
            });

            setSeoSettings(merged);
        } catch (error) {
            console.error('Error fetching SEO settings:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (pageId: string) => {
        setSaving(pageId);
        const setting = seoSettings.find(s => s.id === pageId);

        try {
            await fetch('/api/seo', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(setting),
            });
        } catch (error) {
            console.error('Error saving SEO settings:', error);
        } finally {
            setSaving(null);
        }
    };

    const handleChange = (id: string, field: string, value: string) => {
        setSeoSettings(prev => prev.map(item =>
            item.id === id ? { ...item, [field]: value } : item
        ));
    };

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-white mb-2">
                    SEO <span className="text-cyan">Management</span>
                </h1>
                <p className="text-gray-400">Manage meta tags and social preview settings</p>
            </div>

            {/* Content */}
            <div className="grid gap-6">
                {seoSettings.map((page, index) => (
                    <motion.div
                        key={page.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                    >
                        <Card className="p-6">
                            <div className="flex items-start justify-between mb-6">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-cyan/10 rounded-lg">
                                        <Globe className="text-cyan" size={24} />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-white">{page.pageName}</h3>
                                        <p className="text-sm text-gray-400">ID: {page.id}</p>
                                    </div>
                                </div>
                                <Button
                                    onClick={() => handleSave(page.id)}
                                    disabled={saving === page.id}
                                >
                                    <Save className="mr-2 h-4 w-4" />
                                    {saving === page.id ? 'Saving...' : 'Save Changes'}
                                </Button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-sm text-gray-400">Meta Title</label>
                                        <input
                                            type="text"
                                            value={page.metaTitle}
                                            onChange={(e) => handleChange(page.id, 'metaTitle', e.target.value)}
                                            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-cyan/50"
                                            placeholder="Page Title | Company Name"
                                        />
                                        <p className="text-xs text-gray-500 text-right">
                                            {page.metaTitle?.length || 0} / 60 characters
                                        </p>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm text-gray-400">OG Image URL</label>
                                        <div className="flex gap-2">
                                            <input
                                                type="text"
                                                value={page.ogImage}
                                                onChange={(e) => handleChange(page.id, 'ogImage', e.target.value)}
                                                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-cyan/50"
                                                placeholder="https://..."
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-sm text-gray-400">Meta Description</label>
                                        <textarea
                                            value={page.metaDesc}
                                            onChange={(e) => handleChange(page.id, 'metaDesc', e.target.value)}
                                            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-cyan/50 h-32 resize-none"
                                            placeholder="Brief description of the page content..."
                                        />
                                        <p className="text-xs text-gray-500 text-right">
                                            {page.metaDesc?.length || 0} / 160 characters
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
