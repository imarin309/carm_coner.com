import PostCard from "@/components/PostCard";
import Pagination from "@/components/Pagination";

interface Post {
  title: string;
  description?: string;
  date: string;
  slug: string;
  coverImage?: string;
  category: string;
}

interface PostListProps {
  posts: Post[];
  title: string;
  currentPage: number;
  totalPages: number;
  basePath?: string;
}

export default function PostList({
  posts,
  title,
  currentPage,
  totalPages,
  basePath,
}: PostListProps) {
  return (
    <div>
      <section>
        <h2 className="mb-6 border-b border-stone-200 pb-2 text-lg font-semibold text-stone-700">
          {title}
        </h2>
        {posts.length > 0 ? (
          <div className="grid gap-6">
            {posts.map((post) => (
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

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        basePath={basePath}
      />
    </div>
  );
}
