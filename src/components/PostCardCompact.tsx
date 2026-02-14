import Image from "next/image";
import Link from "next/link";
import { getCategoryName } from "@/constants/category";

interface PostCardCompactProps {
  title: string;
  date: string;
  slug: string;
  coverImage?: string;
  category: string;
}

// PostCardCompact はdescriptionを持たないPostCard
export default function PostCardCompact({
  title,
  date,
  slug,
  coverImage,
  category,
}: PostCardCompactProps) {
  const formattedDate = new Date(date).toLocaleDateString("ja-JP", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <article className="group overflow-hidden border border-stone-200 bg-white transition-all hover:border-stone-300 hover:shadow-lg">
      <Link href={`/posts/${slug}`}>
        {coverImage && (
          <div className="relative aspect-[1200/675] overflow-hidden">
            <Image
              src={coverImage}
              alt={title}
              fill
              sizes="(min-width: 640px) 33vw, 100vw"
              className="object-cover transition-transform group-hover:scale-105"
            />
            <div className="absolute left-0 top-3">
              <span className="bg-stone-800 px-3 py-1 text-xs font-medium text-white">
                {getCategoryName(category)}
              </span>
            </div>
          </div>
        )}
        <div className="p-4">
          <time className="text-xs text-stone-400">{formattedDate}</time>
          <h2 className="mt-2 text-lg font-semibold leading-snug text-stone-700 group-hover:text-stone-900">
            {title}
          </h2>
        </div>
      </Link>
    </article>
  );
}
