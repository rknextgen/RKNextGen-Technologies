'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Section } from '@/components/ui/Section';

const clients = [
    { name: 'TechCorp', logo: '/images/clients/tech_corp.png' },
    { name: 'InnovateLabs', logo: '/images/clients/data_flow.png' },
    { name: 'DataFlow', logo: '/images/clients/data_flow.png' },
    { name: 'CloudScale', logo: '/images/clients/cloud_scale.png' },
    { name: 'AI Dynamics', logo: '/images/clients/tech_corp.png' },
    { name: 'SecureNet', logo: '/images/clients/cloud_scale.png' },
    { name: 'FinTech Pro', logo: '/images/clients/data_flow.png' },
    { name: 'SmartSys', logo: '/images/clients/tech_corp.png' },
];

export const ClientLogos = () => {
    // Duplicate for seamless loop
    const duplicatedClients = [...clients, ...clients];

    return (
        <Section className="overflow-hidden bg-navy/30">
            <div className="text-center mb-12">
                <motion.h2
                    initial={{ opacity: 0, y: -20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-2xl md:text-3xl font-bold text-white mb-4"
                >
                    Trusted by <span className="text-cyan">Innovative Teams</span> Worldwide
                </motion.h2>
                <p className="text-gray-400">
                    Partnering with industry leaders to deliver exceptional results
                </p>
            </div>

            {/* Logo Slider */}
            <div className="relative">
                {/* Gradient overlays */}
                <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-navy/50 to-transparent z-10" />
                <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-navy/50 to-transparent z-10" />

                <div className="flex overflow-hidden">
                    <motion.div
                        className="flex gap-12 items-center"
                        animate={{
                            x: [0, -1200],
                        }}
                        transition={{
                            x: {
                                repeat: Infinity,
                                repeatType: 'loop',
                                duration: 30,
                                ease: 'linear',
                            },
                        }}
                    >
                        {duplicatedClients.map((client, index) => (
                            <div
                                key={`${client.name}-${index}`}
                                className="flex-shrink-0 group"
                            >
                                <div className="relative w-40 h-20 flex items-center justify-center glass-panel rounded-lg border border-white/5 hover:border-cyan/50 transition-all duration-300 px-6">
                                    <img
                                        src={client.logo}
                                        alt={client.name}
                                        className="max-w-full max-h-full object-contain grayscale group-hover:grayscale-0 transition-all duration-300 opacity-60 group-hover:opacity-100"
                                    />
                                    {/* Neon underline on hover */}
                                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-cyan shadow-[0_0_10px_#00C2D9] group-hover:w-3/4 transition-all duration-300" />
                                </div>
                            </div>
                        ))}
                    </motion.div>
                </div>
            </div>
        </Section>
    );
};
