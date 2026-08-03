'use client';

import { FC, useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

import ThemeToggle from '@/components/Common/ThemeToggle';
import { cn } from '@/lib/utils';

import { navlinks } from './constant/navLinks';
import styles from './Navbar.module.css';

const Navbar: FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeHash, setActiveHash] = useState('');

  const pathname = usePathname();
  const isAdminPath = pathname.startsWith('/admin');

  useEffect(() => {
    const onScroll = () => {
      setIsScrolled(window.scrollY > 12);
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });

    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const syncHash = () => {
      setActiveHash(window.location.hash || '');
    };

    syncHash();
    window.addEventListener('hashchange', syncHash);

    return () => window.removeEventListener('hashchange', syncHash);
  }, []);

  useEffect(() => {
    if (pathname !== '/') return;

    const eventsSection = document.getElementById('events');
    if (!eventsSection) return;

    const headerElement = document.querySelector('header');

    const updateActiveSection = () => {
      const headerHeight = headerElement?.getBoundingClientRect().height ?? 0;
      const offset = headerHeight + 24;
      const rect = eventsSection.getBoundingClientRect();

      const isEventsActive = rect.top <= offset && rect.bottom > offset;
      const nextHash = isEventsActive ? '#events' : '';

      setActiveHash((currentValue) => (currentValue === nextHash ? currentValue : nextHash));
    };

    updateActiveSection();
    window.addEventListener('scroll', updateActiveSection, { passive: true });
    window.addEventListener('resize', updateActiveSection);

    return () => {
      window.removeEventListener('scroll', updateActiveSection);
      window.removeEventListener('resize', updateActiveSection);
    };
  }, [pathname]);

  useEffect(() => {
    setIsOpen(false);
    setActiveHash(window.location.hash || '');
  }, [pathname]);

  if (isAdminPath) {
    return null;
  }

  const toggleMenu = () => {
    setIsOpen((currentValue) => !currentValue);
  };

  const isExternalHref = (href: string) => /^https?:\/\//i.test(href);

  const getHashInfo = (href: string) => {
    const hashIndex = href.indexOf('#');
    if (hashIndex === -1) return null;

    return {
      basePath: href.slice(0, hashIndex) || '/',
      hash: href.slice(hashIndex),
    };
  };

  const knownHashes = navlinks.reduce<string[]>((accumulator, link) => {
    if (isExternalHref(link.path)) return accumulator;

    const hashInfo = getHashInfo(link.path);
    if (hashInfo?.hash) accumulator.push(hashInfo.hash);

    return accumulator;
  }, []);

  const handleNavItemClick = () => {
    setIsOpen(false);
  };

  const isMenuActive = (href: string) => {
    if (isExternalHref(href)) return false;

    const hashInfo = getHashInfo(href);

    if (hashInfo) {
      if (hashInfo.hash === '#events' && pathname.startsWith('/event')) {
        return true;
      }

      return pathname === hashInfo.basePath && activeHash === hashInfo.hash;
    }

    if (href === '/') {
      const hasKnownHash = activeHash !== '' && knownHashes.includes(activeHash);
      return pathname === '/' && !hasKnownHash;
    }

    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <header
      className={cn(
        'fixed left-0 top-0 z-50 flex w-full items-center border-b border-transparent transition-all duration-300',
        isScrolled
          ? 'border-border/70 bg-background/80 shadow-lg backdrop-blur-xl'
          : 'bg-transparent'
      )}
    >
      <div className="container mx-auto">
        <div className="relative flex items-center justify-between gap-4">
          <div className="px-4">
            <Link
              href="/"
              className={cn(
                'inline-flex items-center gap-3 py-4 transition-colors lg:py-5',
                isScrolled ? 'text-foreground' : 'text-white'
              )}
            >
              <span className="relative h-12 w-[180px] select-none lg:h-16 lg:w-[260px]">
                <Image
                  src="/assets/img/bashar-logo-trimmed.png"
                  alt="Bashar Production LJK"
                  fill
                  priority
                  sizes="(max-width: 1024px) 180px, 260px"
                  className={cn('object-contain', isScrolled && 'drop-shadow-sm')}
                />
              </span>
            </Link>
          </div>

          <div className="flex items-center px-4">
            <button
              type="button"
              aria-label="Toggle navigation menu"
              aria-expanded={isOpen}
              className={cn(
                'absolute right-4 flex h-10 w-10 items-center justify-center rounded-full border transition lg:hidden',
                isScrolled
                  ? 'border-border bg-card text-foreground'
                  : 'border-white/20 bg-white/10 text-white'
              )}
              onClick={toggleMenu}
            >
              <span className="sr-only">Toggle menu</span>
              <span
                className={cn(
                  styles.hamburgerLine,
                  isScrolled ? 'bg-foreground' : 'bg-white',
                  isOpen && styles.hamburgerActiveLineTop
                )}
              />
              <span
                className={cn(
                  styles.hamburgerLine,
                  isScrolled ? 'bg-foreground' : 'bg-white',
                  isOpen && styles.hamburgerActiveLineMiddle
                )}
              />
              <span
                className={cn(
                  styles.hamburgerLine,
                  isScrolled ? 'bg-foreground' : 'bg-white',
                  isOpen && styles.hamburgerActiveLineBottom
                )}
              />
            </button>

            <nav
              className={cn(
                'absolute right-4 top-full mt-3 w-[min(92vw,280px)] rounded-3xl border border-border/60 bg-background/95 p-5 shadow-2xl backdrop-blur-xl lg:static lg:mt-0 lg:block lg:w-auto lg:max-w-full lg:border-none lg:bg-transparent lg:p-0 lg:shadow-none',
                isOpen ? 'block' : 'hidden',
                'lg:block'
              )}
            >
              <ul className="flex flex-col gap-2 lg:flex-row lg:items-center lg:gap-1">
                {navlinks.map((a) => (
                  <li className="group" key={a.path}>
                    <Link
                      href={a.path}
                      onClick={handleNavItemClick}
                      className={cn(
                        styles.navLink,
                        isMenuActive(a.path) && styles.navLinkActive,
                        'flex rounded-2xl px-4 py-3 lg:px-4 lg:py-2'
                      )}
                    >
                      {a.title}
                    </Link>
                  </li>
                ))}

                <li className="mt-2 flex items-center lg:ml-3 lg:mt-0">
                  <ThemeToggle />
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
