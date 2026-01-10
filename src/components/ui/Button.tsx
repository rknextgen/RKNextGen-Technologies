'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface ButtonProps extends React.HTMLAttributes<HTMLElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  glow?: boolean;
  as?: 'button' | 'div' | 'span';
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
}

export const Button = React.forwardRef<HTMLElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', glow = false, as = 'button', children, ...props }, ref) => {
    const variants = {
      primary: 'bg-cyan text-navy hover:bg-white hover:text-navy border border-cyan group',
      secondary: 'bg-ai-purple text-white hover:bg-white hover:text-ai-purple border border-ai-purple group',
      outline: 'bg-transparent text-cyan border border-cyan hover:bg-cyan/10 group',
    };

    const sizes = {
      sm: 'px-4 py-2 text-sm',
      md: 'px-6 py-3 text-base',
      lg: 'px-8 py-4 text-lg font-bold',
    };

    const Component = motion[as] as any;

    return (
      <Component
        ref={ref}
        whileHover={{
          scale: 1.05,
          boxShadow: '0 0 25px rgba(0, 194, 217, 0.6), 0 0 50px rgba(0, 194, 217, 0.3)'
        }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: 'spring', stiffness: 400, damping: 17 }}
        className={cn(
          'relative overflow-hidden rounded-full font-medium transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer',
          variants[variant],
          sizes[size],
          glow && 'shadow-[0_0_15px_rgba(0,194,217,0.5)]',
          className
        )}
        {...props}
      >
        {/* Light sweep effect */}
        <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent" />

        <span className="relative z-10">{children}</span>

        {/* Glow overlay */}
        {variant === 'primary' && (
          <div className="absolute inset-0 bg-gradient-to-r from-cyan/0 via-cyan/20 to-cyan/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        )}
      </Component>
    );
  }
);

Button.displayName = 'Button';
