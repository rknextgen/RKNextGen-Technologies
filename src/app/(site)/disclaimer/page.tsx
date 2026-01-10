'use client';

import React from 'react';
import { Section } from '@/components/ui/Section';
import { Card } from '@/components/ui/Card';

export default function DisclaimerPage() {
    return (
        <div className="pt-20">
            <Section>
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-4xl font-bold text-white mb-8">Disclaimer</h1>

                    <Card className="p-8 md:p-12">
                        <div className="prose prose-invert max-w-none space-y-6 text-gray-300">
                            <p className="text-sm text-gray-500 mb-8">Last updated: December 2024</p>

                            <h2 className="text-xl font-bold text-white">1. Website Content</h2>
                            <p>
                                The information provided by RK NextGen Technologies ("we," "us," or "our") on this website is for general informational purposes only. All information on the Site is provided in good faith, however, we make no representation or warranty of any kind, express or implied, regarding the accuracy, adequacy, validity, reliability, availability, or completeness of any information on the Site.
                            </p>

                            <h2 className="text-xl font-bold text-white">2. External Links</h2>
                            <p>
                                The Site may contain (or you may be sent through the Site) links to other websites or content belonging to or originating from third parties or links to websites and features in banners or other advertising. Such external links are not investigated, monitored, or checked for accuracy, adequacy, validity, reliability, availability, or completeness by us.
                            </p>

                            <h2 className="text-xl font-bold text-white">3. Professional Advice</h2>
                            <p>
                                The Site cannot and does not contain legal, financial, or medical advice. The information is provided for general informational and educational purposes only and is not a substitute for professional advice. Accordingly, before taking any actions based upon such information, we encourage you to consult with the appropriate professionals.
                            </p>

                            <h2 className="text-xl font-bold text-white">4. Testimonials</h2>
                            <p>
                                The Site may contain testimonials by users of our products and/or services. These testimonials reflect the real-life experiences and opinions of such users. However, the experiences are personal to those particular users, and may not necessarily be representative of all users of our products and/or services. We do not claim, and you should not assume, that all users will have the same experiences.
                            </p>

                            <h2 className="text-xl font-bold text-white">5. Errors and Omissions</h2>
                            <p>
                                While we strive to ensure that the information contained in this site has been obtained from reliable sources, RK NextGen Technologies is not responsible for any errors or omissions, or for the results obtained from the use of this information.
                            </p>
                        </div>
                    </Card>
                </div>
            </Section>
        </div>
    );
}
