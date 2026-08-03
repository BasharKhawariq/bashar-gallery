'use client';

import { usePathname } from 'next/navigation';

import Container from '../Container';

export default function Footer() {
  const pathname = usePathname();

  if (pathname.startsWith('/admin')) {
    return null;
  }

  return (
    <footer className="border-t border-border/70 bg-card/30 py-10 backdrop-blur-sm">
      <Container>
        <div className="flex flex-col items-center justify-between gap-6 text-center md:flex-row md:text-left">
          <div>
            <h2 className="text-lg font-bold tracking-[0.25em] text-foreground">BASHAR GALLERY</h2>

            <p className="mt-2 max-w-sm text-sm leading-6 text-muted-foreground">
              Automotive Event Preview Platform
            </p>
          </div>

          <p className="text-sm text-muted-foreground">
            © 2026 Bashar Gallery. All rights reserved.
          </p>
        </div>
      </Container>
    </footer>
  );
}
