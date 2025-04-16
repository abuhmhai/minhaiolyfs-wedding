import { requireAdmin } from '@/utils/auth';
import CollectionProducts from '@/components/admin/collection-products';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';

interface CollectionPageProps {
  params: {
    category: string;
  };
}

// Define static paths for the categories
export async function generateStaticParams() {
  return [
    { category: 'ball-gown' },
    { category: 'a-line' },
    { category: 'mermaid' },
    { category: 'ao-dai-co-dau' }
  ];
}

async function CategoryContent({ category }: { category: string }) {
  const categoryMap: Record<string, string> = {
    'ball-gown': 'Ball Gown',
    'a-line': 'A-Line',
    'mermaid': 'Mermaid',
    'ao-dai-co-dau': 'Áo dài cô dâu',
  };

  // Validate category
  if (!Object.prototype.hasOwnProperty.call(categoryMap, category)) {
    notFound();
  }

  const categoryName = categoryMap[category];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-medium mb-8">Quản lý {categoryName}</h1>
      <CollectionProducts category={category} />
    </div>
  );
}

export default async function CollectionPage({ params }: CollectionPageProps) {
  // First check admin status
  await requireAdmin();

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CategoryContent category={params.category} />
    </Suspense>
  );
} 