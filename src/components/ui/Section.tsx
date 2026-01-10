import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface SectionProps extends React.HTMLAttributes<HTMLElement> {
    fullWidth?: boolean;
}

export const Section = React.forwardRef<HTMLElement, SectionProps>(
    ({ className, fullWidth = false, children, ...props }, ref) => {
        return (
            <section
                ref={ref}
                className={cn('py-20 relative overflow-hidden', className)}
                {...props}
            >
                <div className={cn('mx-auto px-4 sm:px-6 lg:px-8', !fullWidth && 'max-w-7xl')}>
                    {children}
                </div>
            </section>
        );
    }
);

Section.displayName = 'Section';
