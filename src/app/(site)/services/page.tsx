'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
    Brain, Code, Globe, Server, Settings, BarChart, PenTool, Smartphone, Search
} from 'lucide-react';
import { Section } from '@/components/ui/Section';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';

const services = [
    {
        title: 'AI & Machine Learning',
        description: 'Custom AI models, predictive analytics, and intelligent automation solutions.',
        icon: <Brain className="w-8 h-8 text-cyan" />,
        features: ['Predictive Analytics', 'NLP & Chatbots', 'Computer Vision'],
    },
    {
        title: 'Software Development',
        description: 'End-to-end software engineering for scalable enterprise applications.',
        icon: <Code className="w-8 h-8 text-tech-blue" />,
        features: ['Custom ERP/CRM', 'SaaS Platforms', 'Legacy Modernization'],
    },
    {
        title: 'Web Development',
        description: 'Modern, responsive, and high-performance web applications.',
        icon: <Globe className="w-8 h-8 text-ai-purple" />,
        features: ['Next.js / React', 'E-commerce', 'Progressive Web Apps'],
    },
    {
        title: 'Mobile App Development',
        description: 'Native and cross-platform mobile apps for iOS and Android.',
        icon: <Smartphone className="w-8 h-8 text-white" />,
        features: ['React Native', 'Flutter', 'iOS / Android'],
    },
    {
        title: 'Cloud & DevOps',
        description: 'Cloud infrastructure setup, migration, and CI/CD automation.',
        icon: <Server className="w-8 h-8 text-cyan" />,
        features: ['AWS / Azure / GCP', 'Docker & Kubernetes', 'Infrastructure as Code'],
    },
    {
        title: 'Automation',
        description: 'Streamline workflows and reduce manual effort with smart automation.',
        icon: <Settings className="w-8 h-8 text-tech-blue" />,
        features: ['Workflow Optimization', 'RPA', 'Business Process Automation'],
    },
    {
        title: 'Data Analytics & BI',
        description: 'Transform raw data into actionable insights with interactive dashboards.',
        icon: <BarChart className="w-8 h-8 text-ai-purple" />,
        features: ['Power BI / Tableau', 'Data Warehousing', 'Real-time Reporting'],
    },
    {
        title: 'UI/UX Design',
        description: 'User-centric design that ensures intuitive and engaging experiences.',
        icon: <PenTool className="w-8 h-8 text-white" />,
        features: ['Wireframing', 'Prototyping', 'User Research'],
    },
    {
        title: 'SEO & Digital Marketing',
        description: 'Boost your online visibility and drive organic traffic with expert SEO strategies.',
        icon: <Search className="w-8 h-8 text-cyan" />,
        features: ['On-Page & Off-Page SEO', 'Keyword Research', 'Technical SEO Audits'],
    },
];

export default function ServicesPage() {
    return (
        <div className="pt-20">
            <Section className="text-center">
                <motion.h1
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-4xl md:text-6xl font-bold text-white mb-6"
                >
                    Our <span className="text-cyan">Services</span>
                </motion.h1>
                <p className="text-xl text-gray-400 max-w-3xl mx-auto mb-12">
                    Comprehensive technology solutions tailored to your business needs.
                </p>
            </Section>

            <Section>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {services.map((service, index) => (
                        <Card key={index} className="group h-full flex flex-col hover:bg-white/5 transition-all duration-300">
                            <div className="mb-6 p-4 rounded-full bg-white/5 w-fit group-hover:bg-white/10 transition-colors">
                                {service.icon}
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-3">{service.title}</h3>
                            <p className="text-gray-400 mb-6 flex-grow">{service.description}</p>

                            <ul className="space-y-2 mb-8">
                                {service.features.map((feature, idx) => (
                                    <li key={idx} className="flex items-center text-sm text-gray-300">
                                        <span className="w-1.5 h-1.5 rounded-full bg-cyan mr-2" />
                                        {feature}
                                    </li>
                                ))}
                            </ul>

                            <Link href="/contact" className="mt-auto">
                                <Button variant="outline" size="sm" className="w-full group-hover:bg-cyan group-hover:text-navy group-hover:border-cyan transition-all">
                                    Consult Now
                                </Button>
                            </Link>
                        </Card>
                    ))}
                </div>
            </Section>

            <Section className="bg-gradient-to-r from-navy to-cyan/10 mt-12">
                <div className="text-center">
                    <h2 className="text-3xl font-bold text-white mb-6">Need a Custom Solution?</h2>
                    <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
                        We understand that every business is unique. Let's discuss your specific requirements and build a tailored solution.
                    </p>
                    <div className="flex justify-center">
                        <Link href="/contact">
                            <Button size="lg" glow>Get in Touch</Button>
                        </Link>
                    </div>
                </div>
            </Section>
        </div>
    );
}
