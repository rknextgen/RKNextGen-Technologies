'use client';

import dynamic from 'next/dynamic';

const Scene = dynamic(() => import('./Scene').then((mod) => mod.Scene), {
    ssr: false,
});

export const SceneWrapper = () => {
    return <Scene />;
};
