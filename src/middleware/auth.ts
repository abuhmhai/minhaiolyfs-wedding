import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';
import { prisma } from '@/lib/db';

export interface AuthenticatedRequest extends NextRequest {
  user?: {
    id: number;
    role: 'admin' | 'user';
  };
}

export async function authenticateUser(request: NextRequest) {
  try {
    const token = request.cookies.get('token')?.value;
    if (!token) {
      return null;
    }

    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);

    const user = await prisma.user.findUnique({
      where: { id: payload.userId as number },
      select: { id: true, role: true },
    });

    return user;
  } catch (error) {
    console.error('Authentication error:', error);
    return null;
  }
}

export function withAuth<T extends object>(
  handler: (request: AuthenticatedRequest, context: T) => Promise<NextResponse>,
  options?: { requiredRole?: 'admin' | 'user' }
) {
  return async function (request: NextRequest, context: T) {
    const user = await authenticateUser(request);

    if (!user) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    if (options?.requiredRole && user.role !== options.requiredRole) {
      return NextResponse.json(
        { message: 'Forbidden' },
        { status: 403 }
      );
    }

    (request as AuthenticatedRequest).user = user;
    return handler(request as AuthenticatedRequest, context);
  };
} 