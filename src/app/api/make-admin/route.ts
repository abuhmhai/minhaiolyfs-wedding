import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const { email } = await request.json();
    
    const user = await prisma.user.update({
      where: { email },
      data: { role: 'admin' },
    });

    return NextResponse.json({ message: 'User updated to admin', user });
  } catch (error) {
    console.error('Error making user admin:', error);
    return NextResponse.json({ error: 'Failed to update user role' }, { status: 500 });
  }
} 