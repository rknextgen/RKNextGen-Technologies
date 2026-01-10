'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import NextImage from 'next/image';

const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
    { name: 'Services', href: '/services' },
    { name: 'Projects', href: '/projects' },
    { name: 'Blog', href: '/blog' },
    { name: 'Careers', href: '/careers' },
    { name: 'Contact', href: '/contact' },
];

interface NavbarProps {
    settings?: {
        companyName: string;
        // Add other settings if needed
    } | null;
}

export const Navbar = ({ settings }: NavbarProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const companyName = settings?.companyName || 'RK NextGen';
    const [firstWord, ...rest] = companyName.split(' ');
    const restOfName = rest.join(' ');

    return (
        <nav
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'glass-panel py-2' : 'bg-transparent py-4'
                }`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link href="/" className="flex-shrink-0 flex items-center gap-2">
                        {/* Assuming logo.png is in public folder */}
                        <NextImage src="/logo.png" alt={companyName} width={40} height={40} className="h-10 w-auto" />
                        <span className="font-bold text-xl tracking-wider text-white hidden sm:block">
                            {firstWord} <span className="text-cyan">{restOfName}</span>
                        </span>
                    </Link>

                    {/* Desktop Links */}
                    <div className="hidden md:block">
                        <div className="ml-10 flex items-baseline space-x-8">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    className="relative group"
                                >
                                    <motion.span
                                        className={`px-3 py-2 text-sm font-medium transition-all duration-300 inline-block ${pathname === link.href
                                            ? 'text-cyan'
                                            : 'text-gray-300 group-hover:text-tech-blue'
                                            }`}
                                        whileHover={{ y: -2 }}
                                        transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                                    >
                                        {link.name}
                                    </motion.span>

                                    {/* Animated underline */}
                                    {pathname === link.href ? (
                                        <motion.div
                                            layoutId="underline"
                                            className="absolute left-0 right-0 bottom-0 h-0.5 bg-cyan shadow-[0_0_10px_#00C2D9]"
                                        />
                                    ) : (
                                        <motion.div
                                            className="absolute left-0 bottom-0 h-0.5 bg-cyan shadow-[0_0_10px_#00C2D9]"
                                            initial={{ width: 0 }}
                                            whileHover={{ width: '100%' }}
                                            transition={{ duration: 0.3 }}
                                        />
                                    )}
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* CTA Button */}
                    <div className="hidden md:block">
                        <Link href="/contact">
                            <Button size="sm" glow>Start Project</Button>
                        </Link>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="-mr-2 flex md:hidden">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-white/10 focus:outline-none"
                        >
                            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden glass-panel border-t border-white/10"
                    >
                        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    onClick={() => setIsOpen(false)}
                                    className={`block px-3 py-2 rounded-md text-base font-medium ${pathname === link.href
                                        ? 'text-cyan bg-white/5'
                                        : 'text-gray-300 hover:text-white hover:bg-white/5'
                                        }`}
                                >
                                    {link.name}
                                </Link>
                            ))}
                            <div className="pt-4">
                                <Link href="/contact" onClick={() => setIsOpen(false)}>
                                    <Button className="w-full" glow>Start Project</Button>
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Navbar;
