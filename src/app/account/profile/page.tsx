'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

export default function ProfilePage() {
  const { data: session, status, update } = useSession();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchUserData = async () => {
      if (status === 'loading') return;
      
      if (status === 'unauthenticated') {
        router.push('/login');
        return;
      }

      try {
        setIsLoading(true);
        const response = await fetch('/api/auth/me', {
          credentials: 'include',
        });
        
        if (response.ok) {
          const data = await response.json();
          setFormData({
            fullName: data.user.fullName,
            email: data.user.email,
            phone: data.user.phone || '',
            address: data.user.address || '',
          });
        } else if (response.status === 401) {
          router.push('/login');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        setMessage('An error occurred while loading account information');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [status, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isEditing) {
      return;
    }
    setMessage('');
    setIsSubmitting(true);

    try {
      // Validate form data
      if (!formData.fullName.trim()) {
        throw new Error('Please enter your full name');
      }
      if (!formData.email.trim()) {
        throw new Error('Please enter your email');
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        throw new Error('Invalid email format');
      }

      const response = await fetch('/api/auth/update-profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Update failed');
      }

      // Update session with new user data
      await update({
        ...session,
        user: {
          ...session?.user,
          name: formData.fullName,
        },
      });

      setIsEditing(false);
      setMessage('Update successful');
    } catch (err) {
      console.error('Update error:', err);
      setMessage(err instanceof Error ? err.message : 'Update failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsEditing(true);
  };

  const handleCancelClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsEditing(false);
    setFormData({
      fullName: session?.user?.name || '',
      email: session?.user?.email || '',
      phone: '',
      address: '',
    });
  };

  // Show loading state while checking authentication
  if (status === 'loading' || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Show login form if not authenticated
  if (status === 'unauthenticated' || !session?.user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Error</CardTitle>
            <CardDescription>Please login to view your account information</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <Button onClick={() => router.push('/login')}>Login</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">Account Information</CardTitle>
            <CardDescription className="text-center">
              Manage your personal information
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            {message && (
              <div className={`mb-4 p-3 rounded ${
                message.includes('successful') 
                  ? 'bg-green-100 text-green-700' 
                  : 'bg-red-100 text-red-700'
              }`}>
                {message}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="fullName" className="text-sm font-medium">
                    Full Name
                  </label>
                  <Input
                    id="fullName"
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    disabled={!isEditing || isSubmitting}
                    placeholder="Enter your full name"
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium">
                    Email
                  </label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    disabled={!isEditing || isSubmitting}
                    placeholder="Enter your email"
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="phone" className="text-sm font-medium">
                    Phone Number
                  </label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    disabled={!isEditing || isSubmitting}
                    placeholder="Enter your phone number"
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="address" className="text-sm font-medium">
                    Address
                  </label>
                  <Input
                    id="address"
                    type="text"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    disabled={!isEditing || isSubmitting}
                    placeholder="Enter your address"
                    className="w-full"
                  />
                </div>
              </div>

              <div className="flex space-x-4 pt-6">
                {!isEditing ? (
                  <Button
                    type="button"
                    onClick={handleEditClick}
                    className="w-full bg-amber-800 hover:bg-amber-900"
                  >
                    Edit Information
                  </Button>
                ) : (
                  <>
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-amber-800 hover:bg-amber-900"
                    >
                      {isSubmitting ? 'Updating...' : 'Save Changes'}
                    </Button>
                    <Button
                      type="button"
                      onClick={handleCancelClick}
                      variant="outline"
                      className="w-full"
                    >
                      Cancel
                    </Button>
                  </>
                )}
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}