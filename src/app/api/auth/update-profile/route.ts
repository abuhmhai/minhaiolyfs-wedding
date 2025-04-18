import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get request body
    const { fullName, email, phone, address } = await request.json();

    // Update user information
    const user = await prisma.user.update({
      where: { email: session.user.email },
      data: {
        fullName,
        email,
        phone,
        address,
      },
      select: {
        id: true,
        email: true,
        fullName: true,
        phone: true,
        address: true,
        role: true,
      },
    });

    return NextResponse.json({ user });
  } catch (error) {
    console.error('Profile update error:', error);
    return NextResponse.json(
      { error: 'Failed to update profile' },
      { status: 500 }
    );
  }
} 