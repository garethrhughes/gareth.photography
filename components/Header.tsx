import Link from 'next/link';
import Image from 'next/image';
import { ThemeToggle } from './ThemeToggle';
import { MobileMenu } from './MobileMenu';

interface HeaderProps {
  currentPath?: string;
}

const navLinks = [
  { href: 'https://garethhughes.dev/', label: 'Blog' },
  { href: 'https://garethhughes.dev/projects/', label: 'Projects' },
  { href: 'https://garethhughes.dev/about/', label: 'About' },
  { href: '/', label: 'Photography' }
];

export default function Header({ currentPath = '' }: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 flex h-14 items-center gap-4 border-b border-border bg-surface px-4 md:px-6">
      <Link href="/" className="flex items-center gap-2.5 hover:opacity-90 transition-opacity">
        <Image
          src="/avatar.jpeg"
          alt="Gareth Hughes"
          width={32}
          height={32}
          className="rounded-full object-cover ring-2 ring-squirrel-200 dark:ring-surface-raised"
          priority
        />
        <span className="hidden sm:inline whitespace-nowrap text-base font-bold text-squirrel-800 dark:text-text-primary">
          Gareth Hughes
        </span>
      </Link>

      <nav className="hidden md:flex items-center gap-1 ml-4">
        {navLinks.map(({ href, label }) => {
          const isActive = currentPath === href;
          return (
            <Link
              key={href}
              href={href}
              className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${isActive
                  ? 'bg-surface-active text-squirrel-700'
                  : 'text-text-tertiary hover:bg-surface-hover hover:text-text-primary'
                }`}
            >
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="ml-auto flex items-center gap-1">
        <ThemeToggle />
        <Link
          href="https://instagram.com/garethhughes.photography"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Instagram"
          className="rounded-md p-2 text-text-muted transition-colors hover:bg-surface-hover hover:text-squirrel-600"
        >
          <svg role="img" viewBox="0 0 24 24" width={18} height={18} fill="currentColor" aria-hidden="true">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />,
          </svg>

        </Link>
        <MobileMenu navLinks={navLinks} />
      </div>
    </header>
  );
}
