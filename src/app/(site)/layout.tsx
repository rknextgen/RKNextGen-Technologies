import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { FloatingCTA } from '@/components/ui/FloatingCTA';
import { WhatsAppButton } from '@/components/ui/WhatsAppButton';
import { ScrollProgress } from '@/components/ui/ScrollProgress';
import { getSettings } from '@/lib/actions';
import { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
    const settings = await getSettings();
    return {
        title: settings?.metaTitle || "RK NextGen Technologies | AI & Software Innovation",
        description: settings?.metaDescription || "Leading the future of digital transformation with AI, Cloud, and Next-Gen Software Solutions.",
        openGraph: {
            images: settings?.ogImage ? [settings.ogImage] : [],
        },
    };
}

export default async function SiteLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const settings = await getSettings();

    return (
        <>
            <ScrollProgress />
            <Navbar settings={settings} />
            <main className="min-h-screen">
                {children}
            </main>
            <Footer settings={settings} />
            <FloatingCTA />
            <WhatsAppButton />
        </>
    );
}
