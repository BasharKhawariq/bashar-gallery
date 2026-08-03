'use server';

import { eventCreateSchema } from '@/server/validators/event';
import { createEvent } from '@/server/repositories/eventRepository';

export async function createEventAction(input: unknown) {
  const data = eventCreateSchema.parse(input);
  return createEvent({
    title: data.title,
    slug: data.slug,
    description: data.description ?? null,
    location: data.location ?? null,
    eventDate: data.eventDate ?? null,
    coverUrl: data.coverUrl ?? null,
    published: data.published ?? false,
  });
}
