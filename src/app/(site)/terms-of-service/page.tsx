'use client';

import React from 'react';
import { Section } from '@/components/ui/Section';
import { Card } from '@/components/ui/Card';

export default function TermsOfServicePage() {
    return (
        <div className="pt-20">
            <Section className="text-center">
                <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
                    Terms of <span className="text-cyan">Service</span>
                </h1>
                <p className="text-xl text-gray-400 max-w-3xl mx-auto mb-12">
                    Please read these terms carefully before using our services.
                </p>
            </Section>

            <Section>
                <Card className="p-8 md:p-12 max-w-4xl mx-auto space-y-8 text-gray-300">
                    <div>
                        <h2 className="text-2xl font-bold text-white mb-4">1. Acceptance of Terms</h2>
                        <p>
                            By accessing and using this website and our services, you accept and agree to be bound by the terms and provision of this agreement. In addition, when using these particular services, you shall be subject to any posted guidelines or rules applicable to such services.
                        </p>
                    </div>

                    <div>
                        <h2 className="text-2xl font-bold text-white mb-4">2. Intellectual Property</h2>
                        <p>
                            The Site and its original content, features and functionality are owned by RK NextGen Technologies and are protected by international copyright, trademark, patent, trade secret and other intellectual property or proprietary rights laws.
                        </p>
                    </div>

                    <div>
                        <h2 className="text-2xl font-bold text-white mb-4">3. Use License</h2>
                        <p className="mb-2">Permission is granted to temporarily download one copy of the materials (information or software) on RK NextGen Technologies' website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:</p>
                        <ul className="list-disc list-inside space-y-1 ml-4">
                            <li>modify or copy the materials;</li>
                            <li>use the materials for any commercial purpose, or for any public display (commercial or non-commercial);</li>
                            <li>attempt to decompile or reverse engineer any software contained on RK NextGen Technologies' website;</li>
                            <li>remove any copyright or other proprietary notations from the materials; or</li>
                            <li>transfer the materials to another person or "mirror" the materials on any other server.</li>
                        </ul>
                    </div>

                    <div>
                        <h2 className="text-2xl font-bold text-white mb-4">4. Disclaimer</h2>
                        <p>
                            The materials on RK NextGen Technologies' website are provided on an 'as is' basis. RK NextGen Technologies makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
                        </p>
                    </div>

                    <div>
                        <h2 className="text-2xl font-bold text-white mb-4">5. Limitation of Liability</h2>
                        <p>
                            In no event shall RK NextGen Technologies or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on RK NextGen Technologies' website, even if RK NextGen Technologies or a RK NextGen Technologies authorized representative has been notified orally or in writing of the possibility of such damage.
                        </p>
                    </div>

                    <div>
                        <h2 className="text-2xl font-bold text-white mb-4">6. Governing Law</h2>
                        <p>
                            These terms and conditions are governed by and construed in accordance with the laws and you irrevocably submit to the exclusive jurisdiction of the courts in that State or location.
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
