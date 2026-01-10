import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getCurrentUser, hasRole } from '@/lib/auth';
import { settingsSchema } from '@/lib/validations';

// GET /api/settings - Get current settings
export async function GET(request: NextRequest) {
    try {
        let settings = await prisma.settings.findUnique({
            where: { id: 'main' },
        });

        // Create default settings if they don't exist
        if (!settings) {
            settings = await prisma.settings.create({
                data: {
                    id: 'main',
                },
            });
        }

        return NextResponse.json({ settings });
    } catch (error) {
        console.error('Get settings error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

// PUT /api/settings - Update settings
export async function PUT(request: NextRequest) {
    try {
        const user = await getCurrentUser();
        if (!user || !hasRole(user, ['SUPER_ADMIN', 'ADMIN'])) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
        }

        const body = await request.json();
        const validation = settingsSchema.partial().safeParse(body);

        if (!validation.success) {
            return NextResponse.json(
                { error: 'Invalid input', details: validation.error.issues },
                { status: 400 }
            );
        }

        // Destructure socialLinks and other data from validation.data
        // The 'id' field is not expected in validation.data for updates,
        // as the target 'id' is fixed to 'main'.
        const { socialLinks, ...dataToUpdate } = validation.data;

        const settings = await prisma.settings.upsert({
            where: { id: 'main' }, // Target the main settings entry
            update: {
                ...dataToUpdate,
                ...(socialLinks !== undefined && { socialLinks: socialLinks as any }), // Only include if present
            },
            create: {
                id: 'main',
                ...dataToUpdate,
                ...(socialLinks !== undefined && { socialLinks: socialLinks as any }), // Only include if present
            },
        });

        return NextResponse.json({ settings });
    } catch (error) {
        console.error('Update settings error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
