'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Save, Settings as SettingsIcon, Globe, Palette, Mail, Phone } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

interface Settings {
    companyName: string;
    tagline: string;
    email: string;
    phone: string;
    whatsapp: string;
    socialLinks: {
        linkedin?: string;
        twitter?: string;
        github?: string;
        facebook?: string;
        instagram?: string;
    };
    analyticsId?: string;
    primaryColor: string;
    accentColor: string;
    darkMode: boolean;
    animations: boolean;
    metaTitle?: string;
    metaDescription?: string;
    ogImage?: string;
}

export default function SettingsPage() {
    const [settings, setSettings] = useState<Settings | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [activeTab, setActiveTab] = useState<'general' | 'social' | 'seo' | 'theme'>('general');

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/settings');
            const data = await response.json();
            setSettings(data.settings);
        } catch (error) {
            console.error('Error fetching settings:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        if (!settings) return;

        setSaving(true);
        try {
            const response = await fetch('/api/settings', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(settings),
            });

            if (response.ok) {
                alert('Settings saved successfully!');
            }
        } catch (error) {
            console.error('Error saving settings:', error);
            alert('Failed to save settings');
        } finally {
            setSaving(false);
        }
    };

    if (loading || !settings) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="text-gray-400">Loading settings...</div>
            </div>
        );
    }

    const tabs = [
        { id: 'general' as const, label: 'General', icon: SettingsIcon },
        { id: 'social' as const, label: 'Social Media', icon: Globe },
        { id: 'seo' as const, label: 'SEO', icon: Globe },
        { id: 'theme' as const, label: 'Theme', icon: Palette },
    ];

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">
                        Website <span className="text-cyan">Settings</span>
                    </h1>
                    <p className="text-gray-400">Configure your website settings</p>
                </div>
                <Button glow onClick={handleSave} disabled={saving}>
                    <Save size={20} className="mr-2" />
                    {saving ? 'Saving...' : 'Save Changes'}
                </Button>
            </div>

            {/* Tabs */}
            <Card className="p-2">
                <div className="flex gap-2 overflow-x-auto">
                    {tabs.map((tab) => {
                        const Icon = tab.icon;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all whitespace-nowrap ${activeTab === tab.id
                                        ? 'bg-cyan/10 text-cyan border border-cyan/30'
                                        : 'text-gray-400 hover:bg-white/5'
                                    }`}
                            >
                                <Icon size={18} />
                                {tab.label}
                            </button>
                        );
                    })}
                </div>
            </Card>

            {/* Tab Content */}
            <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
            >
                {activeTab === 'general' && (
                    <Card className="p-6">
                        <h2 className="text-xl font-bold text-white mb-6">General Information</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">Company Name</label>
                                <input
                                    type="text"
                                    value={settings.companyName}
                                    onChange={(e) => setSettings({ ...settings, companyName: e.target.value })}
                                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-cyan focus:outline-none focus:ring-1 focus:ring-cyan"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">Tagline</label>
                                <input
                                    type="text"
                                    value={settings.tagline}
                                    onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
                                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-cyan focus:outline-none focus:ring-1 focus:ring-cyan"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-2">
                                        <Mail className="inline mr-2" size={14} />
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        value={settings.email}
                                        onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-cyan focus:outline-none focus:ring-1 focus:ring-cyan"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-2">
                                        <Phone className="inline mr-2" size={14} />
                                        Phone
                                    </label>
                                    <input
                                        type="tel"
                                        value={settings.phone}
                                        onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-cyan focus:outline-none focus:ring-1 focus:ring-cyan"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">WhatsApp Number</label>
                                <input
                                    type="tel"
                                    value={settings.whatsapp}
                                    onChange={(e) => setSettings({ ...settings, whatsapp: e.target.value })}
                                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-cyan focus:outline-none focus:ring-1 focus:ring-cyan"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">Google Analytics ID</label>
                                <input
                                    type="text"
                                    value={settings.analyticsId || ''}
                                    onChange={(e) => setSettings({ ...settings, analyticsId: e.target.value })}
                                    placeholder="G-XXXXXXXXXX"
                                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:border-cyan focus:outline-none focus:ring-1 focus:ring-cyan"
                                />
                            </div>
                        </div>
                    </Card>
                )}

                {activeTab === 'social' && (
                    <Card className="p-6">
                        <h2 className="text-xl font-bold text-white mb-6">Social Media Links</h2>
                        <div className="space-y-4">
                            {['linkedin', 'twitter', 'github', 'facebook', 'instagram'].map((platform) => (
                                <div key={platform}>
                                    <label className="block text-sm font-medium text-gray-400 mb-2 capitalize">
                                        {platform}
                                    </label>
                                    <input
                                        type="url"
                                        value={settings.socialLinks[platform as keyof typeof settings.socialLinks] || ''}
                                        onChange={(e) =>
                                            setSettings({
                                                ...settings,
                                                socialLinks: { ...settings.socialLinks, [platform]: e.target.value },
                                            })
                                        }
                                        placeholder={`https://${platform}.com/yourprofile`}
                                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:border-cyan focus:outline-none focus:ring-1 focus:ring-cyan"
                                    />
                                </div>
                            ))}
                        </div>
                    </Card>
                )}

                {activeTab === 'seo' && (
                    <Card className="p-6">
                        <h2 className="text-xl font-bold text-white mb-6">SEO Settings</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">Meta Title</label>
                                <input
                                    type="text"
                                    value={settings.metaTitle || ''}
                                    onChange={(e) => setSettings({ ...settings, metaTitle: e.target.value })}
                                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-cyan focus:outline-none focus:ring-1 focus:ring-cyan"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">Meta Description</label>
                                <textarea
                                    rows={3}
                                    value={settings.metaDescription || ''}
                                    onChange={(e) => setSettings({ ...settings, metaDescription: e.target.value })}
                                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-cyan focus:outline-none focus:ring-1 focus:ring-cyan"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">OG Image URL</label>
                                <input
                                    type="url"
                                    value={settings.ogImage || ''}
                                    onChange={(e) => setSettings({ ...settings, ogImage: e.target.value })}
                                    placeholder="https://example.com/og-image.jpg"
                                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:border-cyan focus:outline-none focus:ring-1 focus:ring-cyan"
                                />
                            </div>
                        </div>
                    </Card>
                )}

                {activeTab === 'theme' && (
                    <Card className="p-6">
                        <h2 className="text-xl font-bold text-white mb-6">Theme Customization</h2>
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-2">Primary Color</label>
                                    <div className="flex gap-2">
                                        <input
                                            type="color"
                                            value={settings.primaryColor}
                                            onChange={(e) => setSettings({ ...settings, primaryColor: e.target.value })}
                                            className="w-16 h-10 rounded border border-white/10 bg-white/5 cursor-pointer"
                                        />
                                        <input
                                            type="text"
                                            value={settings.primaryColor}
                                            onChange={(e) => setSettings({ ...settings, primaryColor: e.target.value })}
                                            className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-cyan focus:outline-none focus:ring-1 focus:ring-cyan"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-2">Accent Color</label>
                                    <div className="flex gap-2">
                                        <input
                                            type="color"
                                            value={settings.accentColor}
                                            onChange={(e) => setSettings({ ...settings, accentColor: e.target.value })}
                                            className="w-16 h-10 rounded border border-white/10 bg-white/5 cursor-pointer"
                                        />
                                        <input
                                            type="text"
                                            value={settings.accentColor}
                                            onChange={(e) => setSettings({ ...settings, accentColor: e.target.value })}
                                            className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-cyan focus:outline-none focus:ring-1 focus:ring-cyan"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <div className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/10">
                                    <div>
                                        <p className="text-white font-medium">Dark Mode</p>
                                        <p className="text-sm text-gray-400">Enable dark theme by default</p>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={settings.darkMode}
                                            onChange={(e) => setSettings({ ...settings, darkMode: e.target.checked })}
                                            className="sr-only peer"
                                        />
                                        <div className="w-11 h-6 bg-white/10 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-cyan rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan"></div>
                                    </label>
                                </div>

                                <div className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/10">
                                    <div>
                                        <p className="text-white font-medium">Animations</p>
                                        <p className="text-sm text-gray-400">Enable page animations and transitions</p>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={settings.animations}
                                            onChange={(e) => setSettings({ ...settings, animations: e.target.checked })}
                                            className="sr-only peer"
                                        />
                                        <div className="w-11 h-6 bg-white/10 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-cyan rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan"></div>
                                    </label>
                                </div>
                            </div>
                        </div>
                    </Card>
                )}
            </motion.div>
        </div>
    );
}
