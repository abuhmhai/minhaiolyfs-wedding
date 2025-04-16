import { requireAdmin } from '@/utils/auth';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default async function AdminDashboard() {
  await requireAdmin();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-medium mb-8">Quản lý sản phẩm</h1>
      
      {/* Áo cưới section */}
      <div className="mb-8">
        <h2 className="text-xl font-medium mb-4">Áo cưới</h2>
        <div className="grid gap-4 md:grid-cols-3">
          <Link href="/admin/collections/ball-gown">
            <Button className="w-full h-24 text-lg">
              Ball Gown
            </Button>
          </Link>
          <Link href="/admin/collections/a-line">
            <Button className="w-full h-24 text-lg">
              A-Line
            </Button>
          </Link>
          <Link href="/admin/collections/mermaid">
            <Button className="w-full h-24 text-lg">
              Mermaid
            </Button>
          </Link>
        </div>
      </div>

      {/* Áo dài section */}
      <div>
        <h2 className="text-xl font-medium mb-4">Áo dài</h2>
        <div className="grid gap-4">
          <Link href="/admin/collections/ao-dai-co-dau">
            <Button className="w-full h-24 text-lg">
              Áo dài cô dâu
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
} 