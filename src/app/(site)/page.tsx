import React from 'react';
import { HeroSection } from '@/components/home/HeroSection';
import { FeaturesSection } from '@/components/home/FeaturesSection';
import { Testimonials } from '@/components/sections/Testimonials';
import { ClientLogos } from '@/components/sections/ClientLogos';
import { CaseStudies } from '@/components/sections/CaseStudies';
import { Section } from '@/components/ui/Section';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import { getFeaturedTestimonials, getFeaturedCaseStudies } from '@/lib/actions';
import { ServicesPreview } from '@/components/home/ServicesPreview';

export default async function Home() {
    const testimonials = await getFeaturedTestimonials();
    const caseStudies = await getFeaturedCaseStudies();

    return (
        <div className="flex flex-col">
            {/* Hero Section */}
            <HeroSection />

            {/* What We Do Section */}
            <Section className="bg-navy/50">
                <ServicesPreview />
            </Section>

            {/* Why Choose Us Section */}
            <FeaturesSection />

            {/* Client Logos Section */}
            <ClientLogos />

            {caseStudies.length > 0 && (
                <CaseStudies
                    caseStudies={caseStudies.map((cs: any) => ({
                        ...cs,
                        impactMetrics: cs.impactMetrics as any[]
                    }))}
                />
            )}

            {/* Testimonials Section */}
            <Testimonials testimonials={testimonials} />

            {/* CTA Section */}
            <Section className="bg-gradient-to-b from-navy to-black/40">
                <div className="text-center max-w-3xl mx-auto">
                    <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
                        Let's Build Something <span className="text-ai-purple">Intelligent</span> Together.
                    </h2>
                    <p className="text-gray-400 mb-10 text-lg">
                        Whether you're a startup looking to disrupt the market or an enterprise seeking digital transformation, we have the expertise to help you succeed.
                    </p>
                    <div className="flex justify-center">
                        <Link href="/contact">
                            <Button size="lg" glow className="px-12">Get Started Now</Button>
                        </Link>
                    </div>
                </div>
            </Section>
        </div>
    );
}
