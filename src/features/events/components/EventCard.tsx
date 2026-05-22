import Link from 'next/link';

import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

import type { Event } from '../types/event';

type Props = {
  event: Event;
  className?: string;
};

export default function EventCard({ event, className }: Props) {
  return (
    <Link
      href={`/event/${event.slug}`}
      aria-label={`Open event ${event.title}`}
      className="block rounded-3xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
    >
      <Card
        className={cn(
          'group gap-0 rounded-3xl bg-card/70 p-0 shadow-lg transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:ring-2 hover:ring-ring/20',
          className
        )}
      >
        <img
          src={event.cover}
          alt={event.title}
          loading="lazy"
          decoding="async"
          className="h-[320px] w-full object-cover transition duration-700 group-hover:scale-105"
        />

        <CardContent className="space-y-2 p-6">
          <p className="text-sm uppercase tracking-[0.25em] text-muted-foreground">{event.date}</p>

          <h3 className="text-2xl font-bold leading-tight">{event.title}</h3>

          <p className="text-sm text-muted-foreground">{event.location}</p>
        </CardContent>
      </Card>
    </Link>
  );
}
