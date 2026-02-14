import Link from "next/link";
import { getAllCategories } from "@/constants/category";

const categories = getAllCategories();

export default function NavBar() {
  return (
    <nav className="relative z-50 border-b border-stone-200 bg-white/90 backdrop-blur-sm">
      <div className="mx-auto max-w-4xl px-4 py-3">
        <div className="flex gap-6 text-sm font-medium">
          <Link
            href="/"
            className="text-stone-600 transition-colors hover:text-stone-900"
          >
            Home
          </Link>
          <div className="group relative">
            <button className="text-stone-600 transition-colors hover:text-stone-900">
              Category
            </button>
            <div className="invisible absolute left-0 top-full z-50 pt-2 opacity-0 transition-all group-hover:visible group-hover:opacity-100">
              <ul className="min-w-40 border border-stone-200 bg-white py-1 shadow-md">
                {categories.map((category) => (
                  <li key={category.slug}>
                    <Link
                      href={`/category/${category.slug}`}
                      className="block px-4 py-2 text-stone-600 transition-colors hover:bg-stone-50 hover:text-stone-900"
                    >
                      {category.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
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
