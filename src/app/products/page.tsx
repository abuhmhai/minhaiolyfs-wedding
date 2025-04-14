import { Suspense } from "react";
import { prisma } from "@/lib/prisma";
import ProductList from "@/components/products/ProductList";
import SearchBar from "@/components/products/SearchBar";
import CategoryFilter from "@/components/products/CategoryFilter";

async function getCategories() {
  return prisma.category.findMany();
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const categories = await getCategories();
  const search = searchParams.search as string;
  const category = searchParams.category as string;
  const page = parseInt(searchParams.page as string) || 1;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Our Wedding Dresses</h1>
      
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="w-full md:w-1/3">
          <SearchBar />
        </div>
        <div className="w-full md:w-2/3">
          <CategoryFilter categories={categories} />
        </div>
      </div>

      <Suspense fallback={<div>Loading products...</div>}>
        <ProductList
          search={search}
          category={category}
          page={page}
        />
      </Suspense>
    </div>
  );
} 