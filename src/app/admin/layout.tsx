'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
    LayoutDashboard,
    FileText,
    Briefcase,
    Star,
    MessageSquare,
    Users,
    BriefcaseIcon,
    Mail,
    Image,
    Settings,
    BarChart3,
    LogOut,
    Menu,
    X,
    FileCode,
} from 'lucide-react';

const menuItems = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Blogs', href: '/admin/blogs', icon: FileText },
    { name: 'Projects', href: '/admin/projects', icon: Briefcase },
    { name: 'Case Studies', href: '/admin/case-studies', icon: Star },
    { name: 'Testimonials', href: '/admin/testimonials', icon: MessageSquare },
    { name: 'Team', href: '/admin/team', icon: Users },
    { name: 'Careers', href: '/admin/careers', icon: BriefcaseIcon },
    { name: 'Leads', href: '/admin/leads', icon: Mail },
    { name: 'Media', href: '/admin/media', icon: Image },
    { name: 'SEO', href: '/admin/seo', icon: FileCode },
    { name: 'Settings', href: '/admin/settings', icon: Settings },
    { name: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
];

interface AdminLayoutProps {
    children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
    const pathname = usePathname();
    const router = useRouter();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    // Don't apply layout to login page
    if (pathname === '/admin/login') {
        return <>{children}</>;
    }

    const handleLogout = async () => {
        await fetch('/api/auth/logout', { method: 'POST' });
        router.push('/admin/login');
        router.refresh();
    };

    return (
        <div className="min-h-screen bg-navy flex">
            {/* Sidebar */}
            <aside
                className={`fixed inset-y-0 left-0 z-50 w-64 bg-navy/95 backdrop-blur-md border-r border-white/10 transform transition-transform duration-300 lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                    }`}
            >
                <div className="flex flex-col h-full">
                    {/* Logo */}
                    <div className="p-6 border-b border-white/10">
                        <h1 className="text-2xl font-bold text-white">
                            RK <span className="text-cyan">Admin</span>
                        </h1>
                        <p className="text-sm text-gray-400 mt-1">Dashboard</p>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 overflow-y-auto p-4 space-y-1">
                        {menuItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = pathname === item.href;

                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${isActive
                                            ? 'bg-cyan/10 text-cyan border border-cyan/30'
                                            : 'text-gray-400 hover:bg-white/5 hover:text-white'
                                        }`}
                                    onClick={() => setSidebarOpen(false)}
                                >
                                    <Icon size={20} />
                                    <span className="font-medium">{item.name}</span>
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Logout */}
                    <div className="p-4 border-t border-white/10">
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-400 hover:bg-red-500/10 hover:text-red-400 transition-all w-full"
                        >
                            <LogOut size={20} />
                            <span className="font-medium">Logout</span>
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 lg:ml-64">
                {/* Mobile Header */}
                <header className="lg:hidden sticky top-0 z-40 bg-navy/95 backdrop-blur-md border-b border-white/10 p-4">
                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="p-2 rounded-lg bg-white/5 text-white hover:bg-white/10 transition-colors"
                    >
                        {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </header>

                {/* Page Content */}
                <main className="p-6 lg:p-8">{children}</main>
            </div>

            {/* Mobile Overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}
        </div>
    );
}
