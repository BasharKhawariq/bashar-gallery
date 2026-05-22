import Link from 'next/link';
import { notFound } from 'next/navigation';

import Container from '@/components/Layout/Container';
import { Button } from '@/components/ui/button';

import GalleryGrid from '@/features/gallery/components/GalleryGrid';

import { events } from '@/features/events/data/events';

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function EventDetailPage({ params }: Props) {
  const { slug } = await params;

  const event = events.find((item) => item.slug === slug);

  if (!event) {
    return notFound();
  }

  return (
    <section className="bg-background pb-24 pt-32">
      <Container>
        <div className="mb-8">
          <Button asChild variant="outline" size="sm">
            <Link href="/">Back to Home</Link>
          </Button>
        </div>

        <div className="mb-12 max-w-4xl">
          <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground">Event Gallery</p>

          <h1 className="mt-4 text-4xl font-black tracking-tight md:text-6xl">{event.title}</h1>

          <p className="mt-4 text-muted-foreground">
            {event.location} • {event.date}
          </p>
        </div>

        <GalleryGrid photos={event.photos} />
      </Container>
    </section>
  );
}
