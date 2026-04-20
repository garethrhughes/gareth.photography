'use client';

import { useState, useEffect } from 'react';
import { Moon, Sun } from 'lucide-react';

export function ThemeToggle() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    setDark(document.documentElement.classList.contains('dark'));
  }, []);

  function toggle() {
    const next = !dark;
    setDark(next);
    if (next) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('gh-theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('gh-theme', 'light');
    }
  }

  return (
    <button
      onClick={toggle}
      aria-label="Toggle dark mode"
      className="cursor-pointer rounded p-1.5 text-text-muted hover:bg-surface-hover hover:text-squirrel-400 transition-colors"
    >
      {dark ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );
}
