'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

export type CursorVariant = 'default' | 'hover' | 'click' | 'hero';

interface CursorContextType {
    cursorVariant: CursorVariant;
    setCursorVariant: (variant: CursorVariant) => void;
}

const CursorContext = createContext<CursorContextType | undefined>(undefined);

export const CursorProvider = ({ children }: { children: ReactNode }) => {
    const [cursorVariant, setCursorVariant] = useState<CursorVariant>('default');

    return (
        <CursorContext.Provider value={{ cursorVariant, setCursorVariant }}>
            {children}
        </CursorContext.Provider>
    );
};

export const useCursor = () => {
    const context = useContext(CursorContext);
    if (!context) {
        throw new Error('useCursor must be used within a CursorProvider');
    }
    return context;
};
