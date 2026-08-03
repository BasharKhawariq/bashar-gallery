'use client';

import type { ReactNode } from 'react';
import { useFormStatus } from 'react-dom';

import { Button } from '@/components/ui/button';

type Props = {
  children: ReactNode;
  pendingLabel?: string;
  variant?: 'default' | 'outline' | 'secondary' | 'ghost' | 'destructive' | 'link';
  className?: string;
  forcePending?: boolean;
};

export default function AdminSubmitButton({
  children,
  pendingLabel = 'Saving...',
  variant = 'default',
  className,
  forcePending = false,
}: Props) {
  const { pending } = useFormStatus();

  const isPending = pending || forcePending;

  return (
    <Button type="submit" variant={variant} className={className} disabled={isPending}>
      {isPending ? pendingLabel : children}
    </Button>
  );
}
