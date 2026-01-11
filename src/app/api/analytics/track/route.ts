import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function POST(request: NextRequest) {
    try {
        const { page } = await request.json();

        if (!page) {
            return NextResponse.json({ error: 'Page is required' }, { status: 400 });
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Check if entry exists for today and page
        const existingEntries = await prisma.pageView.findMany({
            where: {
                page,
                date: {
                    gte: today,
                },
            },
            take: 1,
        });

        const existingEntry = existingEntries[0];

        if (existingEntry) {
            await prisma.pageView.update({
                where: { id: existingEntry.id },
                data: {
                    count: existingEntry.count + 1,
                },
            });
        } else {
            await prisma.pageView.create({
                data: {
                    page,
                    count: 1,
                    date: today,
                },
            });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Track analytics error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
