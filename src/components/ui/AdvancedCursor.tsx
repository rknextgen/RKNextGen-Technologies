'use client';

import React, { useEffect, useState, useRef } from 'react';
import { motion, useSpring, useMotionValue } from 'framer-motion';
import { useCursor } from '@/contexts/CursorContext';

interface Particle {
    id: number;
    x: number;
    y: number;
    opacity: number;
}

export const AdvancedCursor = () => {
    const { cursorVariant } = useCursor();
    const [isMobile, setIsMobile] = useState(false);
    const [particles, setParticles] = useState<Particle[]>([]);
    const particleIdRef = useRef(0);

    // Smooth mouse tracking with spring physics
    const cursorX = useMotionValue(0);
    const cursorY = useMotionValue(0);

    const springConfig = { damping: 25, stiffness: 200, mass: 0.5 };
    const cursorXSpring = useSpring(cursorX, springConfig);
    const cursorYSpring = useSpring(cursorY, springConfig);

    // Check if mobile device
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768 || 'ontouchstart' in window);
        };
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Track mouse position
    useEffect(() => {
        const updateMousePosition = (e: MouseEvent) => {
            cursorX.set(e.clientX);
            cursorY.set(e.clientY);

            // Generate particles in hero zone
            if (cursorVariant === 'hero') {
                const newParticle: Particle = {
                    id: particleIdRef.current++,
                    x: e.clientX,
                    y: e.clientY,
                    opacity: 1,
                };
                setParticles((prev) => [...prev, newParticle]);

                // Remove particle after animation
                setTimeout(() => {
                    setParticles((prev) => prev.filter((p) => p.id !== newParticle.id));
                }, 800);
            }
        };

        window.addEventListener('mousemove', updateMousePosition);
        return () => window.removeEventListener('mousemove', updateMousePosition);
    }, [cursorVariant, cursorX, cursorY]);

    // Don't render on mobile
    if (isMobile) return null;

    // Cursor size and color based on variant
    const getCursorStyles = () => {
        switch (cursorVariant) {
            case 'hover':
                return {
                    dotScale: 1.5,
                    ringScale: 1.8,
                    ringColor: '#1E90FF',
                    dotColor: '#FFFFFF',
                    glowStrength: '0 0 30px rgba(30, 144, 255, 0.6)',
                };
            case 'click':
                return {
                    dotScale: 0.8,
                    ringScale: 2.2,
                    ringColor: '#8A2BE2',
                    dotColor: '#FFFFFF',
                    glowStrength: '0 0 40px rgba(138, 43, 226, 0.8)',
                };
            case 'hero':
                return {
                    dotScale: 1.2,
                    ringScale: 1.5,
                    ringColor: '#8A2BE2',
                    dotColor: '#8A2BE2',
                    glowStrength: '0 0 25px rgba(138, 43, 226, 0.5)',
                };
            default:
                return {
                    dotScale: 1,
                    ringScale: 1,
                    ringColor: '#00C2D9',
                    dotColor: '#FFFFFF',
                    glowStrength: '0 0 20px rgba(0, 194, 217, 0.4)',
                };
        }
    };

    const styles = getCursorStyles();

    return (
        <>
            {/* Particle trail (hero zone only) */}
            {particles.map((particle) => (
                <motion.div
                    key={particle.id}
                    className="fixed top-0 left-0 w-1 h-1 rounded-full pointer-events-none z-[9997]"
                    style={{
                        left: particle.x,
                        top: particle.y,
                        background: cursorVariant === 'hero' ? '#8A2BE2' : '#00C2D9',
                    }}
                    initial={{ opacity: 1, scale: 1 }}
                    animate={{ opacity: 0, scale: 0 }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                />
            ))}

            {/* Inner dot */}
            <motion.div
                className="fixed top-0 left-0 rounded-full pointer-events-none z-[9999] mix-blend-difference"
                style={{
                    x: cursorXSpring,
                    y: cursorYSpring,
                    width: 8,
                    height: 8,
                    marginLeft: -4,
                    marginTop: -4,
                    backgroundColor: styles.dotColor,
                }}
                animate={{
                    scale: styles.dotScale,
                }}
                transition={{
                    type: 'spring',
                    stiffness: 500,
                    damping: 28,
                }}
            />

            {/* Outer ring */}
            <motion.div
                className="fixed top-0 left-0 rounded-full pointer-events-none z-[9998]"
                style={{
                    x: cursorXSpring,
                    y: cursorYSpring,
                    width: 32,
                    height: 32,
                    marginLeft: -16,
                    marginTop: -16,
                    border: `2px solid ${styles.ringColor}`,
                    boxShadow: styles.glowStrength,
                    opacity: cursorVariant === 'hero' ? 0.6 : 1,
                }}
                animate={{
                    scale: styles.ringScale,
                }}
                transition={{
                    type: 'spring',
                    stiffness: 300,
                    damping: 20,
                }}
            />

            {/* Click ripple effect */}
            {cursorVariant === 'click' && (
                <motion.div
                    className="fixed top-0 left-0 rounded-full pointer-events-none z-[9997]"
                    style={{
                        x: cursorXSpring,
                        y: cursorYSpring,
                        width: 32,
                        height: 32,
                        marginLeft: -16,
                        marginTop: -16,
                        border: `2px solid ${styles.ringColor}`,
                    }}
                    initial={{ scale: 1, opacity: 1 }}
                    animate={{ scale: 3, opacity: 0 }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                />
            )}
        </>
    );
};
