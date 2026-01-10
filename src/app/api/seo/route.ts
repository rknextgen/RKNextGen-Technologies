import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getCurrentUser, hasRole } from '@/lib/auth';
import { pageSEOSchema } from '@/lib/validations';

// GET /api/seo - Get all page SEO settings
export async function GET(request: NextRequest) {
    try {
        const user = await getCurrentUser();
        if (!user || !hasRole(user, ['SUPER_ADMIN', 'ADMIN', 'EDITOR'])) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
        }

        const seoSettings = await prisma.pageSEO.findMany();
        return NextResponse.json({ seoSettings });
    } catch (error) {
        console.error('Get SEO settings error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

// PUT /api/seo - Update page SEO settings
export async function PUT(request: NextRequest) {
    try {
        const user = await getCurrentUser();
        if (!user || !hasRole(user, ['SUPER_ADMIN', 'ADMIN'])) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
        }

        const body = await request.json();
        const validation = pageSEOSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json(
                { error: 'Invalid input', details: validation.error.issues },
                { status: 400 }
            );
        }

        const { id, ...data } = validation.data;

        const seoSetting = await prisma.pageSEO.upsert({
            where: { id },
            update: data,
            create: { id, ...data },
        });

        return NextResponse.json({ seoSetting });
    } catch (error) {
        console.error('Update SEO settings error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
