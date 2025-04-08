import { requireAdmin } from '@/utils/auth';
import CollectionProducts from '@/components/admin/collection-products';

interface Props {
  params: {
    category: string;
  };
}

// Define static paths for the categories
export async function generateStaticParams() {
  return [
    { category: 'ao-cuoi' },
    { category: 'ao-dai-co-dau' }
  ];
}

export default async function CollectionPage({ params }: Props) {
  // First check admin status
  await requireAdmin();

  const categoryMap: Record<string, string> = {
    'ao-cuoi': 'Áo cưới',
    'ao-dai-co-dau': 'Áo dài cô dâu',
  };

  // Get category from params after admin check
  const category = params.category;
  const categoryName = categoryMap[category] || 'Sản phẩm';

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-medium mb-8">Quản lý {categoryName}</h1>
      <CollectionProducts category={category} />
    </div>
  );
} 