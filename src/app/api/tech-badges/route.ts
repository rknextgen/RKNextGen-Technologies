import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
    try {
        const badges = await prisma.techBadge.findMany();
        return NextResponse.json(badges);
    } catch (error) {
        console.error('Error fetching tech badges:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
