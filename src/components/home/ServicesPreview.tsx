'use client';

import React from 'react';
import { Cpu, Globe, Layers, ArrowRight } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import Link from 'next/link';

const services = [
    {
        title: 'AI & Machine Learning',
        description: 'Intelligent algorithms that drive automation and predictive insights.',
        icon: <Cpu className="w-8 h-8 text-cyan" />,
    },
    {
        title: 'Cloud & DevOps',
        description: 'Scalable, secure, and efficient cloud infrastructure solutions.',
        icon: <Globe className="w-8 h-8 text-tech-blue" />,
    },
    {
        title: 'Web Development',
        description: 'High-performance, responsive, and modern web applications.',
        icon: <Layers className="w-8 h-8 text-ai-purple" />,
    },
];

export const ServicesPreview = () => {
    return (
        <>
            <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">What We Do</h2>
                <p className="text-gray-400 max-w-2xl mx-auto">
                    Empowering businesses with cutting-edge technology solutions designed for the future.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {services.map((service, index) => (
                    <Card key={index} className="group hover:bg-white/5">
                        <div className="mb-6 p-4 rounded-full bg-white/5 w-fit group-hover:bg-white/10 transition-colors">
                            {service.icon}
                        </div>
                        <h3 className="text-xl font-bold text-white mb-3">{service.title}</h3>
                        <p className="text-gray-400 mb-6">{service.description}</p>
                        <Link href="/services" className="flex items-center text-cyan hover:text-white transition-colors text-sm font-medium">
                            Learn more <ArrowRight className="ml-2 w-4 h-4" />
                        </Link>
                    </Card>
                ))}
            </div>
        </>
    );
};
