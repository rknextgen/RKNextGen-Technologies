'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Linkedin, Github, Mail, X, Briefcase, Award } from 'lucide-react';
import { Section } from '@/components/ui/Section';
import { Card } from '@/components/ui/Card';

interface TeamMember {
    id: string;
    name: string;
    role: string;
    bio: string;
    photo: string | null;
    linkedIn?: string | null;
    github?: string | null;
}

interface TeamProps {
    teamMembers: TeamMember[];
}

export const Team = ({ teamMembers }: TeamProps) => {
    const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);

    if (teamMembers.length === 0) return null;

    return (
        <Section className="relative overflow-hidden">
            {/* Cyber grid background */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute inset-0" style={{
                    backgroundImage: `
            linear-gradient(rgba(0, 194, 217, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 194, 217, 0.1) 1px, transparent 1px)
          `,
                    backgroundSize: '50px 50px',
                }} />
            </div>

            <div className="relative z-10">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
                        Meet Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan to-ai-purple">Team</span>
                    </h2>
                    <p className="text-gray-400 max-w-2xl mx-auto text-lg">
                        Passionate experts dedicated to building next-generation digital solutions.
                    </p>
                </motion.div>

                {/* Team Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
                    {teamMembers.map((member, index) => (
                        <motion.div
                            key={member.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                        >
                            <Card
                                className="p-8 text-center group relative overflow-hidden h-full cursor-pointer"
                                hover3D={true}
                                onClick={() => setSelectedMember(member)}
                            >
                                {/* Hologram Photo Frame */}
                                <div className="relative mx-auto mb-6 w-32 h-32">
                                    {/* Outer glow ring */}
                                    <div className="absolute inset-0 rounded-full bg-gradient-to-br from-cyan/40 to-ai-purple/40 blur-md group-hover:blur-lg transition-all" />

                                    {/* Border ring */}
                                    <div className="relative w-full h-full rounded-full bg-gradient-to-br from-cyan/30 to-ai-purple/30 p-1 group-hover:from-cyan/50 group-hover:to-ai-purple/50 transition-all">
                                        <div className="w-full h-full rounded-full overflow-hidden bg-navy border-2 border-white/10">
                                            <motion.img
                                                src={member.photo || '/logo.png'}
                                                alt={member.name}
                                                className="w-full h-full object-cover"
                                                whileHover={{ scale: 1.1 }}
                                                transition={{ duration: 0.3 }}
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Member Info */}
                                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-cyan transition-colors">
                                    {member.name}
                                </h3>
                                <p className="text-cyan font-medium mb-4">{member.role}</p>

                                {/* Click to view more */}
                                <p className="text-xs text-gray-500 group-hover:text-cyan transition-colors">
                                    Click to view details →
                                </p>

                                {/* Decorative corner accent */}
                                <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-cyan/10 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity" />
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Team Member Detail Modal */}
            <AnimatePresence>
                {selectedMember && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setSelectedMember(null)}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            transition={{ type: "spring", duration: 0.5 }}
                            onClick={(e) => e.stopPropagation()}
                            className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-navy/95 backdrop-blur-xl border-2 border-cyan/30 rounded-2xl shadow-[0_0_50px_rgba(0,194,217,0.3)]"
                        >
                            {/* Close Button */}
                            <button
                                onClick={() => setSelectedMember(null)}
                                className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/5 border border-white/10 text-gray-400 hover:text-cyan hover:border-cyan/50 hover:bg-white/10 transition-all"
                            >
                                <X size={24} />
                            </button>

                            {/* Modal Content */}
                            <div className="p-8">
                                {/* Header with Photo */}
                                <div className="flex flex-col md:flex-row items-center gap-6 mb-8">
                                    {/* Photo */}
                                    <div className="relative w-32 h-32 flex-shrink-0">
                                        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-cyan/40 to-ai-purple/40 blur-lg" />
                                        <div className="relative w-full h-full rounded-full bg-gradient-to-br from-cyan/30 to-ai-purple/30 p-1">
                                            <div className="w-full h-full rounded-full overflow-hidden bg-navy border-2 border-white/10">
                                                <img
                                                    src={selectedMember.photo || '/logo.png'}
                                                    alt={selectedMember.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Name & Role */}
                                    <div className="text-center md:text-left flex-1">
                                        <h2 className="text-3xl font-bold text-white mb-2">
                                            {selectedMember.name}
                                        </h2>
                                        <p className="text-cyan text-lg font-medium mb-4">
                                            {selectedMember.role}
                                        </p>

                                        {/* Social Links */}
                                        <div className="flex gap-3 justify-center md:justify-start">
                                            {selectedMember.linkedIn && (
                                                <a
                                                    href={selectedMember.linkedIn}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="p-2 rounded-full bg-white/5 border border-white/10 text-gray-400 hover:text-cyan hover:border-cyan/50 hover:shadow-[0_0_15px_rgba(0,194,217,0.4)] transition-all"
                                                >
                                                    <Linkedin size={20} />
                                                </a>
                                            )}
                                            {selectedMember.github && (
                                                <a
                                                    href={selectedMember.github}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="p-2 rounded-full bg-white/5 border border-white/10 text-gray-400 hover:text-ai-purple hover:border-ai-purple/50 hover:shadow-[0_0_15px_rgba(138,43,226,0.4)] transition-all"
                                                >
                                                    <Github size={20} />
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Bio Section */}
                                <div className="mb-6">
                                    <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                                        <Award className="text-cyan" size={20} />
                                        About
                                    </h3>
                                    <p className="text-gray-300 leading-relaxed">
                                        {selectedMember.bio}
                                    </p>
                                </div>

                                {/* Decorative Glow */}
                                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-cyan to-transparent opacity-50" />
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </Section>
    );
};
