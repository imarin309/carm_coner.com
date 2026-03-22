import Link from "next/link";
import { siteName } from "@/constants/meta";

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-stone-200 bg-stone-800 py-6 text-center">
      <div className="flex items-center justify-center gap-4">
        <Link
          href="/privacy-policy"
          className="text-xs text-stone-500 underline transition-colors hover:text-stone-300"
        >
          プライバシーポリシー
        </Link>
      </div>
      <p className="mt-2 text-sm text-stone-400">
        &copy; {new Date().getFullYear()} {siteName}
      </p>
    </footer>
  );
}
