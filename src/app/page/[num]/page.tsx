/**
 * ページネーション - 2ページ目以降の記事一覧
 */
import { redirect } from "next/navigation";
import PostCard from "@/components/PostCard";
import Pagination from "@/components/Pagination";
import { posts } from "#site/content";

const POSTS_PER_PAGE = 5;

const sortedPosts = posts.sort(
  (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
);

const totalPages = Math.ceil(sortedPosts.length / POSTS_PER_PAGE);

export function generateStaticParams() {
  // ページ2以降のみ生成（ページ1は / で表示）
  return Array.from({ length: totalPages - 1 }, (_, i) => ({
    num: String(i + 2),
  }));
}

export default async function PaginatedPage({
  params,
}: {
  params: Promise<{ num: string }>;
}) {
  const { num } = await params;
  const pageNum = Number(num);

  if (pageNum === 1) {
    redirect("/");
  }

  const start = (pageNum - 1) * POSTS_PER_PAGE;
  const pagePosts = sortedPosts.slice(start, start + POSTS_PER_PAGE);

  return (
    <div>
      <section className="mb-10 text-center">
        <p className="text-stone-500">
          プラモデルやフィギュアリペイントの制作記録
        </p>
      </section>

      <section>
        <h2 className="mb-6 border-b border-stone-200 pb-2 text-lg font-semibold text-stone-700">
          記事一覧 - ページ {pageNum}
        </h2>
        {pagePosts.length > 0 ? (
          <div className="grid gap-6">
            {pagePosts.map((post) => (
              <PostCard
                key={post.slug}
                title={post.title}
                description={post.description}
                date={post.date}
                slug={post.slug}
                coverImage={post.coverImage}
                category={post.category}
              />
            ))}
          </div>
        ) : (
          <p className="text-stone-400">記事がありません。</p>
        )}
      </section>

      <Pagination currentPage={pageNum} totalPages={totalPages} />
    </div>
  );
}
