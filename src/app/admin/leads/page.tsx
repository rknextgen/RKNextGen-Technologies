'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Phone, Building, MessageSquare, Eye, Trash2, X, Save, Filter } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

interface Lead {
    id: string;
    name: string;
    email: string;
    phone?: string;
    company?: string;
    message: string;
    type: 'CONTACT' | 'QUOTE' | 'NEWSLETTER';
    status: string;
    notes?: string;
    isRead: boolean;
    createdAt: string;
}

export default function LeadsPage() {
    const [leads, setLeads] = useState<Lead[]>([]);
    const [loading, setLoading] = useState(true);
    const [typeFilter, setTypeFilter] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

    useEffect(() => {
        fetchLeads();
    }, [typeFilter, statusFilter]);

    const fetchLeads = async () => {
        try {
            setLoading(true);
            const params = new URLSearchParams();
            if (typeFilter) params.append('type', typeFilter);
            if (statusFilter) params.append('status', statusFilter);

            const response = await fetch(`/api/leads?${params}`);
            const data = await response.json();
            setLeads(data.leads || []);
        } catch (error) {
            console.error('Error fetching leads:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this lead?')) return;

        try {
            const response = await fetch(`/api/leads/${id}`, { method: 'DELETE' });
            if (response.ok) {
                setLeads(leads.filter((l) => l.id !== id));
            }
        } catch (error) {
            console.error('Error deleting lead:', error);
        }
    };

    const markAsRead = async (lead: Lead) => {
        try {
            const response = await fetch(`/api/leads/${lead.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ isRead: true, status: lead.status, notes: lead.notes }),
            });

            if (response.ok) {
                fetchLeads();
            }
        } catch (error) {
            console.error('Error marking as read:', error);
        }
    };

    const getTypeColor = (type: string) => {
        switch (type) {
            case 'CONTACT':
                return 'bg-cyan/10 text-cyan border-cyan/30';
            case 'QUOTE':
                return 'bg-ai-purple/10 text-ai-purple border-ai-purple/30';
            case 'NEWSLETTER':
                return 'bg-tech-blue/10 text-tech-blue border-tech-blue/30';
            default:
                return 'bg-white/10 text-gray-400 border-white/30';
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">
                        Leads & <span className="text-cyan">Contacts</span>
                    </h1>
                    <p className="text-gray-400">Manage contact submissions and inquiries</p>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-400">
                        {leads.filter((l) => !l.isRead).length} unread
                    </span>
                </div>
            </div>

            {/* Filters */}
            <Card className="p-4">
                <div className="flex flex-col sm:flex-row gap-4">
                    <select
                        value={typeFilter}
                        onChange={(e) => setTypeFilter(e.target.value)}
                        className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-cyan focus:outline-none focus:ring-1 focus:ring-cyan"
                    >
                        <option value="" className="bg-navy text-white">All Types</option>
                        <option value="CONTACT" className="bg-navy text-white">Contact Form</option>
                        <option value="QUOTE" className="bg-navy text-white">Quote Request</option>
                        <option value="NEWSLETTER" className="bg-navy text-white">Newsletter</option>
                    </select>
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-cyan focus:outline-none focus:ring-1 focus:ring-cyan"
                    >
                        <option value="" className="bg-navy text-white">All Status</option>
                        <option value="NEW" className="bg-navy text-white">New</option>
                        <option value="CONTACTED" className="bg-navy text-white">Contacted</option>
                        <option value="QUALIFIED" className="bg-navy text-white">Qualified</option>
                        <option value="CLOSED" className="bg-navy text-white">Closed</option>
                    </select>
                </div>
            </Card>

            {/* Leads List */}
            {loading ? (
                <div className="text-center text-gray-400 py-12">Loading...</div>
            ) : leads.length === 0 ? (
                <Card className="p-12 text-center">
                    <Mail size={48} className="mx-auto mb-4 text-gray-400 opacity-50" />
                    <p className="text-gray-400">No leads found</p>
                </Card>
            ) : (
                <div className="space-y-4">
                    {leads.map((lead) => (
                        <motion.div key={lead.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                            <Card
                                className={`p-6 cursor-pointer transition-all ${!lead.isRead ? 'border-cyan/50 bg-cyan/5' : 'hover:border-white/20'
                                    }`}
                                onClick={() => setSelectedLead(lead)}
                            >
                                <div className="flex flex-col sm:flex-row justify-between gap-4">
                                    <div className="flex-1">
                                        <div className="flex items-start gap-3 mb-3">
                                            {!lead.isRead && (
                                                <div className="w-2 h-2 rounded-full bg-cyan mt-2 animate-pulse" />
                                            )}
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <h3 className="text-lg font-bold text-white">{lead.name}</h3>
                                                    <span className={`px-2 py-1 text-xs rounded-full border ${getTypeColor(lead.type)}`}>
                                                        {lead.type}
                                                    </span>
                                                </div>
                                                <div className="flex flex-wrap gap-4 text-sm text-gray-400">
                                                    <span className="flex items-center gap-1">
                                                        <Mail size={14} />
                                                        {lead.email}
                                                    </span>
                                                    {lead.phone && (
                                                        <span className="flex items-center gap-1">
                                                            <Phone size={14} />
                                                            {lead.phone}
                                                        </span>
                                                    )}
                                                    {lead.company && (
                                                        <span className="flex items-center gap-1">
                                                            <Building size={14} />
                                                            {lead.company}
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="text-gray-400 text-sm mt-2 line-clamp-2">{lead.message}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex sm:flex-col items-center sm:items-end gap-2">
                                        <span className="text-xs text-gray-500">
                                            {new Date(lead.createdAt).toLocaleDateString()}
                                        </span>
                                        <div className="flex gap-2">
                                            {!lead.isRead && (
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        markAsRead(lead);
                                                    }}
                                                    className="p-2 rounded-lg bg-white/5 text-cyan hover:bg-cyan/10 transition-colors"
                                                    title="Mark as read"
                                                >
                                                    <Eye size={16} />
                                                </button>
                                            )}
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleDelete(lead.id);
                                                }}
                                                className="p-2 rounded-lg bg-white/5 text-red-400 hover:bg-red-500/10 transition-colors"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            )}

            {/* Lead Detail Modal */}
            <AnimatePresence>
                {selectedLead && (
                    <LeadDetailModal
                        lead={selectedLead}
                        onClose={() => setSelectedLead(null)}
                        onUpdate={() => {
                            fetchLeads();
                            setSelectedLead(null);
                        }}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}

function LeadDetailModal({
    lead,
    onClose,
    onUpdate,
}: {
    lead: Lead;
    onClose: () => void;
    onUpdate: () => void;
}) {
    const [status, setStatus] = useState(lead.status);
    const [notes, setNotes] = useState(lead.notes || '');
    const [loading, setLoading] = useState(false);

    const handleSave = async () => {
        setLoading(true);
        try {
            const response = await fetch(`/api/leads/${lead.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status, notes, isRead: true }),
            });

            if (response.ok) {
                onUpdate();
            }
        } catch (error) {
            console.error('Error updating lead:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="relative w-full max-w-2xl bg-navy border border-cyan/30 rounded-2xl shadow-[0_0_50px_rgba(0,194,217,0.2)] max-h-[90vh] overflow-y-auto"
            >
                <div className="p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-white">Lead Details</h2>
                        <button onClick={onClose} className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-white transition-colors">
                            <X size={20} />
                        </button>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <h3 className="text-lg font-bold text-white mb-2">{lead.name}</h3>
                            <div className="space-y-2 text-sm">
                                <p className="text-gray-400">
                                    <Mail className="inline mr-2" size={14} />
                                    {lead.email}
                                </p>
                                {lead.phone && (
                                    <p className="text-gray-400">
                                        <Phone className="inline mr-2" size={14} />
                                        {lead.phone}
                                    </p>
                                )}
                                {lead.company && (
                                    <p className="text-gray-400">
                                        <Building className="inline mr-2" size={14} />
                                        {lead.company}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">Message</label>
                            <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                                <p className="text-white whitespace-pre-wrap">{lead.message}</p>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">Status</label>
                            <select
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-cyan focus:outline-none focus:ring-1 focus:ring-cyan"
                            >
                                <option value="NEW" className="bg-navy text-white">New</option>
                                <option value="CONTACTED" className="bg-navy text-white">Contacted</option>
                                <option value="QUALIFIED" className="bg-navy text-white">Qualified</option>
                                <option value="CLOSED" className="bg-navy text-white">Closed</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">Admin Notes</label>
                            <textarea
                                rows={4}
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                placeholder="Add internal notes..."
                                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:border-cyan focus:outline-none focus:ring-1 focus:ring-cyan"
                            />
                        </div>

                        <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
                            <Button variant="outline" onClick={onClose}>
                                Cancel
                            </Button>
                            <Button glow onClick={handleSave} disabled={loading}>
                                <Save size={16} className="mr-2" />
                                {loading ? 'Saving...' : 'Save Changes'}
                            </Button>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
