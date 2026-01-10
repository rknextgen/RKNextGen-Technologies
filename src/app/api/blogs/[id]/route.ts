import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getCurrentUser, hasRole } from '@/lib/auth';
import { blogSchema } from '@/lib/validations';

interface RouteParams {
    params: Promise<{
        id: string;
    }>;
}

// GET /api/blogs/[id] - Get single blog
export async function GET(
    request: NextRequest,
    { params }: RouteParams
) {
    try {
        const { id } = await params;

        const blog = await prisma.blog.findUnique({
            where: { id },
        });

        if (!blog) {
            return NextResponse.json({ error: 'Blog not found' }, { status: 404 });
        }

        return NextResponse.json({ blog });
    } catch (error) {
        console.error('Get blog error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

// PUT /api/blogs/[id] - Update blog
export async function PUT(
    request: NextRequest,
    { params }: RouteParams
) {
    try {
        const user = await getCurrentUser();
        if (!user || !hasRole(user, ['SUPER_ADMIN', 'ADMIN', 'EDITOR'])) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
        }

        const { id } = await params;
        const body = await request.json();
        const validation = blogSchema.partial().safeParse(body);

        if (!validation.success) {
            return NextResponse.json(
                { error: 'Invalid input', details: validation.error.issues },
                { status: 400 }
            );
        }

        const data = validation.data;

        // Check if blog exists
        const existing = await prisma.blog.findUnique({
            where: { id },
        });

        if (!existing) {
            return NextResponse.json({ error: 'Blog not found' }, { status: 404 });
        }

        // If slug is being changed, check for conflicts
        if (data.slug && data.slug !== existing.slug) {
            const slugExists = await prisma.blog.findUnique({
                where: { slug: data.slug },
            });

            if (slugExists) {
                return NextResponse.json(
                    { error: 'Slug already exists' },
                    { status: 409 }
                );
            }
        }

        // Update publishedAt if status changes to PUBLISHED
        const updateData: any = { ...data };
        if (data.status === 'PUBLISHED' && existing.status !== 'PUBLISHED') {
            updateData.publishedAt = new Date();
        }

        const blog = await prisma.blog.update({
            where: { id },
            data: updateData,
        });

        return NextResponse.json({ blog });
    } catch (error) {
        console.error('Update blog error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

// DELETE /api/blogs/[id] - Delete blog
export async function DELETE(
    request: NextRequest,
    { params }: RouteParams
) {
    try {
        const user = await getCurrentUser();
        if (!user || !hasRole(user, ['SUPER_ADMIN', 'ADMIN'])) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
        }

        const { id } = await params;

        const blog = await prisma.blog.findUnique({
            where: { id },
        });

        if (!blog) {
            return NextResponse.json({ error: 'Blog not found' }, { status: 404 });
        }

        await prisma.blog.delete({
            where: { id },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Delete blog error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
