import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import ProductList from "@/components/admin/ProductList";

export default async function AdminProductsPage() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "admin") {
    redirect("/login");
  }

  const products = await prisma.product.findMany({
    include: {
      category: true,
      images: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Product Management</h1>
        <a
          href="/admin/products/new"
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          Add New Product
        </a>
      </div>
      <ProductList products={products} />
    </div>
  );
} 