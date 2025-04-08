import { requireAdmin } from '@/utils/auth';
import AdminProducts from '@/components/admin-products';

export default async function AdminProductsPage() {
  await requireAdmin();
  return <AdminProducts />;
} 