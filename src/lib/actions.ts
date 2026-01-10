import { prisma } from '@/lib/db';
import { cache } from 'react';

// Cache the settings fetch to avoid hitting the DB on every request in the same render cycle
export const getSettings = cache(async () => {
    try {
        const settings = await prisma.settings.findUnique({
            where: { id: 'main' },
        });
        return settings;
    } catch (error) {
        console.error('Error fetching settings:', error);
        return null;
    }
});

export const getSocialLinks = async () => {
    const settings = await getSettings();
    if (!settings?.socialLinks) return {};

    // Parse if it's a string (though Prisma should handle Json type)
    if (typeof settings.socialLinks === 'string') {
        try {
            return JSON.parse(settings.socialLinks);
        } catch (e) {
            return {};
        }
    }
    return settings.socialLinks as Record<string, string>;
};

export const getFeaturedTestimonials = cache(async () => {
    try {
        return await prisma.testimonial.findMany({
            where: { featured: true },
            orderBy: { createdAt: 'desc' },
        });
    } catch (error) {
        console.error('Error fetching testimonials:', error);
        return [];
    }
});

export const getFeaturedProjects = cache(async () => {
    try {
        return await prisma.project.findMany({
            where: { featured: true },
            take: 3,
            orderBy: { createdAt: 'desc' },
        });
    } catch (error) {
        console.error('Error fetching projects:', error);
        return [];
    }
});

export const getFeaturedCaseStudies = cache(async () => {
    try {
        return await prisma.caseStudy.findMany({
            take: 3,
            orderBy: { createdAt: 'desc' },
        });
    } catch (error) {
        console.error('Error fetching case studies:', error);
        return [];
    }
});

export const getRecentBlogs = cache(async () => {
    try {
        return await prisma.blog.findMany({
            where: { status: 'PUBLISHED' },
            take: 3,
            orderBy: { publishedAt: 'desc' },
        });
    } catch (error) {
        console.error('Error fetching blogs:', error);
        return [];
    }
});

export const getPublishedBlogs = cache(async ({
    page = 1,
    limit = 9,
    category
}: {
    page?: number;
    limit?: number;
    category?: string;
} = {}) => {
    try {
        const where: any = { status: 'PUBLISHED' };
        if (category && category !== 'All') {
            where.category = category;
        }

        const [blogs, total] = await Promise.all([
            prisma.blog.findMany({
                where,
                take: limit,
                skip: (page - 1) * limit,
                orderBy: { publishedAt: 'desc' },
            }),
            prisma.blog.count({ where }),
        ]);

        return { blogs, total, totalPages: Math.ceil(total / limit) };
    } catch (error) {
        console.error('Error fetching published blogs:', error);
        return { blogs: [], total: 0, totalPages: 0 };
    }
});

export const getBlogBySlug = cache(async (slug: string) => {
    try {
        return await prisma.blog.findUnique({
            where: { slug },
        });
    } catch (error) {
        console.error('Error fetching blog by slug:', error);
        return null;
    }
});

export const getAllBlogSlugs = cache(async () => {
    try {
        return await prisma.blog.findMany({
            where: { status: 'PUBLISHED' },
            select: { slug: true },
        });
    } catch (error) {
        console.error('Error fetching blog slugs:', error);
        return [];
    }
});

export const getBlogCategories = cache(async () => {
    try {
        // Get all distinct categories from published blogs
        const categories = await prisma.blog.findMany({
            where: { status: 'PUBLISHED' },
            select: { category: true },
            distinct: ['category'],
        });
        return categories.map((c: any) => c.category);
    } catch (error) {
        console.error('Error fetching blog categories:', error);
        return [];
    }
});

export const getProjects = cache(async ({
    page = 1,
    limit = 9,
    category
}: {
    page?: number;
    limit?: number;
    category?: string;
} = {}) => {
    try {
        const where: any = {};
        if (category && category !== 'All') {
            where.category = category;
        }

        const [projects, total] = await Promise.all([
            prisma.project.findMany({
                where,
                take: limit,
                skip: (page - 1) * limit,
                orderBy: { createdAt: 'desc' },
            }),
            prisma.project.count({ where }),
        ]);

        return { projects, total, totalPages: Math.ceil(total / limit) };
    } catch (error) {
        console.error('Error fetching projects:', error);
        return { projects: [], total: 0, totalPages: 0 };
    }
});

export const getProjectBySlug = cache(async (slug: string) => {
    try {
        return await prisma.project.findUnique({
            where: { slug },
        });
    } catch (error) {
        console.error('Error fetching project by slug:', error);
        return null;
    }
});

export const getAllProjectSlugs = cache(async () => {
    try {
        return await prisma.project.findMany({
            select: { slug: true },
        });
    } catch (error) {
        console.error('Error fetching project slugs:', error);
        return [];
    }
});

export const getProjectCategories = cache(async () => {
    try {
        const projects = await prisma.project.findMany({
            select: { category: true },
        });
        const categories = projects.map((p: any) => p.category);
        return Array.from(new Set(categories)) as string[];
    } catch (error) {
        console.error('Error fetching project categories:', error);
        return [];
    }
});

export const getOpenJobs = cache(async ({
    department,
    location
}: {
    department?: string;
    location?: string;
} = {}) => {
    try {
        const where: any = { status: 'OPEN' };
        if (department && department !== 'All') {
            where.department = department;
        }
        if (location && location !== 'All') {
            where.location = location;
        }

        return await prisma.job.findMany({
            where,
            orderBy: { createdAt: 'desc' },
        });
    } catch (error) {
        console.error('Error fetching jobs:', error);
        return [];
    }
});

export const getJobById = cache(async (id: string) => {
    try {
        return await prisma.job.findUnique({
            where: { id },
        });
    } catch (error) {
        console.error('Error fetching job by id:', error);
        return null;
    }
});

export const getAllJobIds = cache(async () => {
    try {
        return await prisma.job.findMany({
            where: { status: 'OPEN' },
            select: { id: true },
        });
    } catch (error) {
        console.error('Error fetching job ids:', error);
        return [];
    }
});

export const getJobDepartments = cache(async () => {
    try {
        const departments = await prisma.job.findMany({
            where: { status: 'OPEN' },
            select: { department: true },
            distinct: ['department'],
        });
        return departments.map((d: any) => d.department);
    } catch (error) {
        console.error('Error fetching job departments:', error);
        return [];
    }
});

export const getTeamMembers = cache(async () => {
    try {
        return await prisma.teamMember.findMany({
            orderBy: { order: 'asc' },
        });
    } catch (error) {
        console.error('Error fetching team members:', error);
        return [];
    }
});

export const getLegalPage = cache(async (slug: string) => {
    try {
        return await prisma.legalPage.findUnique({
            where: { id: slug },
        });
    } catch (error) {
        console.error('Error fetching legal page:', error);
        return null;
    }
});

export const getRelatedProjects = cache(async (category: string, currentSlug: string) => {
    try {
        return await prisma.project.findMany({
            where: {
                category,
                slug: { not: currentSlug },
            },
            take: 3,
            orderBy: { createdAt: 'desc' },
        });
    } catch (error) {
        console.error('Error fetching related projects:', error);
        return [];
    }
});
