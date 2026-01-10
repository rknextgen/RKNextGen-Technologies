'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit, Trash2, Star, X, Save, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

interface Testimonial {
    id: string;
    clientName: string;
    company: string;
    photo: string;
    rating: number;
    text: string;
    featured: boolean;
}

export default function TestimonialsPage() {
    const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editing, setEditing] = useState<Testimonial | null>(null);

    useEffect(() => {
        fetchTestimonials();
    }, []);

    const fetchTestimonials = async () => {
        try {
            const response = await fetch('/api/testimonials');
            const data = await response.json();
            setTestimonials(data.testimonials || []);
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Delete this testimonial?')) return;
        try {
            await fetch(`/api/testimonials/${id}`, { method: 'DELETE' });
            setTestimonials(testimonials.filter((t) => t.id !== id));
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const toggleFeatured = async (testimonial: Testimonial) => {
        try {
            await fetch(`/api/testimonials/${testimonial.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ featured: !testimonial.featured }),
            });
            fetchTestimonials();
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">
                        Client <span className="text-cyan">Testimonials</span>
                    </h1>
                    <p className="text-gray-400">Manage client reviews and feedback</p>
                </div>
                <Button glow onClick={() => setShowModal(true)}>
                    <Plus size={20} className="mr-2" />
                    Add Testimonial
                </Button>
            </div>

            {loading ? (
                <div className="text-center text-gray-400 py-12">Loading...</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {testimonials.map((testimonial) => (
                        <motion.div key={testimonial.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                            <Card className="p-6 relative">
                                {testimonial.featured && (
                                    <div className="absolute top-4 right-4">
                                        <Star size={20} className="text-yellow-400 fill-yellow-400" />
                                    </div>
                                )}
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-12 h-12 rounded-full bg-cyan/20 flex items-center justify-center text-cyan font-bold">
                                        {testimonial.clientName[0]}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-white">{testimonial.clientName}</h3>
                                        <p className="text-sm text-gray-400">{testimonial.company}</p>
                                    </div>
                                </div>
                                <div className="flex gap-1 mb-3">
                                    {[...Array(5)].map((_, i) => (
                                        <Star
                                            key={i}
                                            size={16}
                                            className={i < testimonial.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-600'}
                                        />
                                    ))}
                                </div>
                                <p className="text-gray-300 text-sm mb-4 line-clamp-3">{testimonial.text}</p>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => toggleFeatured(testimonial)}
                                        className={`p-2 rounded-lg transition-colors ${testimonial.featured ? 'bg-yellow-500/10 text-yellow-400' : 'bg-white/5 text-gray-400 hover:bg-white/10'
                                            }`}
                                    >
                                        <Star size={16} />
                                    </button>
                                    <button
                                        onClick={() => setEditing(testimonial)}
                                        className="p-2 rounded-lg bg-white/5 text-cyan hover:bg-cyan/10"
                                    >
                                        <Edit size={16} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(testimonial.id)}
                                        className="p-2 rounded-lg bg-white/5 text-red-400 hover:bg-red-500/10"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            )}

            <AnimatePresence>
                {(showModal || editing) && (
                    <TestimonialModal
                        testimonial={editing}
                        onClose={() => {
                            setShowModal(false);
                            setEditing(null);
                        }}
                        onSuccess={() => {
                            fetchTestimonials();
                            setShowModal(false);
                            setEditing(null);
                        }}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}

function TestimonialModal({
    testimonial,
    onClose,
    onSuccess,
}: {
    testimonial: Testimonial | null;
    onClose: () => void;
    onSuccess: () => void;
}) {
    const [formData, setFormData] = useState({
        clientName: testimonial?.clientName || '',
        company: testimonial?.company || '',
        photo: testimonial?.photo || '',
        rating: testimonial?.rating || 5,
        text: testimonial?.text || '',
        featured: testimonial?.featured || false,
    });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const url = testimonial ? `/api/testimonials/${testimonial.id}` : '/api/testimonials';
            const method = testimonial ? 'PUT' : 'POST';
            await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            onSuccess();
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="relative w-full max-w-lg bg-navy border border-cyan/30 rounded-2xl p-6">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-white">{testimonial ? 'Edit' : 'Add'} Testimonial</h2>
                    <button onClick={onClose} className="p-2 rounded-full bg-white/5 hover:bg-white/10">
                        <X size={20} />
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Client Name *</label>
                        <input
                            required
                            value={formData.clientName}
                            onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-cyan focus:outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Company *</label>
                        <input
                            required
                            value={formData.company}
                            onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-cyan focus:outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Photo URL *</label>
                        <input
                            required
                            type="url"
                            value={formData.photo}
                            onChange={(e) => setFormData({ ...formData, photo: e.target.value })}
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-cyan focus:outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Rating</label>
                        <select
                            value={formData.rating}
                            onChange={(e) => setFormData({ ...formData, rating: parseInt(e.target.value) })}
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-cyan focus:outline-none"
                        >
                            {[5, 4, 3, 2, 1].map((r) => (
                                <option key={r} value={r} className="bg-navy text-white">
                                    {r} Stars
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Testimonial *</label>
                        <textarea
                            required
                            rows={4}
                            value={formData.text}
                            onChange={(e) => setFormData({ ...formData, text: e.target.value })}
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-cyan focus:outline-none"
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            id="featured"
                            checked={formData.featured}
                            onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                            className="w-4 h-4"
                        />
                        <label htmlFor="featured" className="text-sm text-gray-400">
                            Mark as featured
                        </label>
                    </div>
                    <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
                        <Button variant="outline" onClick={onClose} type="button">
                            Cancel
                        </Button>
                        <Button glow type="submit" disabled={loading}>
                            <Save size={16} className="mr-2" />
                            {loading ? 'Saving...' : 'Save'}
                        </Button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
}
