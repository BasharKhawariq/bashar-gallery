import Link from 'next/link';

import { Button } from '@/components/ui/button';

type Action = {
  href: string;
  label: string;
  variant?: 'default' | 'outline' | 'secondary' | 'ghost' | 'destructive' | 'link';
};

type Props = {
  eyebrow: string;
  title: string;
  description: string;
  primaryAction?: Action;
  secondaryAction?: Action;
};

export default function AdminPageHeader({
  eyebrow,
  title,
  description,
  primaryAction,
  secondaryAction,
}: Props) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div className="space-y-3">
        <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground">{eyebrow}</p>
        <h1 className="text-4xl font-black tracking-tight md:text-6xl">{title}</h1>
        <p className="max-w-3xl text-sm leading-6 text-muted-foreground">{description}</p>
      </div>

      <div className="flex flex-wrap gap-3">
        {secondaryAction ? (
          <Button asChild variant={secondaryAction.variant ?? 'outline'} className="rounded-2xl">
            <Link href={secondaryAction.href}>{secondaryAction.label}</Link>
          </Button>
        ) : null}

        {primaryAction ? (
          <Button asChild variant={primaryAction.variant ?? 'default'} className="rounded-2xl">
            <Link href={primaryAction.href}>{primaryAction.label}</Link>
          </Button>
        ) : null}
      </div>
    </div>
  );
}
