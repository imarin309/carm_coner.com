"use client";

import { useMemo } from "react";
import { usePathname } from "next/navigation";
import PostCardCompact from "./PostCardCompact";

export type PostSummary = {
  title: string;
  slug: string;
  date: string;
  coverImage?: string;
  category: string;
};

export type PostSelector = (
  posts: PostSummary[],
  count: number,
) => PostSummary[];

const randomSelect: PostSelector = (posts, count) => {
  const shuffled = [...posts].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
};

interface RecommendedPostsClientProps {
  posts: PostSummary[];
  count?: number;
  selectPosts?: PostSelector;
}

export default function RecommendedPostsClient({
  posts,
  count = 3,
  selectPosts = randomSelect,
}: RecommendedPostsClientProps) {
  const pathname = usePathname();
  const selected = useMemo(() => {
    // pathname is referenced so that recommendations are re-shuffled on navigation
    void pathname;
    return selectPosts(posts, count);
  }, [posts, count, selectPosts, pathname]);

  if (selected.length === 0) return null;

  return (
    <section className="py-10">
      <div className="mx-auto max-w-4xl px-4">
        <h2 className="mb-6 text-lg font-semibold text-stone-700">
          こちらもおすすめ
        </h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {selected.map((post) => (
            <PostCardCompact
              key={post.slug}
              title={post.title}
              date={post.date}
              slug={post.slug}
              coverImage={post.coverImage}
              category={post.category}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
