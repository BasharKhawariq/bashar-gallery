import Link from 'next/link';
import { notFound } from 'next/navigation';

import Container from '@/components/Layout/Container';
import { Button } from '@/components/ui/button';

import GalleryGrid from '@/features/gallery/components/GalleryGrid';

import { getEventBySlug } from '@/lib/events';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function EventDetailPage({ params }: Props) {
  const { slug } = await params;

  const event = await getEventBySlug(slug);

  if (!event) {
    return notFound();
  }

  const meta = [event.location, event.date].filter(Boolean).join(' • ');

  return (
    <section className="relative bg-background pb-24">
      {/* Cinematic hero */}
      <div className="relative h-[52vh] w-full overflow-hidden">
        <img
          src={event.cover}
          alt={event.title}
          className="absolute inset-0 h-full w-full object-cover blur-[6px] scale-110"
        />

        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/10 to-black/60" />

        <Container>
          <div className="relative z-20 flex h-[52vh] items-end">
            <div className="pb-12">
              <h1 className="text-4xl font-extrabold leading-tight text-white md:text-6xl">
                {event.title}
              </h1>

              <div className="mt-4 flex items-center gap-6">
                <div className="rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white">
                  {event.photos.length} PHOTOS
                </div>

                {event.location ? (
                  <div className="text-sm font-medium text-white/90 uppercase">
                    {event.location}
                  </div>
                ) : null}

                <a
                  href={`https://wa.me/6280000000000?text=${encodeURIComponent(
                    `Halo kak, saya ingin request foto dari event: ${event.title}`
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                  className="ml-4 inline-block rounded-full bg-green-500 px-5 py-3 text-sm font-semibold text-white shadow-lg transition hover:brightness-95"
                >
                  REQUEST VIA WHATSAPP
                </a>
              </div>

              {event.description ? (
                <p className="mt-6 max-w-2xl text-white/80">{event.description}</p>
              ) : null}
            </div>
          </div>
        </Container>
      </div>

      <Container>
        <div className="mt-8">
          <Button asChild variant="outline" size="sm">
            <Link href="/">Back to Home</Link>
          </Button>
        </div>

        <div className="mt-12">
          <GalleryGrid eventSlug={event.slug} photos={event.photos} />
        </div>
      </Container>
    </section>
  );
}
