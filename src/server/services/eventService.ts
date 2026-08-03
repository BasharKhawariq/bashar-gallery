import 'server-only';

import type { Event } from '@/types/event';

import {
  getEventBySlugWithPhotos,
  listEventsWithPhotos,
} from '@/server/repositories/eventRepository';
import { getLocalEventBySlug, getLocalEvents } from '@/server/services/localEventService';

function formatEventDate(value: Date | null | undefined) {
  if (!value) return '';

  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(value);
}

function resolvePreviewUrl(slug: string, filename: string) {
  const previewFilename = filename.replace(/\.(jpg|jpeg|png)$/i, '.webp');
  return `/events/previews/${slug}/${previewFilename}`;
}

function mapEventRecordToUi(
  event: Awaited<ReturnType<typeof listEventsWithPhotos>>[number]
): Event {
  const fallbackPhoto = event.photos[0]?.filename ?? '';
  const coverUrl =
    event.coverUrl ?? (fallbackPhoto ? resolvePreviewUrl(event.slug, fallbackPhoto) : '');

  return {
    slug: event.slug,
    title: event.title,
    date: formatEventDate(event.eventDate),
    location: event.location ?? '',
    description: event.description ?? '',
    cover: coverUrl,
    photos: event.photos.map((photo) => photo.filename),
  };
}

export async function getEvents() {
  try {
    const events = await listEventsWithPhotos();
    return events.map(mapEventRecordToUi);
  } catch {
    return getLocalEvents();
  }
}

export async function getEventBySlug(slug: string) {
  try {
    const event = await getEventBySlugWithPhotos(slug);
    if (!event) return getLocalEventBySlug(slug);

    return mapEventRecordToUi(event);
  } catch {
    return getLocalEventBySlug(slug);
  }
}
