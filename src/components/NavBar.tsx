"use client";

import Link from "next/link";
import { getAllCategories } from "@/constants/category";
import { useCallback, useEffect, useRef, useState } from "react";

const categories = getAllCategories();

export default function NavBar() {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const itemRefs = useRef<(HTMLAnchorElement | null)[]>([]);

  const closeMenu = useCallback(() => {
    setIsOpen(false);
    buttonRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  function handleButtonKeyDown(event: React.KeyboardEvent) {
    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        setIsOpen(true);
        requestAnimationFrame(() => itemRefs.current[0]?.focus());
        break;
      case "Escape":
        if (isOpen) {
          event.preventDefault();
          closeMenu();
        }
        break;
    }
  }

  function handleMenuKeyDown(event: React.KeyboardEvent) {
    const currentIndex = itemRefs.current.findIndex(
      (ref) => ref === document.activeElement,
    );

    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        if (currentIndex < 0) return;
        itemRefs.current[(currentIndex + 1) % categories.length]?.focus();
        break;
      case "ArrowUp":
        event.preventDefault();
        if (currentIndex <= 0) {
          closeMenu();
        } else {
          itemRefs.current[currentIndex - 1]?.focus();
        }
        break;
      case "Escape":
        event.preventDefault();
        closeMenu();
        break;
      case "Tab":
        setIsOpen(false);
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
            ref={menuRef}
            className="relative"
            onMouseEnter={() => setIsOpen(true)}
            onMouseLeave={() => {
              if (!menuRef.current?.contains(document.activeElement)) {
                setIsOpen(false);
              }
            }}
          >
            <button
              ref={buttonRef}
              aria-expanded={isOpen}
              aria-haspopup="true"
              onClick={() => setIsOpen((prev) => !prev)}
              onKeyDown={handleButtonKeyDown}
              className="text-stone-600 transition-colors hover:text-stone-900"
            >
              Category
            </button>
            <div
              className={`absolute left-0 top-full z-50 pt-2 transition-all ${
                isOpen ? "visible opacity-100" : "invisible opacity-0"
              }`}
            >
              <ul
                role="menu"
                onKeyDown={handleMenuKeyDown}
                className="min-w-40 border border-stone-200 bg-white py-1 shadow-md"
              >
                {categories.map((category, index) => (
                  <li key={category.slug} role="none">
                    <Link
                      ref={(el) => {
                        itemRefs.current[index] = el;
                      }}
                      role="menuitem"
                      tabIndex={-1}
                      href={`/category/${category.slug}`}
                      onClick={() => setIsOpen(false)}
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
