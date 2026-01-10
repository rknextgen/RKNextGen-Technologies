'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle } from 'lucide-react';
import { Section } from '@/components/ui/Section';

const features = [
    'AI-driven engineering',
    'Scalable & secure architecture',
    'Clean, high-quality code',
    'Transparent communication',
];

export const FeaturesSection = () => {
    return (
        <Section>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                <div>
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                        Why Choose <span className="text-cyan">RK NextGen</span>?
                    </h2>
                    <p className="text-gray-400 mb-8 text-lg">
                        We don't just build software; we engineer digital transformation. Our commitment to quality and innovation sets us apart.
                    </p>

                    <div className="space-y-6">
                        {features.map((feature, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="flex items-center gap-4"
                            >
                                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-cyan/10 flex items-center justify-center text-cyan">
                                    <CheckCircle size={20} />
                                </div>
                                <span className="text-white text-lg">{feature}</span>
                            </motion.div>
                        ))}
                    </div>
                </div>

                <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan/20 to-ai-purple/20 blur-3xl rounded-full" />
                    <div className="relative glass-panel rounded-2xl p-8 border border-white/10">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 bg-navy/50 rounded-lg text-center">
                                <h4 className="text-3xl font-bold text-cyan mb-1">50+</h4>
                                <p className="text-gray-400 text-sm">Projects Delivered</p>
                            </div>
                            <div className="p-4 bg-navy/50 rounded-lg text-center">
                                <h4 className="text-3xl font-bold text-tech-blue mb-1">98%</h4>
                                <p className="text-gray-400 text-sm">Client Satisfaction</p>
                            </div>
                            <div className="p-4 bg-navy/50 rounded-lg text-center">
                                <h4 className="text-3xl font-bold text-ai-purple mb-1">24/7</h4>
                                <p className="text-gray-400 text-sm">Support & Maint.</p>
                            </div>
                            <div className="p-4 bg-navy/50 rounded-lg text-center">
                                <h4 className="text-3xl font-bold text-white mb-1">100%</h4>
                                <p className="text-gray-400 text-sm">On-Time Delivery</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Section>
    );
};
