import Container from '@/components/Layout/Container';

import EventCard from '@/features/events/components/EventCard';
import { events } from '@/features/events/data/events';

export default function EventsPage() {
  return (
    <section className="bg-background pb-24 pt-32">
      <Container>
        <div className="mb-12 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground">Events</p>

            <h1 className="mt-4 text-4xl font-black tracking-tight md:text-6xl">All Events</h1>
          </div>

          <p className="max-w-xl text-sm leading-6 text-muted-foreground md:text-right">
            Choose an event to browse the preview gallery and request edits via WhatsApp.
          </p>
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
