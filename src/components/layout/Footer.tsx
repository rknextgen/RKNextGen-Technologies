import React from 'react';
import Link from 'next/link';
import { Mail, MapPin, Linkedin, Twitter, Github, Facebook, Instagram, Phone } from 'lucide-react';
import { Newsletter } from '@/components/ui/Newsletter';

interface FooterProps {
    settings?: {
        companyName: string;
        tagline: string;
        email: string;
        phone: string;
        socialLinks: any;
    } | null;
}

const Footer = ({ settings }: FooterProps) => {
    const companyName = settings?.companyName || 'RK NextGen Technologies';
    const tagline = settings?.tagline || 'Empowering businesses with next-generation AI, Cloud, and Software solutions.';
    const email = settings?.email || 'info.rknextgen@gmail.com';
    const phone = settings?.phone || '+91 8823857525';
    let socialLinks = settings?.socialLinks || {};
    if (typeof socialLinks === 'string') {
        try {
            socialLinks = JSON.parse(socialLinks);
        } catch (e) {
            socialLinks = {};
        }
    }

    // Helper to split company name for styling
    const [firstWord, ...rest] = companyName.split(' ');
    const restOfName = rest.join(' ');

    return (
        <footer className="relative bg-navy pt-20 pb-10 overflow-hidden">
            {/* Cyber Grid Background */}
            <div className="absolute inset-0 opacity-5 pointer-events-none">
                <div className="absolute inset-0" style={{
                    backgroundImage: `linear-gradient(rgba(0, 194, 217, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 194, 217, 0.1) 1px, transparent 1px)`,
                    backgroundSize: '40px 40px',
                }} />
            </div>

            <div className="container mx-auto px-4 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
                    {/* Company Info */}
                    <div>
                        <h2 className="text-2xl font-bold text-white mb-6">
                            {firstWord} <span className="text-cyan">{restOfName}</span>
                        </h2>
                        <p className="text-gray-400 mb-6 leading-relaxed">
                            {tagline}
                        </p>
                        <div className="flex gap-4">
                            {socialLinks.linkedin && <a href={socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-cyan transition-colors"><Linkedin size={20} /></a>}
                            {socialLinks.twitter && <a href={socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-cyan transition-colors"><Twitter size={20} /></a>}
                            {socialLinks.facebook && <a href={socialLinks.facebook} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-cyan transition-colors"><Facebook size={20} /></a>}
                            {socialLinks.instagram && <a href={socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-cyan transition-colors"><Instagram size={20} /></a>}
                            {socialLinks.github && <a href={socialLinks.github} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-cyan transition-colors"><Github size={20} /></a>}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-lg font-semibold text-white mb-6">Quick Links</h3>
                        <ul className="space-y-4">
                            <li><Link href="/about" className="text-gray-400 hover:text-cyan transition-colors">About Us</Link></li>
                            <li><Link href="/services" className="text-gray-400 hover:text-cyan transition-colors">Services</Link></li>
                            <li><Link href="/projects" className="text-gray-400 hover:text-cyan transition-colors">Projects</Link></li>
                            <li><Link href="/blog" className="text-gray-400 hover:text-cyan transition-colors">Blog</Link></li>
                            <li><Link href="/contact" className="text-gray-400 hover:text-cyan transition-colors">Contact</Link></li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h3 className="text-lg font-semibold text-white mb-6">Contact Us</h3>
                        <ul className="space-y-4">
                            <li className="flex items-start gap-3 text-gray-400">
                                <MapPin className="w-5 h-5 text-cyan shrink-0 mt-1" />
                                <span>Remote</span>
                            </li>
                            <li className="flex items-center gap-3 text-gray-400">
                                <Phone className="w-5 h-5 text-cyan shrink-0" />
                                <span>{phone}</span>
                            </li>
                            <li className="flex items-center gap-3 text-gray-400">
                                <Mail className="w-5 h-5 text-cyan shrink-0" />
                                <span>{email}</span>
                            </li>
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div>
                        <h3 className="text-lg font-semibold text-white mb-6">Stay Updated</h3>
                        <p className="text-gray-400 mb-4">Get the latest AI trends and tech insights delivered to your inbox.</p>
                        <Newsletter />
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-gray-500 text-sm">
                        © {new Date().getFullYear()} RK NextGen Technologies. All rights reserved.
                    </p>
                    <div className="flex gap-6 text-sm text-gray-500">
                        <Link href="/privacy-policy" className="hover:text-cyan transition-colors">Privacy Policy</Link>
                        <Link href="/terms-of-service" className="hover:text-cyan transition-colors">Terms of Service</Link>
                        <Link href="/disclaimer" className="hover:text-cyan transition-colors">Disclaimer</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
