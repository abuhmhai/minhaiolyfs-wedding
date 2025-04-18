import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function POST() {
  try {
    const cookieStore = await cookies();
    
    // Clear the JWT token cookie
    await cookieStore.set('token', '', { 
      expires: new Date(0),
      path: '/'
    });

    // Clear NextAuth session
    const session = await getServerSession(authOptions);
    if (session) {
      await cookieStore.set('next-auth.session-token', '', {
        expires: new Date(0),
        path: '/'
      });
    }
    
    return NextResponse.json({ message: 'Signed out successfully' });
  } catch (error) {
    console.error('Sign out error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 