/**
 * カテゴリー別記事一覧ページ（1ページ目）
 */
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import PostList from "@/components/PostList";
import { posts } from "#site/content";
import { getAllCategories, getCategoryBySlug } from "@/constants/category";
import { POSTS_PER_PAGE } from "@/constants/config";

export function generateStaticParams() {
  return getAllCategories().map((category) => ({
    category_name: category.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category_name: string }>;
}): Promise<Metadata> {
  const { category_name } = await params;
  const category = getCategoryBySlug(category_name);
  if (!category) return {};
  return {
    title: `${category.name}の記事一覧`,
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category_name: string }>;
}) {
  const { category_name } = await params;
  const category = getCategoryBySlug(category_name);

  if (!category) {
    notFound();
  }

  const filteredPosts = posts
    .filter((post) => post.category === category_name)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE);
  const pagePosts = filteredPosts.slice(0, POSTS_PER_PAGE);

  return (
    <PostList
      posts={pagePosts}
      title={`${category.name}の記事一覧`}
      currentPage={1}
      totalPages={totalPages}
      basePath={`/category/${category_name}`}
    />
  );
}
