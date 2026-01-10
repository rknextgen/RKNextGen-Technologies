import React from 'react';
import { Section } from '@/components/ui/Section';
import { getProjects, getProjectCategories, getFeaturedCaseStudies } from '@/lib/actions';
import { CategoryFilter } from '@/components/blog/CategoryFilter';
import { Pagination } from '@/components/ui/Pagination';
import { ProjectGrid } from '@/components/projects/ProjectGrid';
import { CaseStudies } from '@/components/sections/CaseStudies';

export const metadata = {
    title: 'Projects | RK NextGen Technologies',
    description: 'Showcasing our expertise through impactful projects and digital innovations.',
};

export default async function ProjectsPage({
    searchParams,
}: {
    searchParams: Promise<{ page?: string; category?: string }>;
}) {
    const { page: pageParam, category: categoryParam } = await searchParams;
    const page = Number(pageParam) || 1;
    const category = categoryParam || 'All';
    const limit = 6;

    const { projects, totalPages } = await getProjects({ page, limit, category });
    const categories = await getProjectCategories();
    const caseStudies = await getFeaturedCaseStudies();

    return (
        <div className="pt-20">
            <Section className="text-center">
                <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
                    Our <span className="text-cyan">Work</span>
                </h1>
                <p className="text-xl text-gray-400 max-w-3xl mx-auto mb-12">
                    Showcasing our expertise through impactful projects and digital innovations.
                </p>

                {/* Categories */}
                <CategoryFilter categories={categories} baseUrl="/projects" />
            </Section>

            <Section>
                {/* Results count */}
                <div className="text-center mb-8">
                    <p className="text-gray-400">
                        Showing <span className="text-cyan font-semibold">{projects.length}</span> projects
                        {category !== 'All' && (
                            <span className="text-gray-500"> in {category}</span>
                        )}
                    </p>
                </div>

                {/* Project Grid */}
                <ProjectGrid projects={projects} />

                {/* Pagination */}
                <Pagination totalPages={totalPages} currentPage={page} baseUrl="/projects" />
            </Section>

            {/* Case Studies Section */}
            {caseStudies.length > 0 && (
                <CaseStudies
                    caseStudies={caseStudies.map((cs: any) => ({
                        ...cs,
                        impactMetrics: cs.impactMetrics as any[]
                    }))}
                />
            )}
        </div>
    );
}
