import { Metadata } from 'next';
import ProductDetail from '@/components/product-detail';

type Props = {
  params: { slug: string };
};

export const generateMetadata = ({ params }: Props): Metadata => {
  return {
    title: `${params.slug} | NHUNGTRANG WEDDING STORE`,
    description: 'Wedding dress and Ao dai from NHUNGTRANG WEDDING.'
  };
};

export default function ProductPage({ params }: Props) {
  return <ProductDetail slug={params.slug} />;
}
