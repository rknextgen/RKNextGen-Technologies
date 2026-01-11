'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

export function AnalyticsTracker() {
    const pathname = usePathname();
    const searchParams = useSearchParams();

    useEffect(() => {
        // Don't track admin pages or api routes
        if (pathname?.startsWith('/admin') || pathname?.startsWith('/api')) {
            return;
        }

        const trackPageView = async () => {
            try {
                await fetch('/api/analytics/track', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        page: pathname,
                    }),
                });
            } catch (error) {
                console.error('Error tracking page view:', error);
            }
        };

        trackPageView();
    }, [pathname, searchParams]);

    return null;
}
