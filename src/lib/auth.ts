import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';
import bcrypt from 'bcryptjs';

const secret = new TextEncoder().encode(
    process.env.JWT_SECRET || 'your-secret-key-change-in-production'
);

export interface JWTPayload {
    userId: string;
    email: string;
    role: string;
    [key: string]: unknown;
}

// Hash password
export async function hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 12);
}

// Verify password
export async function verifyPassword(
    password: string,
    hashedPassword: string
): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
}

// Create JWT token
export async function createToken(payload: JWTPayload): Promise<string> {
    return new SignJWT(payload)
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('7d')
        .sign(secret);
}

// Verify JWT token
export async function verifyToken(token: string): Promise<JWTPayload | null> {
    try {
        const { payload } = await jwtVerify(token, secret);
        return payload as JWTPayload;
    } catch (error) {
        return null;
    }
}

// Get current user from cookies
export async function getCurrentUser(): Promise<JWTPayload | null> {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth-token');

    if (!token) {
        return null;
    }

    return verifyToken(token.value);
}

// Get current user from request
export async function getUserFromRequest(
    request: NextRequest
): Promise<JWTPayload | null> {
    const token = request.cookies.get('auth-token');

    if (!token) {
        return null;
    }

    return verifyToken(token.value);
}

// Check if user has required role
export function hasRole(user: JWTPayload | null, roles: string[]): boolean {
    if (!user) return false;
    return roles.includes(user.role);
}

// Role hierarchy check
export function canAccess(userRole: string, requiredRole: string): boolean {
    const roleHierarchy = {
        SUPER_ADMIN: 3,
        ADMIN: 2,
        EDITOR: 1,
    };

    const userLevel = roleHierarchy[userRole as keyof typeof roleHierarchy] || 0;
    const requiredLevel = roleHierarchy[requiredRole as keyof typeof roleHierarchy] || 0;

    return userLevel >= requiredLevel;
}
