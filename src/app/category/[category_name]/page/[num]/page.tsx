/**
 * カテゴリー別記事一覧 - ページネーション（2ページ目以降）
 */
import { redirect, notFound } from "next/navigation";
import PostList from "@/components/PostList";
import { posts } from "#site/content";
import { getAllCategories, getCategoryBySlug } from "@/constants/category";
import { POSTS_PER_PAGE } from "@/constants/config";

export function generateStaticParams() {
  const allParams: { category_name: string; num: string }[] = [];

  for (const category of getAllCategories()) {
    const count = posts.filter(
      (post) => post.category === category.slug,
    ).length;
    const totalPages = Math.ceil(count / POSTS_PER_PAGE);

    if (totalPages <= 1) {
      allParams.push({ category_name: category.slug, num: "2" });
    } else {
      for (let i = 2; i <= totalPages; i++) {
        allParams.push({ category_name: category.slug, num: String(i) });
      }
    }
  }

  return allParams;
}

export default async function CategoryPaginatedPage({
  params,
}: {
  params: Promise<{ category_name: string; num: string }>;
}) {
  const { category_name, num } = await params;
  const category = getCategoryBySlug(category_name);

  if (!category) {
    notFound();
  }

  const filteredPosts = posts
    .filter((post) => post.category === category_name)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE);
  const pageNum = Number(num);

  if (pageNum === 1 || pageNum > totalPages) {
    redirect(`/category/${category_name}`);
  }

  const start = (pageNum - 1) * POSTS_PER_PAGE;
  const pagePosts = filteredPosts.slice(start, start + POSTS_PER_PAGE);

  return (
    <PostList
      posts={pagePosts}
      title={`${category.name}の記事一覧 - ページ ${pageNum}`}
      currentPage={pageNum}
      totalPages={totalPages}
      basePath={`/category/${category_name}`}
    />
  );
}
