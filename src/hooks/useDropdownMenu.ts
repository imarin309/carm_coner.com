"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export function useDropdownMenu(itemCount: number) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const itemRefs = useRef<(HTMLAnchorElement | null)[]>([]);

  const close = useCallback(() => {
    setIsOpen(false);
    buttonRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    function handleClickOutside(event: MouseEvent) {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node)
      ) {
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
          close();
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
        itemRefs.current[(currentIndex + 1) % itemCount]?.focus();
        break;
      case "ArrowUp":
        event.preventDefault();
        if (currentIndex <= 0) {
          close();
        } else {
          itemRefs.current[currentIndex - 1]?.focus();
        }
        break;
      case "Escape":
        event.preventDefault();
        close();
        break;
      case "Tab":
        setIsOpen(false);
        break;
    }
  }

  return {
    isOpen,
    setIsOpen,
    menuRef,
    buttonRef,
    itemRefs,
    close,
    handleButtonKeyDown,
    handleMenuKeyDown,
  };
}
