import { requireAdmin } from '@/utils/auth';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default async function AdminDashboard() {
  await requireAdmin();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-medium mb-8">Quản lý sản phẩm</h1>
      <div className="grid gap-6 md:grid-cols-2">
        <Link href="/admin/collections/ao-cuoi">
          <Button className="w-full h-32 text-lg">
            Quản lý Áo cưới
          </Button>
        </Link>
        <Link href="/admin/collections/ao-dai-co-dau">
          <Button className="w-full h-32 text-lg">
            Quản lý Áo dài cô dâu
          </Button>
        </Link>
      </div>
    </div>
  );
} 