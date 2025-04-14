import Link from "next/link";
import { useSearchParams } from "next/navigation";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  search?: string;
  category?: string;
}

export default function Pagination({
  currentPage,
  totalPages,
  search,
  category,
}: PaginationProps) {
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams.toString());

  const createPageUrl = (page: number) => {
    params.set("page", page.toString());
    return `?${params.toString()}`;
  };

  return (
    <div className="flex justify-center gap-2">
      {currentPage > 1 && (
        <Link
          href={createPageUrl(currentPage - 1)}
          className="px-4 py-2 border rounded-md hover:bg-gray-100"
        >
          Previous
        </Link>
      )}

      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
        <Link
          key={page}
          href={createPageUrl(page)}
          className={`px-4 py-2 border rounded-md ${
            page === currentPage
              ? "bg-blue-500 text-white"
              : "hover:bg-gray-100"
          }`}
        >
          {page}
        </Link>
      ))}

      {currentPage < totalPages && (
        <Link
          href={createPageUrl(currentPage + 1)}
          className="px-4 py-2 border rounded-md hover:bg-gray-100"
        >
          Next
        </Link>
      )}
    </div>
  );
} 