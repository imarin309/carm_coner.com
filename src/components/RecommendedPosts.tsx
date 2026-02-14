import { posts } from "#site/content";
import RecommendedPostsClient, {
  type PostSummary,
} from "./RecommendedPostsClient";

export default function RecommendedPosts() {
  const candidates: PostSummary[] = posts
    .filter((post) => !post.noindex)
    .map(({ title, slug, date, coverImage, category }) => ({
      title,
      slug,
      date,
      coverImage,
      category,
    }));

  return <RecommendedPostsClient posts={candidates} />;
}
