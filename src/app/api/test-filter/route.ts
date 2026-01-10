import { NextResponse } from 'next/server';
import { getProjects } from '@/lib/actions';

export async function GET() {
    const webProjects = await getProjects({ category: 'Web' });
    const aiProjects = await getProjects({ category: 'AI' });

    return NextResponse.json({
        web: webProjects.projects.map(p => ({ title: p.title, category: p.category })),
        ai: aiProjects.projects.map(p => ({ title: p.title, category: p.category })),
    });
}
