import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: parseInt(session.user.id) },
      select: {
        fullName: true,
        phone: true,
        address: true,
        email: true
      }
    });

    if (!user) {
      return new NextResponse('User not found', { status: 404 });
    }

    // Transform the response to match the expected format
    const transformedUser = {
      fullName: user.fullName,
      phone: user.phone,
      address: user.address,
      email: user.email
    };

    return NextResponse.json(transformedUser);
  } catch (error) {
    console.error('Error fetching user:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
} 