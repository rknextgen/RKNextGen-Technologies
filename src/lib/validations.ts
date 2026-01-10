import { z } from 'zod';

// ============================================
// AUTH SCHEMAS
// ============================================

export const loginSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const registerSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    role: z.enum(['SUPER_ADMIN', 'ADMIN', 'EDITOR']).optional(),
});

export const forgotPasswordSchema = z.object({
    email: z.string().email('Invalid email address'),
});

export const resetPasswordSchema = z.object({
    token: z.string(),
    password: z.string().min(6, 'Password must be at least 6 characters'),
});

// ============================================
// BLOG SCHEMAS
// ============================================

export const blogSchema = z.object({
    title: z.string().min(1, 'Title is required'),
    slug: z.string().min(1, 'Slug is required'),
    excerpt: z.string().min(1, 'Excerpt is required'),
    content: z.string().min(1, 'Content is required'),
    category: z.string().min(1, 'Category is required'),
    tags: z.array(z.string()).default([]),
    author: z.string().min(1, 'Author is required'),
    image: z.string().url('Invalid image URL').optional().or(z.literal('')).nullable(),
    metaTitle: z.string().optional().nullable(),
    metaDesc: z.string().optional().nullable(),
    ogImage: z.string().url().optional().or(z.literal('')).nullable(),
    status: z.enum(['DRAFT', 'PUBLISHED']),
    readTime: z.string().default('5 min read').optional().nullable(),
    publishedAt: z.string().datetime().optional().nullable(),
});

// ============================================
// PROJECT SCHEMAS
// ============================================

export const projectSchema = z.object({
    title: z.string().min(1, 'Title is required'),
    slug: z.string().min(1, 'Slug is required'),
    description: z.string().min(1, 'Description is required'),
    fullDescription: z.string().min(1, 'Full description is required'),
    category: z.string().min(1, 'Category is required'),
    techStack: z.array(z.string()),
    // Image fields - allow relative URLs (e.g., /uploads/image.jpg)
    coverImageId: z.string().optional(),
    coverImageUrl: z.string().refine(val => !val || val.startsWith('/') || val.startsWith('http'), {
        message: 'Must be a valid URL or path'
    }).optional(),
    galleryImageIds: z.array(z.string()).optional().or(z.literal(undefined)),
    galleryImageUrls: z.array(
        z.string().refine(val => val.startsWith('/') || val.startsWith('http'), {
            message: 'Must be a valid URL or path'
        })
    ).optional().or(z.literal(undefined)),
    demoUrl: z.string().url().optional(),
    githubUrl: z.string().url().optional(),
    featured: z.boolean().default(false),
    // Optional enhanced fields
    clientName: z.string().optional(),
    industry: z.string().optional(),
    problem: z.string().optional(),
    solution: z.string().optional(),
    impact: z.array(z.string()).optional(),
});

// ============================================
// CASE STUDY SCHEMAS
// ============================================

export const caseStudySchema = z.object({
    title: z.string().min(1, 'Title is required'),
    clientName: z.string().min(1, 'Client name is required'),
    problem: z.string().min(1, 'Problem is required'),
    solution: z.string().min(1, 'Solution is required'),
    impactMetrics: z.array(
        z.object({
            metric: z.string(),
            value: z.string(),
            icon: z.string(),
        })
    ),
    techStack: z.array(z.string()),
    category: z.string().min(1, 'Category is required'),
});

// ============================================
// TESTIMONIAL SCHEMAS
// ============================================

export const testimonialSchema = z.object({
    clientName: z.string().min(1, 'Client name is required'),
    company: z.string().min(1, 'Company is required'),
    photo: z.string().url('Invalid photo URL'),
    rating: z.number().min(1).max(5),
    text: z.string().min(1, 'Testimonial text is required'),
    featured: z.boolean().default(false),
});

// ============================================
// TEAM SCHEMAS
// ============================================

export const teamMemberSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    role: z.string().min(1, 'Role is required'),
    bio: z.string().min(1, 'Bio is required'),
    photo: z.string().refine(val => !val || val.startsWith('/') || val.startsWith('http'), {
        message: 'Must be a valid URL or path'
    }).optional().or(z.literal('')),
    linkedIn: z.string().refine(val => !val || val.startsWith('http'), {
        message: 'Must be a valid URL'
    }).optional().or(z.literal('')),
    github: z.string().refine(val => !val || val.startsWith('http'), {
        message: 'Must be a valid URL'
    }).optional().or(z.literal('')),
    order: z.number().default(0),
});

// ============================================
// JOB SCHEMAS
// ============================================

export const jobSchema = z.object({
    title: z.string().min(1, 'Title is required'),
    department: z.string().min(1, 'Department is required'),
    location: z.string().min(1, 'Location is required'),
    type: z.string().min(1, 'Type is required'),
    shortSummary: z.string().min(1, 'Summary is required'),
    responsibilities: z.array(z.string()),
    requirements: z.array(z.string()),
    status: z.enum(['OPEN', 'CLOSED']).default('OPEN'),
});

export const applicationSchema = z.object({
    jobId: z.string().optional(),
    name: z.string().min(1, 'Name is required'),
    email: z.string().email('Invalid email'),
    phone: z.string().optional(),
    linkedIn: z.string().url().optional(),
    resume: z.string().url('Resume URL is required'),
    message: z.string().optional(),
    status: z.enum(['NEW', 'IN_REVIEW', 'SELECTED', 'REJECTED']).default('NEW'),
    adminNotes: z.string().optional(),
});

// ============================================
// LEAD SCHEMAS
// ============================================

export const leadSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    email: z.string().email('Invalid email'),
    phone: z.string().optional(),
    company: z.string().optional(),
    message: z.string().min(1, 'Message is required'),
    type: z.enum(['CONTACT', 'QUOTE', 'NEWSLETTER']),
    status: z.string().default('NEW'),
    notes: z.string().optional(),
    isRead: z.boolean().default(false),
});

// ============================================
// SETTINGS SCHEMAS
// ============================================

export const settingsSchema = z.object({
    companyName: z.string().min(1),
    tagline: z.string().min(1),
    email: z.string().email(),
    phone: z.string().min(1),
    whatsapp: z.string().nullable().optional(),
    socialLinks: z.record(z.string(), z.any()),
    analyticsId: z.string().nullable().optional(),
    primaryColor: z.string(),
    accentColor: z.string(),
    darkMode: z.boolean(),
    animations: z.boolean(),
    metaTitle: z.string().nullable().optional(),
    metaDescription: z.string().nullable().optional(),
    ogImage: z.string().url().nullable().optional(),
});

export const pageSEOSchema = z.object({
    id: z.string(),
    pageName: z.string(),
    metaTitle: z.string(),
    metaDesc: z.string(),
    ogImage: z.string().url().optional(),
});

export const legalPageSchema = z.object({
    id: z.string(),
    title: z.string(),
    content: z.string(),
});
