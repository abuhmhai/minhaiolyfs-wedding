import { getProducts } from "@/actions/product";
import { getCategories } from "@/actions/category";
import ProductList from "@/components/products/ProductList";
import Pagination from "@/components/products/Pagination";
import SearchBar from "@/components/products/SearchBar";
import CategoryFilter from "@/components/products/CategoryFilter";

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const categories = await getCategories();
  const search = (await searchParams).search as string;
  const category = (await searchParams).category as string;
  const page = parseInt((await searchParams).page as string) || 1;

  const { products, totalPages } = await getProducts({
    search,
    category,
    page,
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Products</h1>
      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-1/4">
          <SearchBar />
          <CategoryFilter categories={categories} />
        </div>
        <div className="w-full md:w-3/4">
          <ProductList products={products} />
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            search={search}
            category={category}
          />
        </div>
      </div>
    </div>
  );
} 