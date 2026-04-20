'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';

interface NavLink {
  href: string;
  label: string;
  external?: boolean;
}

interface MobileMenuProps {
  navLinks: NavLink[];
}

export function MobileMenu({ navLinks }: MobileMenuProps) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  return (
    <div className="md:hidden relative" ref={menuRef}>
      <button
        onClick={() => setOpen(!open)}
        aria-label={open ? 'Close menu' : 'Open menu'}
        className="cursor-pointer rounded p-1.5 text-text-muted hover:bg-surface-hover hover:text-squirrel-400 transition-colors"
      >
        {open ? <X size={20} /> : <Menu size={20} />}
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-48 rounded-lg border border-border bg-surface shadow-lg py-1 z-50">
          {navLinks.map(({ href, label, external }) => {
            if (external) {
              return (
                <a
                  key={href}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setOpen(false)}
                  className="block px-4 py-2 text-sm font-medium transition-colors text-text-tertiary hover:bg-surface-hover hover:text-text-primary"
                >
                  {label}
                </a>
              );
            }
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                className="block px-4 py-2 text-sm font-medium transition-colors text-text-tertiary hover:bg-surface-hover hover:text-text-primary"
              >
                {label}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
