'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import {
    Image as ImageIcon,
    Upload,
    Trash2,
    Search,
    File,
    Video,
    Copy,
    Check,
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export default function MediaPage() {
    const [media, setMedia] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [copiedId, setCopiedId] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const fetchMedia = async () => {
        try {
            const res = await fetch('/api/media');
            const data = await res.json();
            setMedia(data.media || []);
        } catch (error) {
            console.error('Error fetching media:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMedia();
    }, []);

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        const formData = new FormData();
        formData.append('file', file);

        try {
            const res = await fetch('/api/media', {
                method: 'POST',
                body: formData,
            });

            if (res.ok) {
                fetchMedia();
            }
        } catch (error) {
            console.error('Error uploading file:', error);
        } finally {
            setUploading(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this file?')) return;
        try {
            await fetch(`/api/media?id=${id}`, { method: 'DELETE' });
            fetchMedia();
        } catch (error) {
            console.error('Error deleting file:', error);
        }
    };

    const copyToClipboard = (url: string, id: string) => {
        navigator.clipboard.writeText(url);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    const formatSize = (bytes: number) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">
                        Media <span className="text-cyan">Library</span>
                    </h1>
                    <p className="text-gray-400">Manage images and files</p>
                </div>
                <div>
                    <input
                        type="file"
                        ref={fileInputRef}
                        className="hidden"
                        onChange={handleUpload}
                    />
                    <Button onClick={() => fileInputRef.current?.click()} disabled={uploading}>
                        <Upload className="mr-2 h-4 w-4" />
                        {uploading ? 'Uploading...' : 'Upload File'}
                    </Button>
                </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {media.map((item) => (
                    <motion.div
                        key={item.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        layout
                    >
                        <Card className="group relative overflow-hidden aspect-square">
                            {item.type === 'image' ? (
                                <img
                                    src={item.url}
                                    alt={item.filename}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-white/5">
                                    {item.type === 'video' ? (
                                        <Video size={48} className="text-gray-500" />
                                    ) : (
                                        <File size={48} className="text-gray-500" />
                                    )}
                                </div>
                            )}

                            {/* Overlay */}
                            <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-4">
                                <div className="flex justify-end">
                                    <button
                                        onClick={() => handleDelete(item.id)}
                                        className="p-2 hover:bg-white/20 rounded-lg text-red-400 transition-colors"
                                        title="Delete"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                                <div className="space-y-2">
                                    <p className="text-white text-sm truncate">{item.filename}</p>
                                    <p className="text-gray-400 text-xs">{formatSize(item.size)}</p>
                                    {item.url.includes('cloudinary.com') && (
                                        <p className="text-cyan text-xs">☁️ Cloudinary CDN</p>
                                    )}
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => copyToClipboard(item.url, item.id)}
                                            className="flex-1 py-2 bg-white/10 hover:bg-white/20 rounded text-xs text-white flex items-center justify-center gap-2 transition-colors"
                                            title="Copy URL to clipboard"
                                        >
                                            {copiedId === item.id ? (
                                                <>
                                                    <Check size={14} className="text-green-400" />
                                                    Copied!
                                                </>
                                            ) : (
                                                <>
                                                    <Copy size={14} />
                                                    Copy
                                                </>
                                            )}
                                        </button>
                                        <button
                                            onClick={() => window.open(item.url, '_blank')}
                                            className="flex-1 py-2 bg-white/10 hover:bg-white/20 rounded text-xs text-white flex items-center justify-center gap-2 transition-colors"
                                            title="Open in new tab"
                                        >
                                            <ImageIcon size={14} />
                                            Open
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </motion.div>
                ))}
            </div>

            {media.length === 0 && !loading && (
                <div className="text-center py-12 text-gray-500">
                    <ImageIcon size={48} className="mx-auto mb-4 opacity-50" />
                    <p>No media files found</p>
                </div>
            )}
        </div>
    );
}
