/**
 * トップページ - 最新記事一覧を表示（1ページ目）
 */
import PostCard from "@/components/PostCard";
import Pagination from "@/components/Pagination";
import { posts } from "#site/content";

const POSTS_PER_PAGE = 5;

export default function Home() {
  const sortedPosts = posts.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const totalPages = Math.ceil(sortedPosts.length / POSTS_PER_PAGE);
  const pagePosts = sortedPosts.slice(0, POSTS_PER_PAGE);

  return (
    <div>
      <section>
        <h2 className="mb-6 border-b border-stone-200 pb-2 text-lg font-semibold text-stone-700">
          最新の記事
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
          <p className="text-stone-400">
            まだ記事がありません。
          </p>
        )}
      </section>

      <Pagination currentPage={1} totalPages={totalPages} />
    </div>
  );
}
