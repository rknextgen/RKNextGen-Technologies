'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { ApplicationForm } from './ApplicationForm';

interface ApplyButtonProps {
    jobTitle: string;
}

export const ApplyButton = ({ jobTitle }: ApplyButtonProps) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <Button glow size="lg" onClick={() => setIsOpen(true)}>
                Apply for this Role
            </Button>
            <ApplicationForm
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
                jobTitle={jobTitle}
            />
        </>
    );
};
