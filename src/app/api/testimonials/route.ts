import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getCurrentUser, hasRole } from '@/lib/auth';
import { testimonialSchema } from '@/lib/validations';

// GET /api/testimonials
export async function GET() {
    try {
        const testimonials = await prisma.testimonial.findMany({
            orderBy: [{ featured: 'desc' }, { createdAt: 'desc' }],
        });

        return NextResponse.json({ testimonials });
    } catch (error) {
        console.error('Get testimonials error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

// POST /api/testimonials
export async function POST(request: NextRequest) {
    try {
        const user = await getCurrentUser();
        if (!user || !hasRole(user, ['SUPER_ADMIN', 'ADMIN', 'EDITOR'])) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
        }

        const body = await request.json();
        const validation = testimonialSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json(
                { error: 'Invalid input', details: validation.error.issues },
                { status: 400 }
            );
        }

        const testimonial = await prisma.testimonial.create({
            data: validation.data,
        });

        return NextResponse.json({ testimonial }, { status: 201 });
    } catch (error) {
        console.error('Create testimonial error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
