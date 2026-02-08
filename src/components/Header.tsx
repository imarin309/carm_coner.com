import Image from "next/image";
import Link from "next/link";
import { siteName, siteCatchCopy } from "@/constants/meta";

export default function Header() {
  return (
    <header className="relative h-48 w-full overflow-hidden sm:h-64">
      <Image
        src="/header.jpeg"
        alt="Calm Corner"
        fill
        className="object-cover"
        priority
      />
      <div className="absolute inset-0 bg-stone-900/30" />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <Link
            href="/"
            className="text-2xl font-bold tracking-wider text-white drop-shadow-lg transition-opacity hover:opacity-80 sm:text-3xl"
          >
            {siteName}
          </Link>
          <p className="mt-1 text-sm tracking-wide text-stone-200 drop-shadow sm:text-base">
            {siteCatchCopy}
          </p>
        </div>
      </div>
    </header>
  );
}
