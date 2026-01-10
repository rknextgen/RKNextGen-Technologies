import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getCurrentUser, hasRole } from '@/lib/auth';
import { projectSchema } from '@/lib/validations';

interface RouteParams {
    params: Promise<{
        id: string;
    }>;
}

// GET /api/projects/[id] (or [slug])
export async function GET(
    request: NextRequest,
    { params }: RouteParams
) {
    try {
        const { id } = await params;

        // Try to find by ID first
        let project = await prisma.project.findUnique({
            where: { id },
        });

        // If not found, try to find by Slug
        if (!project) {
            project = await prisma.project.findUnique({
                where: { slug: id },
            });
        }

        if (!project) {
            return NextResponse.json({ error: 'Project not found' }, { status: 404 });
        }

        return NextResponse.json({ project });
    } catch (error) {
        console.error('Get project error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

// PUT /api/projects/[id]
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
        const validation = projectSchema.partial().safeParse(body);

        if (!validation.success) {
            return NextResponse.json(
                { error: 'Invalid input', details: validation.error.issues },
                { status: 400 }
            );
        }

        const data = validation.data;

        const existing = await prisma.project.findUnique({
            where: { id },
        });

        if (!existing) {
            return NextResponse.json({ error: 'Project not found' }, { status: 404 });
        }

        if (data.slug && data.slug !== existing.slug) {
            const slugExists = await prisma.project.findUnique({
                where: { slug: data.slug },
            });

            if (slugExists) {
                return NextResponse.json(
                    { error: 'Slug already exists' },
                    { status: 409 }
                );
            }
        }

        const project = await prisma.project.update({
            where: { id },
            data,
        });

        return NextResponse.json({ project });
    } catch (error) {
        console.error('Update project error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

// DELETE /api/projects/[id]
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

        const project = await prisma.project.findUnique({
            where: { id },
        });

        if (!project) {
            return NextResponse.json({ error: 'Project not found' }, { status: 404 });
        }

        await prisma.project.delete({
            where: { id },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Delete project error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
