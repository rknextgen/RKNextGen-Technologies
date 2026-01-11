import { NextResponse } from 'next/server';
import { getAllBlogSlugs, getAllProjectSlugs, getAllJobIds } from '@/lib/actions';

export async function GET() {
    const baseUrl = 'https://www.rknextgen.com';

    // Static pages
    const staticUrls = [
        '',
        '/about',
        '/services',
        '/blog',
        '/projects',
        '/careers',
        '/contact',
        '/privacy-policy',
        '/terms-of-service',
        '/cookie-policy',
        '/disclaimer',
    ];

    // Fetch dynamic data
    const [blogSlugs, projectSlugs, jobIds] = await Promise.all([
        getAllBlogSlugs(),
        getAllProjectSlugs(),
        getAllJobIds(),
    ]);

    // Generate dynamic URLs
    const blogUrls = blogSlugs.map((blog: any) => `/blog/${blog.slug}`);
    const projectUrls = projectSlugs.map((project: any) => `/projects/${project.slug}`);
    const jobUrls = jobIds.map((job: any) => `/careers/${job.id}`);

    const allUrls = [...staticUrls, ...blogUrls, ...projectUrls, ...jobUrls];

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allUrls
            .map(
                (path) => `
  <url>
    <loc>${baseUrl}${path}</loc>
    <changefreq>weekly</changefreq>
    <priority>${path === '' ? '1.0' : '0.8'}</priority>
  </url>`
            )
            .join('')}
</urlset>`;

    return new NextResponse(sitemap, {
        headers: {
            'Content-Type': 'application/xml',
        },
    });
}
