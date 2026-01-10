import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getCurrentUser, hasRole } from '@/lib/auth';
import { jobSchema } from '@/lib/validations';

// GET /api/jobs - List all jobs
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const status = searchParams.get('status');
        const department = searchParams.get('department');
        const search = searchParams.get('search');
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '10');

        const where: any = {};

        if (status) {
            where.status = status;
        }

        if (department) {
            where.department = department;
        }

        if (search) {
            where.OR = [
                { title: { contains: search, mode: 'insensitive' } },
                { shortSummary: { contains: search, mode: 'insensitive' } },
            ];
        }

        const [jobs, total] = await Promise.all([
            prisma.job.findMany({
                where,
                orderBy: { createdAt: 'desc' },
                skip: (page - 1) * limit,
                take: limit,
                include: {
                    _count: {
                        select: { applications: true },
                    },
                },
            }),
            prisma.job.count({ where }),
        ]);

        return NextResponse.json({
            jobs,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        });
    } catch (error) {
        console.error('Get jobs error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

// POST /api/jobs - Create new job
export async function POST(request: NextRequest) {
    try {
        const user = await getCurrentUser();
        if (!user || !hasRole(user, ['SUPER_ADMIN', 'ADMIN'])) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
        }

        const body = await request.json();
        const validation = jobSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json(
                { error: 'Invalid input', details: validation.error.issues },
                { status: 400 }
            );
        }

        const job = await prisma.job.create({
            data: validation.data,
        });

        return NextResponse.json({ job }, { status: 201 });
    } catch (error) {
        console.error('Create job error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
