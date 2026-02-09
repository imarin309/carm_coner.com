import type { MetadataRoute } from "next";
import { posts } from "#site/content";
import { siteUrl } from "@/constants/meta";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const postEntries = posts
    .filter((post) => !post.noindex)
    .map((post) => ({
      url: `${siteUrl}/posts/${post.slug}`,
      lastModified: new Date(post.date),
    }));

  const latestPost = posts
    .filter((post) => !post.noindex)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .at(0);

  return [
    {
      url: siteUrl,
      ...(latestPost && { lastModified: new Date(latestPost.date) }),
    },
    { url: `${siteUrl}/about` },
    ...postEntries,
  ];
}
