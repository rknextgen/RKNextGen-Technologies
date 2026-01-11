'use client';

import React from 'react';
import { Section } from '@/components/ui/Section';
import { Card } from '@/components/ui/Card';

export default function PrivacyPolicyPage() {
    return (
        <div className="pt-20">
            <Section className="text-center">
                <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
                    Privacy <span className="text-cyan">Policy</span>
                </h1>
                <p className="text-xl text-gray-400 max-w-3xl mx-auto mb-12">
                    Your privacy is important to us. This policy explains how we handle your data.
                </p>
            </Section>

            <Section>
                <Card className="p-8 md:p-12 max-w-4xl mx-auto space-y-8 text-gray-300">
                    <div>
                        <h2 className="text-2xl font-bold text-white mb-4">1. Introduction</h2>
                        <p>
                            Welcome to RK NextGen Technologies. We respect your privacy and are committed to protecting your personal data. This privacy policy will inform you as to how we look after your personal data when you visit our website and tell you about your privacy rights and how the law protects you.
                        </p>
                    </div>

                    <div>
                        <h2 className="text-2xl font-bold text-white mb-4">2. Information We Collect</h2>
                        <p className="mb-2">We may collect, use, store and transfer different kinds of personal data about you which we have grouped together follows:</p>
                        <ul className="list-disc list-inside space-y-1 ml-4">
                            <li><strong>Identity Data:</strong> includes first name, last name, username or similar identifier.</li>
                            <li><strong>Contact Data:</strong> includes email address and telephone numbers.</li>
                            <li><strong>Technical Data:</strong> includes internet protocol (IP) address, your login data, browser type and version, time zone setting and location, browser plug-in types and versions, operating system and platform, and other technology on the devices you use to access this website.</li>
                            <li><strong>Usage Data:</strong> includes information about how you use our website, products, and services.</li>
                        </ul>
                    </div>

                    <div>
                        <h2 className="text-2xl font-bold text-white mb-4">3. How We Use Your Data</h2>
                        <p className="mb-2">We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:</p>
                        <ul className="list-disc list-inside space-y-1 ml-4">
                            <li>Where we need to perform the contract we are about to enter into or have entered into with you.</li>
                            <li>Where it is necessary for our legitimate interests (or those of a third party) and your interests and fundamental rights do not override those interests.</li>
                            <li>Where we need to comply with a legal obligation.</li>
                        </ul>
                    </div>

                    <div>
                        <h2 className="text-2xl font-bold text-white mb-4">4. Data Security</h2>
                        <p>
                            We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used or accessed in an unauthorized way, altered or disclosed. In addition, we limit access to your personal data to those employees, agents, contractors and other third parties who have a business need to know.
                        </p>
                    </div>

                    <div>
                        <h2 className="text-2xl font-bold text-white mb-4">5. Contact Us</h2>
                        <p>
                            If you have any questions about this privacy policy or our privacy practices, please contact us at: <strong>info@rknextgen.com</strong>.
                        </p>
                    </div>

                    <div className="pt-8 border-t border-white/10 text-sm text-gray-500">
                        <p>Last Updated: December 2025</p>
                    </div>
                </Card>
            </Section>
        </div>
    );
}
