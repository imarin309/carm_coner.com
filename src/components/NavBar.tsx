import Link from "next/link";

export default function NavBar() {
  return (
    <nav className="border-b border-stone-200 bg-white/90 backdrop-blur-sm">
      <div className="mx-auto max-w-4xl px-4 py-3">
        <div className="flex gap-6 text-sm font-medium">
          <Link
            href="/"
            className="text-stone-600 transition-colors hover:text-stone-900"
          >
            Home
          </Link>
          <Link
            href="/about"
            className="text-stone-600 transition-colors hover:text-stone-900"
          >
            about
          </Link>
        </div>
      </div>
    </nav>
  );
}
