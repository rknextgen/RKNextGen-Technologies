import React from 'react';
import { Target, Lightbulb, Users, Award, Zap, Shield } from 'lucide-react';
import { Section } from '@/components/ui/Section';
import { Card } from '@/components/ui/Card';
import { Team } from '@/components/sections/Team';
import { TechBadges } from '@/components/sections/TechBadges';
import { getTeamMembers } from '@/lib/actions';

export const metadata = {
    title: 'About Us | RK NextGen Technologies',
    description: 'We are architects of the digital future, dedicated to empowering businesses with intelligent technology.',
};

const values = [
    {
        title: 'Innovation',
        description: 'We constantly push boundaries to deliver cutting-edge solutions.',
        icon: <Lightbulb className="w-6 h-6 text-cyan" />,
    },
    {
        title: 'Reliability',
        description: 'Building robust systems you can count on, 24/7.',
        icon: <Shield className="w-6 h-6 text-tech-blue" />,
    },
    {
        title: 'Integrity',
        description: 'Honest, transparent communication and ethical practices.',
        icon: <Users className="w-6 h-6 text-ai-purple" />,
    },
    {
        title: 'Continuous Learning',
        description: 'Staying ahead of the curve in a rapidly evolving tech landscape.',
        icon: <Zap className="w-6 h-6 text-white" />,
    },
];

const timeline = [
    { year: '2020', title: 'Inception', description: 'RK NextGen Technologies was founded with a vision to innovate.' },
    { year: '2021', title: 'First Major Project', description: 'Delivered a complex AI analytics platform for a fintech client.' },
    { year: '2022', title: 'Expansion', description: 'Grew the team to 20+ engineers and expanded service offerings.' },
    { year: '2023', title: 'Global Reach', description: 'Started serving clients across 3 continents.' },
    { year: 'Future', title: 'The Road Ahead', description: 'Aiming to be a global leader in AI-driven transformation.' },
];

export default async function AboutPage() {
    const teamMembers = await getTeamMembers();

    return (
        <div className="pt-20">
            {/* Header */}
            <Section className="text-center">
                <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
                    About <span className="text-cyan">Us</span>
                </h1>
                <p className="text-xl text-gray-400 max-w-3xl mx-auto">
                    We are architects of the digital future, dedicated to empowering businesses with intelligent technology.
                </p>
            </Section>

            {/* Mission & Vision */}
            <Section>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <Card className="p-8 border-l-4 border-l-cyan">
                        <div className="flex items-center gap-4 mb-4">
                            <Target className="w-8 h-8 text-cyan" />
                            <h2 className="text-2xl font-bold text-white">Our Mission</h2>
                        </div>
                        <p className="text-gray-300 leading-relaxed">
                            Empower businesses with intelligent, future-ready digital solutions that improve efficiency, accelerate growth, and enable smarter decision-making.
                        </p>
                    </Card>

                    <Card className="p-8 border-l-4 border-l-ai-purple">
                        <div className="flex items-center gap-4 mb-4">
                            <Award className="w-8 h-8 text-ai-purple" />
                            <h2 className="text-2xl font-bold text-white">Our Vision</h2>
                        </div>
                        <p className="text-gray-300 leading-relaxed">
                            To be a global leader in next-generation AI-driven digital transformation and software innovation.
                        </p>
                    </Card>
                </div>
            </Section>

            {/* Values */}
            <Section className="bg-navy/50">
                <h2 className="text-3xl font-bold text-white text-center mb-12">Core Values</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {values.map((value, index) => (
                        <Card key={index} className="text-center hover:bg-white/5">
                            <div className="mx-auto w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-4">
                                {value.icon}
                            </div>
                            <h3 className="text-lg font-bold text-white mb-2">{value.title}</h3>
                            <p className="text-sm text-gray-400">{value.description}</p>
                        </Card>
                    ))}
                </div>
            </Section>

            {/* Timeline */}
            <Section>
                <h2 className="text-3xl font-bold text-white text-center mb-16">Our Journey</h2>
                <div className="relative max-w-4xl mx-auto">
                    {/* Vertical Line */}
                    <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-gradient-to-b from-cyan via-tech-blue to-ai-purple opacity-30" />

                    <div className="space-y-12">
                        {timeline.map((item, index) => (
                            <div
                                key={index}
                                className={`flex items-center justify-between w-full ${index % 2 === 0 ? 'flex-row-reverse' : ''}`}
                            >
                                <div className="w-5/12" />
                                <div className="z-10 flex items-center justify-center w-8 h-8 rounded-full bg-navy border-2 border-cyan shadow-[0_0_10px_rgba(0,194,217,0.5)]">
                                    <div className="w-2 h-2 rounded-full bg-white" />
                                </div>
                                <div className={`w-5/12 ${index % 2 === 0 ? 'text-right' : 'text-left'}`}>
                                    <div className="glass-card p-6 rounded-xl hover:border-cyan/50 transition-colors">
                                        <span className="text-cyan font-bold text-sm mb-1 block">{item.year}</span>
                                        <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
                                        <p className="text-gray-400 text-sm">{item.description}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </Section>

            {/* Tech Stack Badges */}
            <TechBadges />

            {/* Team Section */}
            <Team teamMembers={teamMembers} />
        </div>
    );
}
