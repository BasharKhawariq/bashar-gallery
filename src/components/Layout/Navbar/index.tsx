'use client';

import { FC, useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import ThemeToggle from '@/components/Common/ThemeToggle';
import { cn } from '@/lib/utils';

import { navlinks } from './constant/navLinks';
import styles from './Navbar.module.css';

const Navbar: FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const pathname = usePathname();

  useEffect(() => {
    window.onscroll = () => {
      const header = document.querySelector('header');
      const fixNav = header?.offsetTop ?? 0;

      if (window.pageYOffset > fixNav) {
        header?.classList.add(styles.navbarFixed);
      } else {
        header?.classList.remove(styles.navbarFixed);
      }
    };
  }, []);

  const hamburgerHandler = () => {
    const hamburger = document.querySelector('#hamburger');
    const navMenu = document.querySelector('#navMenu');

    setIsOpen(!isOpen);

    if (isOpen) {
      hamburger?.classList.remove(styles.hamburgerActive);
      navMenu?.classList.add('hidden');
    } else {
      hamburger?.classList.add(styles.hamburgerActive);
      navMenu?.classList.remove('hidden');
    }
  };

  const isMenuActive = (path: string) => {
    const isHomePage = pathname === '/' && path === '/';

    if (isHomePage) {
      return true;
    }

    return pathname !== '/' && path !== '/' && pathname.includes(path);
  };

  return (
    <header className="absolute left-0 top-0 z-50 flex w-full items-center bg-transparent">
      <div className="container mx-auto">
        <div className="relative flex items-center justify-between">
          <div className="px-4">
            <Link
              href="/"
              className="inline-flex items-center gap-2 py-6 text-xl font-bold tracking-wide text-white lg:text-2xl"
            >
              BASHAR GALLERY
            </Link>
          </div>

          <div className="flex items-center px-4">
            <button
              id="hamburger"
              name="hamburger"
              type="button"
              className="absolute right-4 block lg:hidden"
              onClick={hamburgerHandler}
            >
              <span
                className={`${styles.hamburgerLine} origin-top-left`}
              ></span>

              <span className={styles.hamburgerLine}></span>

              <span
                className={`${styles.hamburgerLine} origin-bottom-left`}
              ></span>
            </button>

            <nav
              id="navMenu"
              className="absolute right-4 top-full hidden w-full max-w-[250px] rounded-2xl border border-white/10 bg-zinc-950 p-5 shadow-2xl lg:static lg:block lg:max-w-full lg:border-none lg:bg-transparent lg:p-0 lg:shadow-none"
            >
              <ul className="block lg:flex lg:items-center">
                {navlinks.map((a, i) => (
                  <li
                    className="group"
                    key={i}
                  >
                    <Link
                      href={a.path}
                      className={cn(
                        styles.navLink,
                        isMenuActive(a.path) &&
                          styles.navLinkActive,
                        'mx-8 flex lg:mx-4'
                      )}
                    >
                      {a.title}
                    </Link>
                  </li>
                ))}

                <li className="ml-8 mt-4 flex items-center lg:ml-4 lg:mt-0">
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