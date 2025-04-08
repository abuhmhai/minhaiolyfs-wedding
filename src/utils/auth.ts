import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { verifyToken } from '@/utils/jwt';

export const isAdmin = async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  if (!token) {
    return false;
  }

  try {
    const payload = await verifyToken(token);
    return payload?.role === 'admin';
  } catch (error) {
    console.error('Error verifying token:', error);
    return false;
  }
};

export const requireAdmin = async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  if (!token) {
    redirect('/login');
  }

  const isUserAdmin = await isAdmin();
  if (!isUserAdmin) {
    redirect('/unauthorized');
  }
}; 