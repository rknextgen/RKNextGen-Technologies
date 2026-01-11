import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getCurrentUser, hasRole } from '@/lib/auth';

// GET /api/analytics - Get analytics data
export async function GET(request: NextRequest) {
    try {
        const user = await getCurrentUser();
        if (!user || !hasRole(user, ['SUPER_ADMIN', 'ADMIN', 'EDITOR'])) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
        }

        const { searchParams } = new URL(request.url);
        const days = parseInt(searchParams.get('days') || '30');

        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);

        const pageViews = await prisma.pageView.findMany({
            where: {
                date: {
                    gte: startDate,
                },
            },
            orderBy: {
                date: 'asc',
            },
        });

        // Group by date for line chart
        const viewsByDate = pageViews.reduce((acc: any, curr: any) => {
            // Ensure date is a Date object before calling toISOString
            const dateStr = new Date(curr.date).toISOString().split('T')[0];
            if (!acc[dateStr]) {
                acc[dateStr] = 0;
            }
            acc[dateStr] += curr.count;
            return acc;
        }, {} as Record<string, number>);

        const chartData = Object.entries(viewsByDate).map(([date, count]) => ({
            date,
            visitors: count,
        }));

        // Top pages
        const viewsByPage = pageViews.reduce((acc: any, curr: any) => {
            if (!acc[curr.page]) {
                acc[curr.page] = 0;
            }
            acc[curr.page] += curr.count;
            return acc;
        }, {} as Record<string, number>);

        const topPages = Object.entries(viewsByPage)
            .map(([page, count]) => ({ page, count: count as number }))
            .sort((a: { count: number }, b: { count: number }) => b.count - a.count)
            .slice(0, 10);

        return NextResponse.json({
            chartData,
            topPages,
            totalViews: pageViews.reduce((sum: number, curr: any) => sum + curr.count, 0),
        });
    } catch (error) {
        console.error('Get analytics error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
