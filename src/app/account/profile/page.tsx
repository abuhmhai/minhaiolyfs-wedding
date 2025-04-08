'use client';

import { useState, useEffect } from 'react';
import { useUserStore } from '@/store/userStore';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

export default function ProfilePage() {
  const user = useUserStore((state) => state.user);
  const setUser = useUserStore((state) => state.setUser);
  const updateUser = useUserStore((state) => state.updateUser);
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
      try {
        const response = await fetch('/api/auth/me');
        if (response.ok) {
          const data = await response.json();
          setUser(data.user);
          setFormData({
            fullName: data.user.fullName,
            email: data.user.email,
            phone: data.user.phone || '',
            address: data.user.address || '',
          });
        } else if (response.status === 401) {
          router.push('/account/login');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        setMessage('Có lỗi xảy ra khi tải thông tin tài khoản');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [setUser, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted, isEditing:', isEditing);
    if (!isEditing) {
      console.log('Not in edit mode, returning');
      return;
    }
    setMessage('');
    setIsSubmitting(true);

    try {
      // Validate form data
      if (!formData.fullName.trim()) {
        throw new Error('Vui lòng nhập họ và tên');
      }
      if (!formData.email.trim()) {
        throw new Error('Vui lòng nhập email');
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        throw new Error('Email không hợp lệ');
      }

      console.log('Sending update request with data:', formData);
      const response = await fetch('/api/auth/update-profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      console.log('Update response:', data);

      if (!response.ok) {
        throw new Error(data.message || 'Cập nhật thất bại');
      }

      // Update user in store
      updateUser(formData);
      setIsEditing(false);
      setMessage('Cập nhật thành công');
    } catch (err) {
      console.error('Update error:', err);
      setMessage(err instanceof Error ? err.message : 'Cập nhật thất bại');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditClick = () => {
    console.log('Edit button clicked');
    setIsEditing(true);
  };

  const handleCancelClick = () => {
    console.log('Cancel button clicked');
    setIsEditing(false);
    setFormData({
      fullName: user?.fullName || '',
      email: user?.email || '',
      phone: user?.phone || '',
      address: user?.address || '',
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Lỗi</CardTitle>
            <CardDescription>Vui lòng đăng nhập để xem thông tin tài khoản</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <Button onClick={() => router.push('/account/login')}>Đăng nhập</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Thông tin tài khoản</CardTitle>
          <CardDescription className="text-center">
            Quản lý thông tin cá nhân của bạn
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          {message && (
            <div className={`mb-4 p-3 rounded ${
              message.includes('thành công') 
                ? 'bg-green-100 text-green-700' 
                : 'bg-red-100 text-red-700'
            }`}>
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="fullName" className="text-sm font-medium">
                Họ và tên
              </label>
              <Input
                id="fullName"
                type="text"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                disabled={!isEditing || isSubmitting}
                placeholder="Nhập họ và tên của bạn"
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
                placeholder="Nhập email của bạn"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="phone" className="text-sm font-medium">
                Số điện thoại
              </label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                disabled={!isEditing || isSubmitting}
                placeholder="Nhập số điện thoại của bạn"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="address" className="text-sm font-medium">
                Địa chỉ
              </label>
              <Input
                id="address"
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                disabled={!isEditing || isSubmitting}
                placeholder="Nhập địa chỉ của bạn"
              />
            </div>

            <div className="flex space-x-4 pt-4">
              {!isEditing ? (
                <Button
                  type="button"
                  onClick={handleEditClick}
                  className="w-full"
                >
                  Chỉnh sửa
                </Button>
              ) : (
                <>
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Đang lưu...
                      </>
                    ) : (
                      'Lưu thay đổi'
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCancelClick}
                    className="w-full"
                    disabled={isSubmitting}
                  >
                    Hủy
                  </Button>
                </>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
} 