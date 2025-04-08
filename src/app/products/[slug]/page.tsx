import { Metadata } from 'next';
import ProductDetail from '@/components/product-detail';

type Props = {
  params: { slug: string };
};

export const generateMetadata = async ({ params }: Props): Promise<Metadata> => {
  return {
    title: `Product ${params.slug}`,
  };
};

export default async function ProductPage({ params }: Props) {
  return <ProductDetail slug={params.slug} />;
}
