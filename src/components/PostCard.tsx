import Image from "next/image";
import Link from "next/link";
import { getCategoryName } from "@/constants/category";

interface PostCardProps {
  title: string;
  description?: string;
  date: string;
  slug: string;
  coverImage?: string;
  category: string;
}

export default function PostCard({
  title,
  description,
  date,
  slug,
  coverImage,
  category,
}: PostCardProps) {
  const formattedDate = new Date(date).toLocaleDateString("ja-JP", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <article className="group overflow-hidden border border-stone-200 bg-white transition-all hover:border-stone-300 hover:shadow-lg">
      <Link href={`/posts/${slug}`} className="sm:flex">
        {coverImage && (
          <div className="relative overflow-hidden sm:w-72 sm:shrink-0">
            <Image
              src={coverImage}
              alt={title}
              width={1200}
              height={675}
              className="h-auto w-full transition-transform group-hover:scale-105"
            />
            <div className="absolute left-0 top-3">
              <span className="bg-stone-800 px-3 py-1 text-xs font-medium text-white">
                {getCategoryName(category)}
              </span>
            </div>
          </div>
        )}
        <div className="p-4 sm:flex sm:flex-col sm:justify-center">
          <time className="text-xs text-stone-400">
            {formattedDate}
          </time>
          <h2 className="mt-2 text-lg font-semibold leading-snug text-stone-700 group-hover:text-stone-900">
            {title}
          </h2>
          {description && (
            <p className="mt-2 line-clamp-2 text-sm text-stone-500">
              {description}
            </p>
          )}
        </div>
      </Link>
    </article>
  );
}
