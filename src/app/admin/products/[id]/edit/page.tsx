import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { notFound } from "next/navigation";
import ProductForm from "@/components/admin/ProductForm";

interface EditProductPageProps {
  params: {
    id: string;
  };
}

export default async function EditProductPage({ params }: EditProductPageProps) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "admin") {
    redirect("/login");
  }

  const [product, categories] = await Promise.all([
    prisma.product.findUnique({
      where: { id: parseInt(params.id) },
      include: {
        images: true,
      },
    }),
    prisma.category.findMany({
      orderBy: {
        name: "asc",
      },
    }),
  ]);

  if (!product) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Edit Product</h1>
      <ProductForm product={product} categories={categories} />
    </div>
  );
} 