'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
    FileText,
    Briefcase,
    Star,
    MessageSquare,
    Users,
    Mail,
    TrendingUp,
    ArrowUp,
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from 'recharts';
import Link from 'next/link';

export default function AdminDashboard() {
    const [stats, setStats] = useState<any>(null);
    const [recentActivity, setRecentActivity] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await fetch('/api/dashboard/stats');
                const data = await res.json();
                setStats(data.stats);
                setRecentActivity(data.recentActivity);
            } catch (error) {
                console.error('Error fetching dashboard stats:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    const statCards = [
        {
            name: 'Total Blogs',
            value: stats?.blogs || 0,
            icon: FileText,
            color: 'cyan',
            link: '/admin/blogs',
        },
        {
            name: 'Projects',
            value: stats?.projects || 0,
            icon: Briefcase,
            color: 'tech-blue',
            link: '/admin/projects',
        },
        {
            name: 'Case Studies',
            value: stats?.caseStudies || 0,
            icon: Star,
            color: 'ai-purple',
            link: '/admin/case-studies',
        },
        {
            name: 'Total Leads',
            value: stats?.leads || 0,
            icon: Mail,
            color: 'cyan',
            link: '/admin/leads',
        },
    ];

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-white mb-2">
                    Dashboard <span className="text-cyan">Overview</span>
                </h1>
                <p className="text-gray-400">Welcome back! Here's what's happening.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                        <motion.div
                            key={stat.name}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <Link href={stat.link}>
                                <Card className="p-6 border-l-4 hover:bg-white/5 transition-colors cursor-pointer" style={{ borderLeftColor: `var(--${stat.color})` }}>
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <p className="text-gray-400 text-sm mb-1">{stat.name}</p>
                                            <p className="text-3xl font-bold text-white">{loading ? '-' : stat.value}</p>
                                        </div>
                                        <div className={`p-3 rounded-lg bg-${stat.color}/10`}>
                                            <Icon size={24} className={`text-${stat.color}`} />
                                        </div>
                                    </div>
                                </Card>
                            </Link>
                        </motion.div>
                    );
                })}
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="p-6">
                    <h2 className="text-xl font-bold text-white mb-4">Recent Activity</h2>
                    <div className="space-y-4">
                        {loading ? (
                            <div className="text-gray-500">Loading activity...</div>
                        ) : recentActivity.length > 0 ? (
                            recentActivity.map((activity, index) => (
                                <div
                                    key={index}
                                    className="flex items-start gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                                >
                                    <div className="w-2 h-2 rounded-full bg-cyan mt-2" />
                                    <div className="flex-1">
                                        <p className="text-white text-sm">{activity.title}</p>
                                        <p className="text-gray-500 text-xs mt-1">
                                            {new Date(activity.time).toLocaleDateString()} {new Date(activity.time).toLocaleTimeString()}
                                        </p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-gray-500">No recent activity</div>
                        )}
                    </div>
                </Card>

                <Card className="p-6">
                    <h2 className="text-xl font-bold text-white mb-4">Quick Actions</h2>
                    <div className="space-y-3">
                        <Link href="/admin/blogs/new" className="block w-full p-3 rounded-lg bg-cyan/10 border border-cyan/30 text-cyan hover:bg-cyan/20 transition-colors text-left">
                            <FileText className="inline mr-2" size={18} />
                            Create New Blog Post
                        </Link>
                        <Link href="/admin/projects/new" className="block w-full p-3 rounded-lg bg-tech-blue/10 border border-tech-blue/30 text-tech-blue hover:bg-tech-blue/20 transition-colors text-left">
                            <Briefcase className="inline mr-2" size={18} />
                            Add New Project
                        </Link>
                        <Link href="/admin/case-studies/new" className="block w-full p-3 rounded-lg bg-ai-purple/10 border border-ai-purple/30 text-ai-purple hover:bg-ai-purple/20 transition-colors text-left">
                            <Star className="inline mr-2" size={18} />
                            Add Case Study
                        </Link>
                        <Link href="/admin/team" className="block w-full p-3 rounded-lg bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10 transition-colors text-left">
                            <Users className="inline mr-2" size={18} />
                            Manage Team Members
                        </Link>
                    </div>
                </Card>
            </div>

            {/* Analytics Preview */}
            <Card className="p-6">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-white">Analytics Overview</h2>
                    <Link href="/admin/analytics" className="text-cyan hover:underline text-sm">
                        View Full Analytics
                    </Link>
                </div>
                <div className="h-64 flex items-center justify-center bg-white/5 rounded-lg border border-white/10">
                    <div className="text-center text-gray-400">
                        <TrendingUp size={48} className="mx-auto mb-2 opacity-50" />
                        <p>View detailed analytics in the Analytics tab</p>
                    </div>
                </div>
            </Card>
        </div>
    );
}
