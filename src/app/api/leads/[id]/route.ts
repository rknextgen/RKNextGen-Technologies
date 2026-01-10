import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getCurrentUser, hasRole } from '@/lib/auth';

interface RouteParams {
    params: Promise<{
        id: string;
    }>;
}

// GET /api/leads/[id]
export async function GET(request: NextRequest, { params }: RouteParams) {
    try {
        const user = await getCurrentUser();
        if (!user || !hasRole(user, ['SUPER_ADMIN', 'ADMIN', 'EDITOR'])) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
        }

        const { id } = await params;
        const lead = await prisma.lead.findUnique({ where: { id } });

        if (!lead) {
            return NextResponse.json({ error: 'Lead not found' }, { status: 404 });
        }

        return NextResponse.json({ lead });
    } catch (error) {
        console.error('Get lead error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

// PUT /api/leads/[id] - Update lead (status, notes, isRead)
export async function PUT(request: NextRequest, { params }: RouteParams) {
    try {
        const user = await getCurrentUser();
        if (!user || !hasRole(user, ['SUPER_ADMIN', 'ADMIN', 'EDITOR'])) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
        }

        const { id } = await params;
        const body = await request.json();

        const lead = await prisma.lead.update({
            where: { id },
            data: {
                status: body.status,
                notes: body.notes,
                isRead: body.isRead,
            },
        });

        return NextResponse.json({ lead });
    } catch (error) {
        console.error('Update lead error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

// DELETE /api/leads/[id]
export async function DELETE(request: NextRequest, { params }: RouteParams) {
    try {
        const user = await getCurrentUser();
        if (!user || !hasRole(user, ['SUPER_ADMIN', 'ADMIN'])) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
        }

        const { id } = await params;
        await prisma.lead.delete({ where: { id } });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Delete lead error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
