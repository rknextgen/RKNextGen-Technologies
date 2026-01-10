'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface CardProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onDrag' | 'onDragStart' | 'onDragEnd' | 'onAnimationStart' | 'onAnimationEnd'> {
    children: React.ReactNode;
    hover3D?: boolean;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
    ({ className, children, hover3D = true, ...props }, ref) => {
        const [rotateX, setRotateX] = React.useState(0);
        const [rotateY, setRotateY] = React.useState(0);
        const cardRef = React.useRef<HTMLDivElement>(null);

        const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
            if (!hover3D || !cardRef.current) return;

            const card = cardRef.current;
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateXValue = ((y - centerY) / centerY) * -10;
            const rotateYValue = ((x - centerX) / centerX) * 10;

            setRotateX(rotateXValue);
            setRotateY(rotateYValue);
        };

        const handleMouseLeave = () => {
            setRotateX(0);
            setRotateY(0);
        };

        return (
            <motion.div
                ref={(node) => {
                    cardRef.current = node;
                    if (typeof ref === 'function') ref(node);
                    else if (ref) ref.current = node;
                }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                whileHover={{
                    scale: 1.02,
                    boxShadow: '0 0 30px rgba(0, 194, 217, 0.4), 0 0 60px rgba(138, 43, 226, 0.2)',
                }}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                style={{
                    transformStyle: 'preserve-3d',
                    transform: hover3D ? `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)` : undefined,
                }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className={cn(
                    'glass-card p-6 rounded-xl border border-white/10 backdrop-blur-md',
                    'hover:border-cyan/50 hover:backdrop-blur-lg transition-all duration-300',
                    'relative overflow-hidden group',
                    className
                )}
                {...props}
            >
                {/* Animated border glow */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-cyan/20 via-ai-purple/20 to-cyan/20 blur-xl" />
                </div>

                {/* Content */}
                <div className="relative z-10">{children}</div>

                {/* Corner sparkle effect */}
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-cyan/30 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </motion.div>
        );
    }
);

Card.displayName = 'Card';
