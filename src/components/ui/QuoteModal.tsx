'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, CheckCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface QuoteModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const QuoteModal: React.FC<QuoteModalProps> = ({ isOpen, onClose }) => {
    const [formState, setFormState] = useState({
        name: '',
        email: '',
        projectType: 'AI',
        budget: '',
        message: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));

        setIsSubmitting(false);
        setIsSuccess(true);

        // Reset after showing success
        setTimeout(() => {
            setIsSuccess(false);
            onClose();
            setFormState({
                name: '',
                email: '',
                projectType: 'AI',
                budget: '',
                message: '',
            });
        }, 2000);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormState(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="relative w-full max-w-lg bg-navy border border-cyan/30 rounded-2xl p-6 md:p-8 shadow-[0_0_50px_rgba(0,194,217,0.2)] overflow-hidden"
                    >
                        {/* Glass effect background */}
                        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />

                        {/* Close button */}
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-full transition-colors z-10"
                        >
                            <X size={20} />
                        </button>

                        {isSuccess ? (
                            <div className="flex flex-col items-center justify-center py-12 text-center">
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="w-20 h-20 rounded-full bg-cyan/20 flex items-center justify-center mb-6"
                                >
                                    <CheckCircle className="w-10 h-10 text-cyan" />
                                </motion.div>
                                <h3 className="text-2xl font-bold text-white mb-2">Request Received!</h3>
                                <p className="text-gray-400">We'll get back to you within 24 hours.</p>
                            </div>
                        ) : (
                            <>
                                <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
                                    Start a <span className="text-cyan">Project</span>
                                </h2>
                                <p className="text-gray-400 mb-6">Tell us about your vision and we'll help you build it.</p>

                                <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <label className="text-sm text-gray-400 ml-1">Name</label>
                                            <input
                                                required
                                                type="text"
                                                name="name"
                                                value={formState.name}
                                                onChange={handleChange}
                                                className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-cyan focus:outline-none focus:shadow-[0_0_15px_rgba(0,194,217,0.3)] transition-all"
                                                placeholder="John Doe"
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-sm text-gray-400 ml-1">Email</label>
                                            <input
                                                required
                                                type="email"
                                                name="email"
                                                value={formState.email}
                                                onChange={handleChange}
                                                className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-cyan focus:outline-none focus:shadow-[0_0_15px_rgba(0,194,217,0.3)] transition-all"
                                                placeholder="john@company.com"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <label className="text-sm text-gray-400 ml-1">Project Type</label>
                                            <select
                                                name="projectType"
                                                value={formState.projectType}
                                                onChange={handleChange}
                                                className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-cyan focus:outline-none focus:shadow-[0_0_15px_rgba(0,194,217,0.3)] transition-all appearance-none"
                                            >
                                                <option value="AI">AI & Machine Learning</option>
                                                <option value="Software">Custom Software</option>
                                                <option value="Web">Web Development</option>
                                                <option value="Cloud">Cloud & DevOps</option>
                                                <option value="Other">Other</option>
                                            </select>
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-sm text-gray-400 ml-1">Budget Range</label>
                                            <select
                                                name="budget"
                                                value={formState.budget}
                                                onChange={handleChange}
                                                className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-cyan focus:outline-none focus:shadow-[0_0_15px_rgba(0,194,217,0.3)] transition-all appearance-none"
                                            >
                                                <option value="" disabled>Select Budget</option>
                                                <option value="<5k">$1k - $5k</option>
                                                <option value="5k-10k">$5k - $10k</option>
                                                <option value="10k-50k">$10k - $50k</option>
                                                <option value="50k+">$50k+</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="space-y-1">
                                        <label className="text-sm text-gray-400 ml-1">Message</label>
                                        <textarea
                                            required
                                            name="message"
                                            value={formState.message}
                                            onChange={handleChange}
                                            rows={4}
                                            className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-cyan focus:outline-none focus:shadow-[0_0_15px_rgba(0,194,217,0.3)] transition-all resize-none"
                                            placeholder="Tell us about your project requirements..."
                                        />
                                    </div>

                                    <Button
                                        type="submit"
                                        glow
                                        className="w-full mt-4"
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? (
                                            <span className="flex items-center gap-2">
                                                <Loader2 className="w-4 h-4 animate-spin" /> Sending...
                                            </span>
                                        ) : (
                                            <span className="flex items-center gap-2">
                                                Send Request <Send size={16} />
                                            </span>
                                        )}
                                    </Button>
                                </form>
                            </>
                        )}
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};
