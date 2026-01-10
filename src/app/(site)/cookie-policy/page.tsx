'use client';

import React from 'react';
import { Section } from '@/components/ui/Section';
import { Card } from '@/components/ui/Card';

export default function CookiePolicyPage() {
    return (
        <div className="pt-20">
            <Section>
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-4xl font-bold text-white mb-8">Cookie Policy</h1>

                    <Card className="p-8 md:p-12">
                        <div className="prose prose-invert max-w-none space-y-6 text-gray-300">
                            <p className="text-sm text-gray-500 mb-8">Last updated: December 2024</p>

                            <h2 className="text-xl font-bold text-white">1. What Are Cookies</h2>
                            <p>
                                Cookies are small text files that are placed on your computer or mobile device by websites that you visit. They are widely used in order to make websites work, or work more efficiently, as well as to provide information to the owners of the site.
                            </p>

                            <h2 className="text-xl font-bold text-white">2. How We Use Cookies</h2>
                            <p>
                                We use cookies for a variety of reasons detailed below. Unfortunately, in most cases, there are no industry standard options for disabling cookies without completely disabling the functionality and features they add to this site. It is recommended that you leave on all cookies if you are not sure whether you need them or not in case they are used to provide a service that you use.
                            </p>

                            <h2 className="text-xl font-bold text-white">3. The Cookies We Set</h2>
                            <ul className="list-disc pl-5 space-y-2">
                                <li>
                                    <strong className="text-white">Account related cookies:</strong> If you create an account with us, then we will use cookies for the management of the signup process and general administration.
                                </li>
                                <li>
                                    <strong className="text-white">Login related cookies:</strong> We use cookies when you are logged in so that we can remember this fact. This prevents you from having to log in every single time you visit a new page.
                                </li>
                                <li>
                                    <strong className="text-white">Forms related cookies:</strong> When you submit data to through a form such as those found on contact pages or comment forms cookies may be set to remember your user details for future correspondence.
                                </li>
                            </ul>

                            <h2 className="text-xl font-bold text-white">4. Third Party Cookies</h2>
                            <p>
                                In some special cases we also use cookies provided by trusted third parties. The following section details which third party cookies you might encounter through this site:
                            </p>
                            <ul className="list-disc pl-5 space-y-2">
                                <li>
                                    <strong className="text-white">Google Analytics:</strong> This site uses Google Analytics which is one of the most widespread and trusted analytics solutions on the web for helping us to understand how you use the site and ways that we can improve your experience.
                                </li>
                            </ul>

                            <h2 className="text-xl font-bold text-white">5. Disabling Cookies</h2>
                            <p>
                                You can prevent the setting of cookies by adjusting the settings on your browser (see your browser Help for how to do this). Be aware that disabling cookies will affect the functionality of this and many other websites that you visit. Disabling cookies will usually result in also disabling certain functionality and features of this site.
                            </p>
                        </div>
                    </Card>
                </div>
            </Section>
        </div>
    );
}
