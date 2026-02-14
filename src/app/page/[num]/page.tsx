/**
 * ページネーション - 2ページ目以降の記事一覧
 */
import { redirect } from "next/navigation";
import PostList from "@/components/PostList";
import { posts } from "#site/content";
import { POSTS_PER_PAGE } from "@/constants/config";

const sortedPosts = posts.sort(
  (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
);

const totalPages = Math.ceil(sortedPosts.length / POSTS_PER_PAGE);

export function generateStaticParams() {
  if (totalPages <= 1) {
    return [{ num: "2" }];
  }
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

  if (pageNum === 1 || pageNum > totalPages) {
    redirect("/");
  }

  const start = (pageNum - 1) * POSTS_PER_PAGE;
  const pagePosts = sortedPosts.slice(start, start + POSTS_PER_PAGE);

  return (
    <>
      <PostList
        posts={pagePosts}
        title={`記事一覧 - ページ ${pageNum}`}
        currentPage={pageNum}
        totalPages={totalPages}
      />
    </>
  );
}
