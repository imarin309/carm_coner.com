import Link from "next/link";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
}

export default function Pagination({ currentPage, totalPages }: PaginationProps) {
  if (totalPages <= 1) return null;

  const prevHref = currentPage === 2 ? "/" : `/page/${currentPage - 1}`;
  const nextHref = `/page/${currentPage + 1}`;

  return (
    <nav aria-label="ページネーション" className="mt-10 flex items-center justify-center gap-4">
      {currentPage > 1 ? (
        <Link
          href={prevHref}
          className="border border-stone-300 px-4 py-2 text-sm text-stone-600 transition-colors hover:bg-stone-100"
        >
          前へ
        </Link>
      ) : (
        <span className="border border-stone-200 px-4 py-2 text-sm text-stone-300">
          前へ
        </span>
      )}

      <span className="text-sm text-stone-500">
        {currentPage} / {totalPages}
      </span>

      {currentPage < totalPages ? (
        <Link
          href={nextHref}
          className="border border-stone-300 px-4 py-2 text-sm text-stone-600 transition-colors hover:bg-stone-100"
        >
          次へ
        </Link>
      ) : (
        <span className="border border-stone-200 px-4 py-2 text-sm text-stone-300">
          次へ
        </span>
      )}
    </nav>
  );
}
