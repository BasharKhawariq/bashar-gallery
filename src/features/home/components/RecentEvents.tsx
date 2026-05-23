import Container from '@/components/Layout/Container';

import { getEvents } from '@/lib/events';
import EventCard from '@/features/events/components/EventCard';

export default function RecentEvents() {
  const events = getEvents();

  return (
    <section id="events" className="border-b border-border/70 py-24 md:py-28">
      <Container>
        <div className="mb-14 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground">
              Recent Events
            </p>

            <h2 className="mt-4 text-4xl font-bold tracking-tight md:text-5xl">
              Latest Preview Sessions
            </h2>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {events.map((event) => (
            <EventCard key={event.slug} event={event} />
          ))}
        </div>
      </Container>
    </section>
  );
}
