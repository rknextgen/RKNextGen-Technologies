'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, Search } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface Media {
    id: string;
    url: string;
    filename: string;
    type: string;
    size: number;
}

interface MediaSelectorModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSelect: (media: Media | Media[]) => void;
    mode: 'single' | 'multiple';
    selectedIds?: string[];
}

export default function MediaSelectorModal({
    isOpen,
    onClose,
    onSelect,
    mode,
    selectedIds = [],
}: MediaSelectorModalProps) {
    const [media, setMedia] = useState<Media[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selected, setSelected] = useState<Set<string>>(new Set(selectedIds));

    useEffect(() => {
        if (isOpen) {
            fetchMedia();
            setSelected(new Set(selectedIds));
        }
    }, [isOpen]); // Remove selectedIds from dependencies to prevent infinite loop

    const fetchMedia = async () => {
        try {
            setLoading(true);
            const res = await fetch('/api/media');
            if (res.ok) {
                const data = await res.json();
                setMedia(data.media || []);
            }
        } catch (error) {
            console.error('Error fetching media:', error);
        } finally {
            setLoading(false);
        }
    };

    const toggleSelect = (mediaItem: Media) => {
        if (mode === 'single') {
            setSelected(new Set([mediaItem.id]));
            onSelect(mediaItem);
            onClose();
        } else {
            const newSelected = new Set(selected);
            if (newSelected.has(mediaItem.id)) {
                newSelected.delete(mediaItem.id);
            } else {
                newSelected.add(mediaItem.id);
            }
            setSelected(newSelected);
        }
    };

    const handleConfirm = () => {
        if (mode === 'multiple') {
            const selectedMedia = media.filter((m) => selected.has(m.id));
            onSelect(selectedMedia);
        }
        onClose();
    };

    const filteredMedia = media.filter((m) =>
        m.filename.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="w-full max-w-5xl max-h-[90vh] bg-navy border border-white/10 rounded-2xl shadow-2xl flex flex-col"
                >
                    {/* Header */}
                    <div className="flex items-center justify-between p-6 border-b border-white/10">
                        <div>
                            <h2 className="text-2xl font-bold text-white">
                                {mode === 'single' ? 'Select Image' : 'Select Images'}
                            </h2>
                            <p className="text-sm text-gray-400 mt-1">
                                {mode === 'single'
                                    ? 'Click an image to select'
                                    : `${selected.size} image(s) selected`}
                            </p>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                        >
                            <X size={24} className="text-gray-400" />
                        </button>
                    </div>

                    {/* Search */}
                    <div className="p-6 border-b border-white/10">
                        <div className="relative">
                            <Search
                                size={20}
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                            />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search images..."
                                className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:border-cyan focus:outline-none focus:ring-1 focus:ring-cyan"
                            />
                        </div>
                    </div>

                    {/* Media Grid */}
                    <div className="flex-1 overflow-y-auto p-6">
                        {loading ? (
                            <div className="flex items-center justify-center h-64">
                                <div className="text-gray-400">Loading media...</div>
                            </div>
                        ) : filteredMedia.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                                <p>No media found</p>
                                <p className="text-sm mt-2">Upload images in the Media Manager</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                {filteredMedia.map((item) => (
                                    <motion.div
                                        key={item.id}
                                        whileHover={{ scale: 1.05 }}
                                        onClick={() => toggleSelect(item)}
                                        className={`relative aspect-square rounded-lg overflow-hidden cursor-pointer border-2 transition-all ${selected.has(item.id)
                                            ? 'border-cyan shadow-[0_0_20px_rgba(0,194,217,0.3)]'
                                            : 'border-white/10 hover:border-white/30'
                                            }`}
                                    >
                                        <img
                                            src={item.url}
                                            alt={item.filename}
                                            className="w-full h-full object-cover"
                                        />
                                        {selected.has(item.id) && (
                                            <div className="absolute inset-0 bg-cyan/20 flex items-center justify-center">
                                                <div className="w-10 h-10 rounded-full bg-cyan flex items-center justify-center">
                                                    <Check size={24} className="text-white" />
                                                </div>
                                            </div>
                                        )}
                                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2">
                                            <p className="text-xs text-white truncate">{item.filename}</p>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    {mode === 'multiple' && (
                        <div className="flex items-center justify-end gap-3 p-6 border-t border-white/10">
                            <Button variant="outline" onClick={onClose}>
                                Cancel
                            </Button>
                            <Button
                                onClick={handleConfirm}
                                disabled={selected.size === 0}
                                className="bg-cyan hover:bg-cyan/90"
                            >
                                Confirm Selection ({selected.size})
                            </Button>
                        </div>
                    )}
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
