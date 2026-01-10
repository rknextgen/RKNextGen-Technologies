import React from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';
import { Section } from '@/components/ui/Section';
import { Card } from '@/components/ui/Card';
import { ContactForm } from '@/components/contact/ContactForm';
import { getSettings } from '@/lib/actions';
import { SceneWrapper } from '@/components/3d/SceneWrapper';

export const metadata = {
    title: 'Contact Us | RK NextGen Technologies',
    description: 'Ready to start your next project? We\'d love to hear from you.',
};

export default async function ContactPage() {
    const settings = await getSettings();

    return (
        <div className="pt-20 min-h-screen flex flex-col">
            <Section className="text-center">
                <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
                    Get in <span className="text-cyan">Touch</span>
                </h1>
                <p className="text-xl text-gray-400 max-w-3xl mx-auto mb-12">
                    Ready to start your next project? We'd love to hear from you.
                </p>
            </Section>

            <Section className="flex-grow">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Contact Info & 3D Element */}
                    <div className="space-y-8">
                        <Card className="p-8">
                            <h2 className="text-2xl font-bold text-white mb-6">Contact Information</h2>
                            <div className="space-y-6">
                                <div className="flex items-start gap-4">
                                    <div className="p-3 rounded-full bg-cyan/10 text-cyan">
                                        <Mail size={24} />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-white">Email Us</h3>
                                        <p className="text-gray-400">{settings?.email || 'info.rknextgen@gmail.com'}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="p-3 rounded-full bg-tech-blue/10 text-tech-blue">
                                        <Phone size={24} />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-white">Call Us</h3>
                                        <p className="text-gray-400">{settings?.phone || '+91 8823857525'}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="p-3 rounded-full bg-ai-purple/10 text-ai-purple">
                                        <MapPin size={24} />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-white">Visit Us</h3>
                                        <p className="text-gray-400">Remote</p>
                                        <p className="text-gray-500 text-sm">Global / Remote First</p>
                                    </div>
                                </div>
                            </div>
                        </Card>

                        {/* Mini 3D Scene */}
                        <div className="h-64 w-full rounded-2xl overflow-hidden relative border border-white/10 glass-panel">
                            <SceneWrapper />
                        </div>
                    </div>

                    {/* Contact Form */}
                    <ContactForm />
                </div>
            </Section>
        </div>
    );
}
