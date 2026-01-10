import { NextRequest, NextResponse } from 'next/server';
import { sendNewsletterSubscriptionEmail } from '@/lib/mail';
import { z } from 'zod';

const newsletterSchema = z.object({
    email: z.string().email(),
});

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const validation = newsletterSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json(
                { error: 'Invalid email address' },
                { status: 400 }
            );
        }

        // Send email notification
        await sendNewsletterSubscriptionEmail(validation.data.email);

        return NextResponse.json({ success: true }, { status: 200 });
    } catch (error) {
        console.error('Newsletter subscription error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
