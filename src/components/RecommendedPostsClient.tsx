"use client";

import { useEffect, useMemo, useState } from "react";
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

function Skeleton({ count }: { count: number }) {
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {Array.from({ length: count }, (_, i) => (
        <div
          key={i}
          className="animate-pulse overflow-hidden border border-stone-200 bg-white"
        >
          <div className="aspect-[1200/675] bg-stone-200" />
          <div className="p-4">
            <div className="h-3 w-20 rounded bg-stone-200" />
            <div className="mt-3 h-5 w-3/4 rounded bg-stone-200" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function RecommendedPostsClient({
  posts,
  count = 3,
  selectPosts = randomSelect,
}: RecommendedPostsClientProps) {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const selected = useMemo(
    () => (mounted ? selectPosts(posts, count) : []),
    // eslint-disable-next-line react-hooks/exhaustive-deps -- pathname triggers re-shuffle on navigation
    [mounted, posts, count, selectPosts, pathname],
  );

  return (
    <section className="py-10">
      <div className="mx-auto max-w-4xl px-4">
        <h2 className="mb-6 text-lg font-semibold text-stone-700">
          こちらもおすすめ
        </h2>
        {!mounted ? (
          <Skeleton count={count} /> // SSR/静的HTMLではランダム選択ができないため、マウントまでの間にスケルトンを表示してハイドレーションミスマッチを防ぐ
        ) : selected.length > 0 ? (
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
        ) : null}
      </div>
    </section>
  );
}
