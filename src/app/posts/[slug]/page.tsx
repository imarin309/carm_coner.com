import { notFound } from "next/navigation";
import { posts } from "#site/content";
import { MDXContent } from "@/components/mdx/MDXContent";
import { getCategoryName } from "@/constants/category";
import type { Metadata } from "next";

interface PostPageProps {
  params: Promise<{ slug: string }>;
}

function getPostBySlug(slug: string) {
  return posts.find((post) => post.slug === slug);
}

export async function generateMetadata({
  params,
}: PostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    return {};
  }

  return {
    title: post.title,
    description: post.description,
    robots: post.noindex ? { index: false, follow: false } : undefined,
    openGraph: {
      type: "article",
      title: post.title,
      description: post.description,
      ...(post.coverImage && {
        images: [{ url: post.coverImage }],
      }),
    },
  };
}

export async function generateStaticParams() {
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const formattedDate = new Date(post.date).toLocaleDateString("ja-JP", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <article className="mx-auto max-w-3xl">
      <header className="mb-8 border-b border-stone-200 pb-6">
        <time className="text-xs text-stone-400">
          {formattedDate}
        </time>
        <h1 className="mt-2 text-2xl font-bold tracking-tight text-stone-800 sm:text-3xl">
          {post.title}
        </h1>
        {post.description && (
          <p className="mt-4 text-stone-500">
            {post.description}
          </p>
        )}
        <div className="mt-4">
          <span className="bg-stone-800 px-3 py-1 text-xs text-white">
            {getCategoryName(post.category)}
          </span>
        </div>
      </header>

      <div className="prose prose-stone max-w-none prose-headings:font-semibold prose-a:text-stone-600 prose-a:underline-offset-2 hover:prose-a:text-stone-900">
        <MDXContent code={post.content} />
      </div>
    </article>
  );
}
