import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getCurrentUser, hasRole } from '@/lib/auth';
import { writeFile, unlink, mkdir } from 'fs/promises';
import path from 'path';
import { existsSync } from 'fs';

// GET /api/media - List all media files
export async function GET(request: NextRequest) {
    try {
        const user = await getCurrentUser();
        if (!user || !hasRole(user, ['SUPER_ADMIN', 'ADMIN', 'EDITOR'])) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
        }

        const { searchParams } = new URL(request.url);
        const folder = searchParams.get('folder');
        const type = searchParams.get('type');
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '20');

        const where: any = {};

        if (folder) {
            where.folder = folder;
        }

        if (type) {
            where.type = type;
        }

        const [media, total] = await Promise.all([
            prisma.media.findMany({
                where,
                orderBy: { createdAt: 'desc' },
                skip: (page - 1) * limit,
                take: limit,
            }),
            prisma.media.count({ where }),
        ]);

        return NextResponse.json({
            media,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        });
    } catch (error) {
        console.error('Get media error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

// POST /api/media - Upload new media
export async function POST(request: NextRequest) {
    try {
        const user = await getCurrentUser();
        if (!user || !hasRole(user, ['SUPER_ADMIN', 'ADMIN', 'EDITOR'])) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
        }

        const formData = await request.formData();
        const file = formData.get('file') as File;
        const folder = (formData.get('folder') as string) || 'general';

        if (!file) {
            return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Generate unique filename
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const ext = path.extname(file.name);
        const filename = `${path.basename(file.name, ext)}-${uniqueSuffix}${ext}`;

        // Upload to Cloudinary
        const { uploadToCloudinary } = await import('@/lib/cloudinary');
        const uploadResult: any = await uploadToCloudinary(buffer, folder, filename);

        // Determine file type
        let type = 'document';
        if (file.type.startsWith('image/')) type = 'image';
        else if (file.type.startsWith('video/')) type = 'video';

        // Save to database with Cloudinary URL
        const media = await prisma.media.create({
            data: {
                filename: file.name,
                url: uploadResult.secure_url, // Cloudinary URL
                type,
                size: file.size,
                folder,
            },
        });

        return NextResponse.json({ media }, { status: 201 });
    } catch (error) {
        console.error('Upload media error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

// DELETE /api/media - Delete media
export async function DELETE(request: NextRequest) {
    try {
        const user = await getCurrentUser();
        if (!user || !hasRole(user, ['SUPER_ADMIN', 'ADMIN', 'EDITOR'])) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
        }

        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: 'Media ID is required' }, { status: 400 });
        }

        const media = await prisma.media.findUnique({
            where: { id },
        });

        if (!media) {
            return NextResponse.json({ error: 'Media not found' }, { status: 404 });
        }

        // Delete from Cloudinary if URL is from Cloudinary
        if (media.url.includes('cloudinary.com')) {
            try {
                const { extractPublicId, deleteFromCloudinary } = await import('@/lib/cloudinary');
                const publicId = extractPublicId(media.url);
                if (publicId) {
                    await deleteFromCloudinary(publicId);
                }
            } catch (error) {
                console.error('Error deleting from Cloudinary:', error);
                // Continue with database deletion even if Cloudinary deletion fails
            }
        } else {
            // Legacy: Delete from local disk if it's an old local file
            const relativePath = media.url.startsWith('/') ? media.url.slice(1) : media.url;
            const filepath = path.join(process.cwd(), 'public', relativePath);

            if (existsSync(filepath)) {
                await unlink(filepath);
            }
        }

        // Delete from DB
        await prisma.media.delete({
            where: { id },
        });

        return NextResponse.json({ message: 'Media deleted successfully' });
    } catch (error) {
        console.error('Delete media error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
