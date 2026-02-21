import { notFound } from "next/navigation";
import { posts } from "#site/content";
import { MDXContent } from "@/components/mdx/MDXContent";
import { getCategoryName } from "@/constants/category";
import { siteName, siteUrl, siteAuthor } from "@/constants/meta";
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
    alternates: {
      canonical: `/posts/${slug}`,
    },
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

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    datePublished: new Date(post.date).toISOString(),
    url: `${siteUrl}/posts/${post.slug}`,
    ...(post.coverImage && { image: post.coverImage }),
    author: {
      "@type": "Person",
      name: siteAuthor,
      url: siteUrl,
    },
    publisher: {
      "@type": "Organization",
      name: siteName,
      url: siteUrl,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <article className="mx-auto max-w-3xl">
        <header className="mb-8 border-b border-stone-200 pb-6">
          <time className="text-xs text-stone-400">{formattedDate}</time>
          <h1 className="mt-2 text-2xl font-bold tracking-tight text-stone-800 sm:text-3xl">
            {post.title}
          </h1>
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
    </>
  );
}
