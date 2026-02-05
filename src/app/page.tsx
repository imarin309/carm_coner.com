/**
 * トップページ - 最新記事一覧を表示
 */
import PostCard from "@/components/PostCard";
import { posts } from "#site/content";

export default function Home() {
  const sortedPosts = posts.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <div>
      <section className="mb-10 text-center">
        <p className="text-stone-500">
          プラモデルやフィギュアリペイントの制作記録
        </p>
      </section>

      <section>
        <h2 className="mb-6 border-b border-stone-200 pb-2 text-lg font-semibold text-stone-700">
          最新の記事
        </h2>
        {sortedPosts.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2">
            {sortedPosts.map((post) => (
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
    </div>
  );
}
