import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getCurrentUser, hasRole } from '@/lib/auth';

// GET /api/dashboard/stats - Get dashboard statistics
export async function GET(request: NextRequest) {
    try {
        const user = await getCurrentUser();
        if (!user || !hasRole(user, ['SUPER_ADMIN', 'ADMIN', 'EDITOR'])) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
        }

        const [
            totalBlogs,
            totalProjects,
            totalCaseStudies,
            totalLeads,
            totalApplications,
            recentBlogs,
            recentLeads,
            recentApplications,
            recentProjects,
        ] = await Promise.all([
            prisma.blog.count(),
            prisma.project.count(),
            prisma.caseStudy.count(),
            prisma.lead.count(),
            prisma.application.count(),
            prisma.blog.findMany({
                take: 1,
                orderBy: { createdAt: 'desc' },
                select: { title: true, createdAt: true },
            }),
            prisma.lead.findMany({
                take: 1,
                orderBy: { createdAt: 'desc' },
                select: { type: true, createdAt: true },
            }),
            prisma.application.findMany({
                take: 1,
                orderBy: { createdAt: 'desc' },
                select: { job: { select: { title: true } }, createdAt: true },
            }),
            prisma.project.findMany({
                take: 1,
                orderBy: { updatedAt: 'desc' },
                select: { title: true, updatedAt: true },
            }),
        ]);

        const recentActivity = [];

        if (recentBlogs.length > 0) {
            recentActivity.push({
                type: 'blog',
                title: `New blog published: "${recentBlogs[0].title}"`,
                time: recentBlogs[0].createdAt,
            });
        }

        if (recentLeads.length > 0) {
            recentActivity.push({
                type: 'lead',
                title: `New ${recentLeads[0].type.toLowerCase()} submission`,
                time: recentLeads[0].createdAt,
            });
        }

        if (recentApplications.length > 0) {
            recentActivity.push({
                type: 'application',
                title: `New application for ${recentApplications[0].job?.title || 'General'}`,
                time: recentApplications[0].createdAt,
            });
        }

        if (recentProjects.length > 0) {
            recentActivity.push({
                type: 'project',
                title: `Project "${recentProjects[0].title}" updated`,
                time: recentProjects[0].updatedAt,
            });
        }

        // Sort combined activity by time
        recentActivity.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());

        return NextResponse.json({
            stats: {
                blogs: totalBlogs,
                projects: totalProjects,
                caseStudies: totalCaseStudies,
                leads: totalLeads,
                applications: totalApplications,
            },
            recentActivity,
        });
    } catch (error) {
        console.error('Get dashboard stats error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
