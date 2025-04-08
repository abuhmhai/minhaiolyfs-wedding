import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function UnauthorizedPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-md mx-auto text-center">
        <h1 className="text-2xl font-medium mb-4">Không được phép truy cập</h1>
        <p className="text-gray-600 mb-8">
          Bạn không có quyền truy cập trang này. Vui lòng liên hệ quản trị viên nếu bạn cần quyền truy cập.
        </p>
        <Link href="/">
          <Button>Quay lại trang chủ</Button>
        </Link>
      </div>
    </div>
  );
} 