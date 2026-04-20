import Link from 'next/link';
import Image from 'next/image';
import { ThemeToggle } from './ThemeToggle';
import { MobileMenu } from './MobileMenu';

const navLinks = [
  { href: 'https://garethhughes.dev', label: 'Web', external: true },
  { href: 'https://www.instagram.com/garethhughes.photography/', label: 'Instagram', external: true },
];

export default function Header() {
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
        {navLinks.map(({ href, label }) => (
          <a
            key={href}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-md px-3 py-1.5 text-sm font-medium transition-colors text-text-tertiary hover:bg-surface-hover hover:text-text-primary"
          >
            {label}
          </a>
        ))}
      </nav>

      <div className="ml-auto flex items-center gap-1">
        <ThemeToggle />
        <MobileMenu navLinks={navLinks} />
      </div>
    </header>
  );
}
