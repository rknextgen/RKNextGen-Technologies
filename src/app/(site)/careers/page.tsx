import React from 'react';
import { CheckCircle } from 'lucide-react';
import { Section } from '@/components/ui/Section';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { getOpenJobs, getJobDepartments } from '@/lib/actions';
import { CategoryFilter } from '@/components/blog/CategoryFilter';
import { JobList } from '@/components/careers/JobList';

export const metadata = {
    title: 'Careers | RK NextGen Technologies',
    description: 'Build the future of technology with a team of passionate innovators.',
};

export default async function CareersPage({
    searchParams,
}: {
    searchParams: Promise<{ department?: string }>;
}) {
    const { department } = await searchParams;
    const currentDepartment = department || 'All';

    const jobs = await getOpenJobs({ department: currentDepartment });
    const departments = await getJobDepartments();

    return (
        <div className="pt-20">
            {/* Hero Section */}
            <Section className="text-center">
                <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
                    Join Our <span className="text-cyan">Mission</span>
                </h1>
                <p className="text-xl text-gray-400 max-w-3xl mx-auto mb-12">
                    Build the future of technology with a team of passionate innovators.
                </p>
                <div className="flex justify-center gap-4">
                    <a href="#open-positions">
                        <Button glow>
                            View Open Roles
                        </Button>
                    </a>
                    <a href="mailto:careers@rknextgen.com">
                        <Button variant="outline">
                            Send Your Resume
                        </Button>
                    </a>
                </div>
            </Section>

            {/* Why Join Us */}
            <Section>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
                    <Card className="p-8 border-l-4 border-l-cyan">
                        <h2 className="text-2xl font-bold text-white mb-4">Why Join Us?</h2>
                        <ul className="space-y-4">
                            {[
                                'Work on cutting-edge AI & Cloud technologies',
                                'Remote-first culture with flexible hours',
                                'Competitive salary and equity options',
                                'Continuous learning and development budget',
                                'Collaborative and inclusive environment',
                            ].map((item, index) => (
                                <li key={index} className="flex items-start gap-3 text-gray-300">
                                    <CheckCircle className="w-5 h-5 text-cyan shrink-0 mt-0.5" />
                                    <span>{item}</span>
                                </li>
                            ))}
                        </ul>
                    </Card>
                    <Card className="p-8 border-l-4 border-l-ai-purple">
                        <h2 className="text-2xl font-bold text-white mb-4">Our Culture</h2>
                        <p className="text-gray-300 leading-relaxed mb-6">
                            At RK NextGen, we believe in innovation, integrity, and impact. We foster a culture where every voice is heard, and every idea has the potential to change the world. We are problem solvers, dreamers, and doers.
                        </p>
                        <Button variant="outline" className="w-full sm:w-auto">Learn More About Us</Button>
                    </Card>
                </div>

                {/* Open Positions */}
                <div id="open-positions">
                    <h2 className="text-3xl font-bold text-white mb-8 text-center">Open Positions</h2>

                    <CategoryFilter
                        categories={departments}
                        baseUrl="/careers"
                        paramName="department"
                    />

                    <JobList jobs={jobs} />
                </div>
            </Section>

            {/* General Application CTA */}
            <Section className="text-center bg-navy/50">
                <h2 className="text-2xl font-bold text-white mb-4">Don't see the right role?</h2>
                <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
                    We are always looking for talented individuals to join our team. Send us your resume and we'll keep you in mind for future openings.
                </p>
                <div className="flex justify-center">
                    <a href="mailto:careers@rknextgen.com">
                        <Button variant="outline" size="lg">Email Your Resume</Button>
                    </a>
                </div>
            </Section>
        </div>
    );
}
