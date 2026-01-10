'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';
import { Section } from '@/components/ui/Section';
import { Card } from '@/components/ui/Card';

interface Testimonial {
    id: string;
    clientName: string;
    // role: string; // Removed as not in Prisma schema
    company: string;
    photo: string; // Changed from image to photo
    rating: number;
    text: string;
    featured: boolean;
    createdAt: Date;
    updatedAt: Date;
}

interface TestimonialsProps {
    testimonials?: Testimonial[];
}

export const Testimonials = ({ testimonials = [] }: TestimonialsProps) => {
    // Fallback if no testimonials provided
    if (!testimonials || testimonials.length === 0) {
        return null;
    }
    return (
        <Section className="relative overflow-hidden">
            {/* Particle background */}
            <div className="absolute inset-0 opacity-20">
                <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-cyan rounded-full animate-pulse" />
                <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-ai-purple rounded-full animate-pulse delay-100" />
                <div className="absolute bottom-1/4 left-1/2 w-1.5 h-1.5 bg-tech-blue rounded-full animate-pulse delay-200" />
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
                        What Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan to-ai-purple">Clients Say</span>
                    </h2>
                    <p className="text-gray-400 max-w-2xl mx-auto text-lg">
                        Trusted by innovative companies worldwide to deliver exceptional digital solutions.
                    </p>
                </motion.div>

                {/* Testimonials Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
                    {testimonials.map((testimonial, index) => (
                        <motion.div
                            key={testimonial.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                        >
                            <Card
                                className="p-8 h-full relative group"
                                hover3D={true}
                            >
                                {/* Quote icon */}
                                <div className="absolute top-6 right-6 text-cyan/20 group-hover:text-cyan/40 transition-colors">
                                    <Quote size={40} />
                                </div>

                                {/* Rating */}
                                <div className="flex gap-1 mb-6">
                                    {[...Array(testimonial.rating)].map((_, i) => (
                                        <Star
                                            key={i}
                                            size={18}
                                            className="fill-cyan text-cyan drop-shadow-[0_0_8px_rgba(0,194,217,0.6)]"
                                        />
                                    ))}
                                </div>

                                {/* Testimonial Text */}
                                <p className="text-gray-300 mb-8 leading-relaxed italic">
                                    "{testimonial.text}"
                                </p>

                                {/* Client Info */}
                                <div className="flex items-center gap-4 mt-auto">
                                    {/* Hologram Photo Frame */}
                                    <div className="relative">
                                        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-cyan/30 to-ai-purple/30 p-0.5 group-hover:from-cyan/50 group-hover:to-ai-purple/50 transition-all">
                                            <div className="w-full h-full rounded-full overflow-hidden bg-navy">
                                                <img
                                                    src={testimonial.photo}
                                                    alt={testimonial.clientName}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                        </div>
                                        {/* Glow effect */}
                                        <div className="absolute inset-0 rounded-full bg-cyan/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </div>

                                    {/* Client Details */}
                                    <div>
                                        <h4 className="text-white font-semibold">{testimonial.clientName}</h4>
                                        <p className="text-sm text-gray-400">
                                            {testimonial.company}
                                        </p>
                                    </div>
                                </div>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </div>
        </Section>
    );
};
