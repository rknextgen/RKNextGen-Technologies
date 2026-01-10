import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getCurrentUser, hasRole } from '@/lib/auth';
import { legalPageSchema } from '@/lib/validations';

// GET /api/legal - Get all legal pages
export async function GET(request: NextRequest) {
    try {
        // Publicly accessible for frontend rendering, but maybe we want to restrict list view to admin?
        // For now, let's allow public access to GET individual pages via a different route or just filter here if needed.
        // But this is the admin API, so let's restrict it.
        // Actually, the requirement says "Editable Pages", implying this is for the admin panel.

        const user = await getCurrentUser();
        if (!user || !hasRole(user, ['SUPER_ADMIN', 'ADMIN', 'EDITOR'])) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
        }

        const legalPages = await prisma.legalPage.findMany();
        return NextResponse.json({ legalPages });
    } catch (error) {
        console.error('Get legal pages error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

// PUT /api/legal - Update legal page content
export async function PUT(request: NextRequest) {
    try {
        const user = await getCurrentUser();
        if (!user || !hasRole(user, ['SUPER_ADMIN', 'ADMIN'])) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
        }

        const body = await request.json();
        const validation = legalPageSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json(
                { error: 'Invalid input', details: validation.error.issues },
                { status: 400 }
            );
        }

        const { id, ...data } = validation.data;

        const legalPage = await prisma.legalPage.upsert({
            where: { id },
            update: data,
            create: { id, ...data },
        });

        return NextResponse.json({ legalPage });
    } catch (error) {
        console.error('Update legal page error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
