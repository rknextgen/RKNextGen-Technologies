'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell,
} from 'recharts';
import { TrendingUp, Users, Eye, MousePointer } from 'lucide-react';
import { Card } from '@/components/ui/Card';

const COLORS = ['#00C2D9', '#8A2BE2', '#FF6B6B', '#FFD93D'];

export default function AnalyticsPage() {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const res = await fetch('/api/analytics?days=30');
                const json = await res.json();
                setData(json);
            } catch (error) {
                console.error('Error fetching analytics:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchAnalytics();
    }, []);

    if (loading) {
        return <div className="text-white">Loading analytics...</div>;
    }

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-white mb-2">
                    Website <span className="text-cyan">Analytics</span>
                </h1>
                <p className="text-gray-400">Traffic overview and user engagement metrics</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="p-6 border-l-4 border-cyan-500">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-gray-400 text-sm">Total Views</p>
                            <h3 className="text-3xl font-bold text-white mt-1">{data?.totalViews || 0}</h3>
                        </div>
                        <div className="p-3 bg-cyan-500/10 rounded-lg">
                            <Eye className="text-cyan-500" size={24} />
                        </div>
                    </div>
                </Card>
                <Card className="p-6 border-l-4 border-purple-500">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-gray-400 text-sm">Unique Visitors</p>
                            <h3 className="text-3xl font-bold text-white mt-1">--</h3>
                        </div>
                        <div className="p-3 bg-purple-500/10 rounded-lg">
                            <Users className="text-purple-500" size={24} />
                        </div>
                    </div>
                </Card>
                <Card className="p-6 border-l-4 border-green-500">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-gray-400 text-sm">Bounce Rate</p>
                            <h3 className="text-3xl font-bold text-white mt-1">--%</h3>
                        </div>
                        <div className="p-3 bg-green-500/10 rounded-lg">
                            <TrendingUp className="text-green-500" size={24} />
                        </div>
                    </div>
                </Card>
                <Card className="p-6 border-l-4 border-yellow-500">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-gray-400 text-sm">Avg. Session</p>
                            <h3 className="text-3xl font-bold text-white mt-1">--m</h3>
                        </div>
                        <div className="p-3 bg-yellow-500/10 rounded-lg">
                            <MousePointer className="text-yellow-500" size={24} />
                        </div>
                    </div>
                </Card>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="p-6">
                    <h3 className="text-xl font-bold text-white mb-6">Traffic Overview</h3>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={data?.chartData || []}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                                <XAxis dataKey="date" stroke="#666" />
                                <YAxis stroke="#666" />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333' }}
                                    itemStyle={{ color: '#fff' }}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="visitors"
                                    stroke="#00C2D9"
                                    strokeWidth={3}
                                    dot={{ fill: '#00C2D9' }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                <Card className="p-6">
                    <h3 className="text-xl font-bold text-white mb-6">Top Pages</h3>
                    <div className="space-y-4">
                        {data?.topPages?.map((page: any, index: number) => (
                            <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                                <span className="text-gray-300 truncate flex-1 mr-4">{page.page}</span>
                                <span className="text-cyan font-bold">{page.count} views</span>
                            </div>
                        ))}
                    </div>
                </Card>
            </div>
        </div>
    );
}
