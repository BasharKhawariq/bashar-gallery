import Container from '@/components/Layout/Container';

const events = [
  {
    title: 'Sunmori Batu',
    date: '12 May 2026',
    image:
      'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=1200&auto=format&fit=crop',
  },
  {
    title: 'Midnight Ride',
    date: '28 April 2026',
    image:
      'https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?q=80&w=1200&auto=format&fit=crop',
  },
  {
    title: 'Rolling Session',
    date: '10 April 2026',
    image:
      'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?q=80&w=1200&auto=format&fit=crop',
  },
];

export default function RecentEvents() {
  return (
    <section
      id="events"
      className="border-b border-border py-28"
    >
      <Container>
        <div className="mb-14">
          <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground">
            Recent Events
          </p>

          <h2 className="mt-4 text-4xl font-bold">
            Latest Preview Sessions
          </h2>
        </div>

        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
          {events.map((event, i) => (
            <div
              key={i}
              className="group overflow-hidden rounded-3xl border border-border bg-card"
            >
              <div className="overflow-hidden">
                <img
                  src={event.image}
                  alt={event.title}
                  className="h-[320px] w-full object-cover transition duration-700 group-hover:scale-110"
                />
              </div>

              <div className="p-6">
                <p className="text-sm text-muted-foreground">
                  {event.date}
                </p>

                <h3 className="mt-2 text-2xl font-bold">
                  {event.title}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}