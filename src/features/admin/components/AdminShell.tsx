import type { ReactNode } from 'react';

import Container from '@/components/Layout/Container';

type Props = {
  children: ReactNode;
};

export default function AdminShell({ children }: Props) {
  return (
    <section className="min-h-screen bg-background px-4 py-24">
      <Container className="space-y-10">{children}</Container>
    </section>
  );
}
