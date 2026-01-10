'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit, Trash2, X, Save, Users, Linkedin, Github, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import MediaSelectorModal from '@/components/admin/MediaSelectorModal';

interface TeamMember {
    id: string;
    name: string;
    role: string;
    bio: string;
    photo: string;
    linkedIn?: string;
    github?: string;
    order: number;
}

export default function TeamPage() {
    const [team, setTeam] = useState<TeamMember[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editing, setEditing] = useState<TeamMember | null>(null);

    useEffect(() => {
        fetchTeam();
    }, []);

    const fetchTeam = async () => {
        try {
            const response = await fetch('/api/team');
            const data = await response.json();
            setTeam(data.team || []);
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Delete this team member?')) return;
        try {
            await fetch(`/api/team/${id}`, { method: 'DELETE' });
            setTeam(team.filter((m) => m.id !== id));
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">
                        Team <span className="text-cyan">Management</span>
                    </h1>
                    <p className="text-gray-400">Manage team members and profiles</p>
                </div>
                <Button glow onClick={() => setShowModal(true)}>
                    <Plus size={20} className="mr-2" />
                    Add Team Member
                </Button>
            </div>

            {loading ? (
                <div className="text-center text-gray-400 py-12">Loading...</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {team.map((member) => (
                        <motion.div key={member.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                            <Card className="p-6 text-center">
                                <div className="w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden bg-cyan/20 flex items-center justify-center">
                                    {member.photo ? (
                                        <img
                                            src={member.photo}
                                            alt={member.name}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <span className="text-cyan text-2xl font-bold">{member.name[0]}</span>
                                    )}
                                </div>
                                <h3 className="text-xl font-bold text-white mb-1">{member.name}</h3>
                                <p className="text-cyan text-sm mb-3">{member.role}</p>
                                <p className="text-gray-400 text-sm mb-4 line-clamp-2">{member.bio}</p>
                                <div className="flex justify-center gap-2 mb-4">
                                    {member.linkedIn && (
                                        <a
                                            href={member.linkedIn}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="p-2 rounded-lg bg-white/5 text-gray-400 hover:text-cyan hover:bg-cyan/10"
                                        >
                                            <Linkedin size={16} />
                                        </a>
                                    )}
                                    {member.github && (
                                        <a
                                            href={member.github}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="p-2 rounded-lg bg-white/5 text-gray-400 hover:text-cyan hover:bg-cyan/10"
                                        >
                                            <Github size={16} />
                                        </a>
                                    )}
                                </div>
                                <div className="flex gap-2 justify-center">
                                    <button
                                        onClick={() => setEditing(member)}
                                        className="p-2 rounded-lg bg-white/5 text-cyan hover:bg-cyan/10"
                                    >
                                        <Edit size={16} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(member.id)}
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
                    <TeamMemberModal
                        member={editing}
                        onClose={() => {
                            setShowModal(false);
                            setEditing(null);
                        }}
                        onSuccess={() => {
                            fetchTeam();
                            setShowModal(false);
                            setEditing(null);
                        }}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}

function TeamMemberModal({
    member,
    onClose,
    onSuccess,
}: {
    member: TeamMember | null;
    onClose: () => void;
    onSuccess: () => void;
}) {
    const [formData, setFormData] = useState({
        name: member?.name || '',
        role: member?.role || '',
        bio: member?.bio || '',
        photo: member?.photo || '',
        linkedIn: member?.linkedIn || '',
        github: member?.github || '',
        order: member?.order || 0,
    });
    const [loading, setLoading] = useState(false);
    const [showMediaModal, setShowMediaModal] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const url = member ? `/api/team/${member.id}` : '/api/team';
            const method = member ? 'PUT' : 'POST';

            // Clean up empty strings for optional fields
            const payload = {
                ...formData,
                photo: formData.photo?.trim() || undefined,
                linkedIn: formData.linkedIn?.trim() || undefined,
                github: formData.github?.trim() || undefined,
            };

            await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
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
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="relative w-full max-w-lg bg-navy border border-cyan/30 rounded-2xl p-6 max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-white">{member ? 'Edit' : 'Add'} Team Member</h2>
                    <button onClick={onClose} className="p-2 rounded-full bg-white/5 hover:bg-white/10">
                        <X size={20} />
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Name *</label>
                        <input
                            required
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-cyan focus:outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Role *</label>
                        <input
                            required
                            value={formData.role}
                            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                            placeholder="e.g., CEO, Lead Developer"
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-cyan focus:outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Bio *</label>
                        <textarea
                            required
                            rows={3}
                            value={formData.bio}
                            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-cyan focus:outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Photo</label>
                        <div className="space-y-2">
                            {formData.photo && (
                                <div className="relative w-24 h-24 rounded-lg overflow-hidden border-2 border-cyan/30">
                                    <img src={formData.photo} alt="Preview" className="w-full h-full object-cover" />
                                    <button
                                        type="button"
                                        onClick={() => setFormData({ ...formData, photo: '' })}
                                        className="absolute top-1 right-1 p-1 bg-red-500/80 rounded-full hover:bg-red-500"
                                    >
                                        <X size={14} className="text-white" />
                                    </button>
                                </div>
                            )}
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setShowMediaModal(true)}
                                className="w-full"
                            >
                                <ImageIcon size={16} className="mr-2" />
                                {formData.photo ? 'Change Photo' : 'Select Photo from Media'}
                            </Button>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">LinkedIn URL</label>
                        <input
                            type="url"
                            value={formData.linkedIn}
                            onChange={(e) => setFormData({ ...formData, linkedIn: e.target.value })}
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-cyan focus:outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">GitHub URL</label>
                        <input
                            type="url"
                            value={formData.github}
                            onChange={(e) => setFormData({ ...formData, github: e.target.value })}
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-cyan focus:outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Display Order</label>
                        <input
                            type="number"
                            value={formData.order}
                            onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-cyan focus:outline-none"
                        />
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

                {/* Media Selector Modal */}
                <MediaSelectorModal
                    isOpen={showMediaModal}
                    onClose={() => setShowMediaModal(false)}
                    onSelect={(media) => {
                        if (!Array.isArray(media)) {
                            setFormData({ ...formData, photo: media.url });
                        }
                        setShowMediaModal(false);
                    }}
                    mode="single"
                />
            </motion.div>
        </div>
    );
}
