import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getCurrentUser, hasRole } from '@/lib/auth';
import { leadSchema } from '@/lib/validations';

// GET /api/leads - List all leads with filters
export async function GET(request: NextRequest) {
    try {
        const user = await getCurrentUser();
        if (!user || !hasRole(user, ['SUPER_ADMIN', 'ADMIN', 'EDITOR'])) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
        }

        const { searchParams } = new URL(request.url);
        const type = searchParams.get('type');
        const status = searchParams.get('status');
        const isRead = searchParams.get('isRead');

        const where: any = {};

        if (type) {
            where.type = type;
        }

        if (status) {
            where.status = status;
        }

        if (isRead !== null && isRead !== undefined) {
            where.isRead = isRead === 'true';
        }

        const leads = await prisma.lead.findMany({
            where,
            orderBy: { createdAt: 'desc' },
        });

        return NextResponse.json({ leads });
    } catch (error) {
        console.error('Get leads error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

// POST /api/leads - Create new lead (public endpoint for contact forms)
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const validation = leadSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json(
                { error: 'Invalid input', details: validation.error.issues },
                { status: 400 }
            );
        }

        const lead = await prisma.lead.create({
            data: validation.data,
        });

        // Send email notification
        if (validation.data.type === 'CONTACT') {
            const { sendContactEmail, sendAutoReplyEmail } = await import('@/lib/mail');

            // Send notification to admin
            await sendContactEmail({
                name: validation.data.name,
                email: validation.data.email,
                phone: validation.data.phone || undefined,
                company: validation.data.company || undefined,
                message: validation.data.message || '',
            });

            // Send auto-reply to user
            await sendAutoReplyEmail({
                name: validation.data.name,
                email: validation.data.email,
            });
        }

        return NextResponse.json({ lead }, { status: 201 });
    } catch (error) {
        console.error('Create lead error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
