"use client";

import Link from "next/link";
import { getAllCategories } from "@/constants/category";
import { siteInstagramUrl, siteXUrl } from "@/constants/meta";
import { useDropdownMenu } from "@/hooks/useDropdownMenu";

const categories = getAllCategories();

const externalLinks = [
  { label: "X", href: siteXUrl },
  { label: "Instagram", href: siteInstagramUrl },
];

export default function NavBar() {
  const {
    isOpen: isCategoryOpen,
    setIsOpen: setCategoryOpen,
    menuRef: categoryMenuRef,
    buttonRef: categoryButtonRef,
    itemRefs: categoryItemRefs,
    handleButtonKeyDown: handleCategoryButtonKeyDown,
    handleMenuKeyDown: handleCategoryMenuKeyDown,
  } = useDropdownMenu(categories.length);

  const {
    isOpen: isLinksOpen,
    setIsOpen: setLinksOpen,
    menuRef: linksMenuRef,
    buttonRef: linksButtonRef,
    itemRefs: linksItemRefs,
    handleButtonKeyDown: handleLinksButtonKeyDown,
    handleMenuKeyDown: handleLinksMenuKeyDown,
  } = useDropdownMenu(externalLinks.length);

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
          <div
            ref={categoryMenuRef}
            className="relative"
            onMouseEnter={() => setCategoryOpen(true)}
            onMouseLeave={() => {
              if (!categoryMenuRef.current?.contains(document.activeElement)) {
                setCategoryOpen(false);
              }
            }}
          >
            <button
              ref={categoryButtonRef}
              aria-expanded={isCategoryOpen}
              aria-haspopup="true"
              onClick={() => setCategoryOpen((prev) => !prev)}
              onKeyDown={handleCategoryButtonKeyDown}
              className="text-stone-600 transition-colors hover:text-stone-900"
            >
              Category
            </button>
            <div
              className={`absolute left-0 top-full z-50 pt-2 transition-all ${
                isCategoryOpen ? "visible opacity-100" : "invisible opacity-0"
              }`}
            >
              <ul
                role="menu"
                onKeyDown={handleCategoryMenuKeyDown}
                className="min-w-40 border border-stone-200 bg-white py-1 shadow-md"
              >
                {categories.map((category, index) => (
                  <li key={category.slug} role="none">
                    <Link
                      ref={(el) => {
                        categoryItemRefs.current[index] = el;
                      }}
                      role="menuitem"
                      tabIndex={-1}
                      href={`/category/${category.slug}`}
                      onClick={() => setCategoryOpen(false)}
                      className="block px-4 py-2 text-stone-600 transition-colors hover:bg-stone-50 hover:text-stone-900"
                    >
                      {category.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div
            ref={linksMenuRef}
            className="relative"
            onMouseEnter={() => setLinksOpen(true)}
            onMouseLeave={() => {
              if (!linksMenuRef.current?.contains(document.activeElement)) {
                setLinksOpen(false);
              }
            }}
          >
            <button
              ref={linksButtonRef}
              aria-expanded={isLinksOpen}
              aria-haspopup="true"
              onClick={() => setLinksOpen((prev) => !prev)}
              onKeyDown={handleLinksButtonKeyDown}
              className="text-stone-600 transition-colors hover:text-stone-900"
            >
              Links
            </button>
            <div
              className={`absolute left-0 top-full z-50 pt-2 transition-all ${
                isLinksOpen ? "visible opacity-100" : "invisible opacity-0"
              }`}
            >
              <ul
                role="menu"
                onKeyDown={handleLinksMenuKeyDown}
                className="min-w-40 border border-stone-200 bg-white py-1 shadow-md"
              >
                {externalLinks.map(({ label, href }, index) => (
                  <li key={label} role="none">
                    <a
                      ref={(el) => {
                        linksItemRefs.current[index] = el;
                      }}
                      role="menuitem"
                      tabIndex={-1}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${label}（新しいタブで開く）`}
                      onClick={() => setLinksOpen(false)}
                      className="block px-4 py-2 text-stone-600 transition-colors hover:bg-stone-50 hover:text-stone-900"
                    >
                      {label}
                    </a>
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
          <Link
            href="/contact"
            className="text-stone-600 transition-colors hover:text-stone-900"
          >
            contact
          </Link>
        </div>
      </div>
    </nav>
  );
}
