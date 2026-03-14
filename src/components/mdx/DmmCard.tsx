import Image from "next/image";
import { dmmAfId } from "@/constants/meta";

function fixAfId(href: string): string {
  return href.replace(/af_id=[^&]+/, `af_id=${dmmAfId}`);
}

interface DmmCardProps {
  href: string;
  imgSrc: string;
  title: string;
  price: string;
}

interface DmmCardImageProps {
  href: string;
  imgSrc: string;
  title: string;
}

export function DmmCard({ href, imgSrc, title, price }: DmmCardProps) {
  return (
    <div className="not-prose my-6 rounded-xl border border-accent overflow-hidden shadow-sm relative">
      <span className="absolute top-1.5 left-2 text-[10px] font-medium text-gray-400 leading-none">
        ads
      </span>
      <a
        href={fixAfId(href)}
        target="_blank"
        rel="nofollow sponsored noopener"
        className="flex gap-4 p-4 bg-white hover:bg-accent/30 transition-colors"
      >
        <Image
          src={imgSrc}
          alt={title}
          width={112}
          height={112}
          className="w-28 h-28 object-contain flex-shrink-0"
          unoptimized
        />
        <div className="flex flex-col justify-between min-w-0">
          <p className="text-sm font-medium text-foreground leading-relaxed line-clamp-3">
            {title}
          </p>
          <div>
            <p className="text-sm font-bold text-primary mt-2">{price}</p>
            <div className="mt-2 inline-flex items-center gap-2 bg-[#d11d1d] text-white text-xs font-medium px-4 py-1.5 rounded-full">
              DMMで購入
            </div>
          </div>
        </div>
      </a>
    </div>
  );
}

export function DmmCardImage({ href, imgSrc, title }: DmmCardImageProps) {
  return (
    <div className="not-prose my-6 flex justify-center">
      <div className="relative inline-block">
        <span className="absolute top-1.5 left-2 text-[10px] font-medium text-gray-400 leading-none z-10">
          ads
        </span>
        <a href={fixAfId(href)} target="_blank" rel="nofollow sponsored noopener">
          <Image
            src={imgSrc}
            alt={title}
            width={400}
            height={400}
            className="object-contain"
            unoptimized
          />
        </a>
      </div>
    </div>
  );
}
