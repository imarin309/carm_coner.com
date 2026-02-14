/**
 * カテゴリー別記事一覧ページ（1ページ目）
 */
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import PostCard from "@/components/PostCard";
import Pagination from "@/components/Pagination";
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
    <div>
      <section>
        <h2 className="mb-6 border-b border-stone-200 pb-2 text-lg font-semibold text-stone-700">
          {category.name}の記事一覧
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
          <p className="text-stone-400">このカテゴリーにはまだ記事がありません。</p>
        )}
      </section>

      <Pagination
        currentPage={1}
        totalPages={totalPages}
        basePath={`/category/${category_name}`}
      />
    </div>
  );
}
