'use client';

import React, { useRef, ReactNode } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { useCursor } from '@/contexts/CursorContext';

interface MagneticWrapperProps {
    children: ReactNode;
    className?: string;
    strength?: number;
}

/**
 * MagneticWrapper - Wraps interactive elements to add magnetic hover effect
 * The element will subtly move towards the cursor when hovered
 */
export const MagneticWrapper = ({
    children,
    className = '',
    strength = 0.3,
}: MagneticWrapperProps) => {
    const ref = useRef<HTMLDivElement>(null);
    const { setCursorVariant } = useCursor();

    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const springConfig = { damping: 20, stiffness: 300 };
    const xSpring = useSpring(x, springConfig);
    const ySpring = useSpring(y, springConfig);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!ref.current) return;

        const rect = ref.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        const distanceX = e.clientX - centerX;
        const distanceY = e.clientY - centerY;

        x.set(distanceX * strength);
        y.set(distanceY * strength);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
        setCursorVariant('default');
    };

    const handleMouseEnter = () => {
        setCursorVariant('hover');
    };

    const handleMouseDown = () => {
        setCursorVariant('click');
    };

    const handleMouseUp = () => {
        setCursorVariant('hover');
    };

    return (
        <motion.div
            ref={ref}
            className={className}
            style={{ x: xSpring, y: ySpring }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            onMouseEnter={handleMouseEnter}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
        >
            {children}
        </motion.div>
    );
};
