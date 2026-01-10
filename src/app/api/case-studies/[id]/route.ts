import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getCurrentUser, hasRole } from '@/lib/auth';
import { caseStudySchema } from '@/lib/validations';

interface RouteParams {
    params: Promise<{
        id: string;
    }>;
}

// GET /api/case-studies/[id]
export async function GET(request: NextRequest, { params }: RouteParams) {
    try {
        const { id } = await params;
        const caseStudy = await prisma.caseStudy.findUnique({ where: { id } });

        if (!caseStudy) {
            return NextResponse.json({ error: 'Case study not found' }, { status: 404 });
        }

        return NextResponse.json({ caseStudy });
    } catch (error) {
        console.error('Get case study error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

// PUT /api/case-studies/[id]
export async function PUT(request: NextRequest, { params }: RouteParams) {
    try {
        const user = await getCurrentUser();
        if (!user || !hasRole(user, ['SUPER_ADMIN', 'ADMIN', 'EDITOR'])) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
        }

        const { id } = await params;
        const body = await request.json();
        const validation = caseStudySchema.partial().safeParse(body);

        if (!validation.success) {
            return NextResponse.json(
                { error: 'Invalid input', details: validation.error.issues },
                { status: 400 }
            );
        }

        const caseStudy = await prisma.caseStudy.update({
            where: { id },
            data: validation.data,
        });

        return NextResponse.json({ caseStudy });
    } catch (error) {
        console.error('Update case study error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

// DELETE /api/case-studies/[id]
export async function DELETE(request: NextRequest, { params }: RouteParams) {
    try {
        const user = await getCurrentUser();
        if (!user || !hasRole(user, ['SUPER_ADMIN', 'ADMIN'])) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
        }

        const { id } = await params;
        await prisma.caseStudy.delete({ where: { id } });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Delete case study error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
