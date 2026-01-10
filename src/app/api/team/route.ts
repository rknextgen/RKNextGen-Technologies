import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getCurrentUser, hasRole } from '@/lib/auth';
import { teamMemberSchema } from '@/lib/validations';

// GET /api/team
export async function GET() {
    try {
        const team = await prisma.teamMember.findMany({
            orderBy: { order: 'asc' },
        });

        return NextResponse.json({ team });
    } catch (error) {
        console.error('Get team error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

// POST /api/team
export async function POST(request: NextRequest) {
    try {
        const user = await getCurrentUser();
        if (!user || !hasRole(user, ['SUPER_ADMIN', 'ADMIN'])) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
        }

        const body = await request.json();
        const validation = teamMemberSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json(
                { error: 'Invalid input', details: validation.error.issues },
                { status: 400 }
            );
        }

        const member = await prisma.teamMember.create({
            data: validation.data,
        });

        return NextResponse.json({ member }, { status: 201 });
    } catch (error) {
        console.error('Create team member error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
