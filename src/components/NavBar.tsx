"use client";

import Link from "next/link";
import { getAllCategories } from "@/constants/category";
import { siteInstagramUrl, siteXUrl } from "@/constants/meta";
import { useCallback, useEffect, useRef, useState } from "react";

const categories = getAllCategories();

const externalLinks = [
  { label: "X", href: siteXUrl },
  { label: "Instagram", href: siteInstagramUrl },
];

export default function NavBar() {
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const categoryMenuRef = useRef<HTMLDivElement>(null);
  const categoryButtonRef = useRef<HTMLButtonElement>(null);
  const categoryItemRefs = useRef<(HTMLAnchorElement | null)[]>([]);

  const [isLinksOpen, setIsLinksOpen] = useState(false);
  const linksMenuRef = useRef<HTMLDivElement>(null);
  const linksButtonRef = useRef<HTMLButtonElement>(null);
  const linksItemRefs = useRef<(HTMLAnchorElement | null)[]>([]);

  const closeCategoryMenu = useCallback(() => {
    setIsCategoryOpen(false);
    categoryButtonRef.current?.focus();
  }, []);

  const closeLinksMenu = useCallback(() => {
    setIsLinksOpen(false);
    linksButtonRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!isCategoryOpen) return;
    function handleClickOutside(event: MouseEvent) {
      if (
        categoryMenuRef.current &&
        !categoryMenuRef.current.contains(event.target as Node)
      ) {
        setIsCategoryOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isCategoryOpen]);

  useEffect(() => {
    if (!isLinksOpen) return;
    function handleClickOutside(event: MouseEvent) {
      if (
        linksMenuRef.current &&
        !linksMenuRef.current.contains(event.target as Node)
      ) {
        setIsLinksOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isLinksOpen]);

  function handleCategoryButtonKeyDown(event: React.KeyboardEvent) {
    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        setIsCategoryOpen(true);
        requestAnimationFrame(() => categoryItemRefs.current[0]?.focus());
        break;
      case "Escape":
        if (isCategoryOpen) {
          event.preventDefault();
          closeCategoryMenu();
        }
        break;
    }
  }

  function handleCategoryMenuKeyDown(event: React.KeyboardEvent) {
    const currentIndex = categoryItemRefs.current.findIndex(
      (ref) => ref === document.activeElement,
    );

    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        if (currentIndex < 0) return;
        categoryItemRefs.current[
          (currentIndex + 1) % categories.length
        ]?.focus();
        break;
      case "ArrowUp":
        event.preventDefault();
        if (currentIndex <= 0) {
          closeCategoryMenu();
        } else {
          categoryItemRefs.current[currentIndex - 1]?.focus();
        }
        break;
      case "Escape":
        event.preventDefault();
        closeCategoryMenu();
        break;
      case "Tab":
        setIsCategoryOpen(false);
        break;
    }
  }

  function handleLinksButtonKeyDown(event: React.KeyboardEvent) {
    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        setIsLinksOpen(true);
        requestAnimationFrame(() => linksItemRefs.current[0]?.focus());
        break;
      case "Escape":
        if (isLinksOpen) {
          event.preventDefault();
          closeLinksMenu();
        }
        break;
    }
  }

  function handleLinksMenuKeyDown(event: React.KeyboardEvent) {
    const currentIndex = linksItemRefs.current.findIndex(
      (ref) => ref === document.activeElement,
    );

    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        if (currentIndex < 0) return;
        linksItemRefs.current[
          (currentIndex + 1) % externalLinks.length
        ]?.focus();
        break;
      case "ArrowUp":
        event.preventDefault();
        if (currentIndex <= 0) {
          closeLinksMenu();
        } else {
          linksItemRefs.current[currentIndex - 1]?.focus();
        }
        break;
      case "Escape":
        event.preventDefault();
        closeLinksMenu();
        break;
      case "Tab":
        setIsLinksOpen(false);
        break;
    }
  }

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
            onMouseEnter={() => setIsCategoryOpen(true)}
            onMouseLeave={() => {
              if (!categoryMenuRef.current?.contains(document.activeElement)) {
                setIsCategoryOpen(false);
              }
            }}
          >
            <button
              ref={categoryButtonRef}
              aria-expanded={isCategoryOpen}
              aria-haspopup="true"
              onClick={() => setIsCategoryOpen((prev) => !prev)}
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
                      onClick={() => setIsCategoryOpen(false)}
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
            onMouseEnter={() => setIsLinksOpen(true)}
            onMouseLeave={() => {
              if (!linksMenuRef.current?.contains(document.activeElement)) {
                setIsLinksOpen(false);
              }
            }}
          >
            <button
              ref={linksButtonRef}
              aria-expanded={isLinksOpen}
              aria-haspopup="true"
              onClick={() => setIsLinksOpen((prev) => !prev)}
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
                      onClick={() => setIsLinksOpen(false)}
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
