import 'server-only';

import { notFound } from 'next/navigation';

import {
  deleteEventById,
  getEventById,
  listAdminEvents,
  updateEventById,
  createEvent,
} from '@/server/repositories/eventRepository';
import { deleteEventAssetsFolder } from '@/server/services/uploadService';

export type AdminEventFormValues = {
  id?: string;
  title: string;
  slug: string;
  description: string;
  location: string;
  eventDate: string;
  coverUrl: string;
  published: boolean;
  photoCount?: number;
};

function toDateInputValue(value: Date | null) {
  if (!value) return '';

  return value.toISOString().slice(0, 10);
}

export async function getAdminEvents() {
  const events = await listAdminEvents();

  return events.map((event) => ({
    id: event.id,
    title: event.title,
    slug: event.slug,
    location: event.location ?? '',
    eventDate: toDateInputValue(event.eventDate),
    published: event.published,
    photoCount: event._count.photos,
    createdAt: event.createdAt,
  }));
}

export async function getAdminEventByIdOrThrow(id: string): Promise<AdminEventFormValues> {
  const event = await getEventById(id);

  if (!event) {
    notFound();
  }

  return {
    id: event.id,
    title: event.title,
    slug: event.slug,
    description: event.description ?? '',
    location: event.location ?? '',
    eventDate: toDateInputValue(event.eventDate),
    coverUrl: event.coverUrl ?? '',
    published: event.published,
    photoCount: event._count.photos,
  };
}

export async function createAdminEvent(input: {
  title: string;
  slug: string;
  description?: string;
  location?: string;
  eventDate?: Date;
  coverUrl?: string;
  published: boolean;
}) {
  return createEvent({
    title: input.title,
    slug: input.slug,
    description: input.description ?? null,
    location: input.location ?? null,
    eventDate: input.eventDate ?? null,
    coverUrl: input.coverUrl ?? null,
    published: input.published,
  });
}

export async function updateAdminEvent(
  id: string,
  input: {
    title: string;
    slug: string;
    description?: string;
    location?: string;
    eventDate?: Date;
    coverUrl?: string;
    published: boolean;
  }
) {
  return updateEventById(id, {
    title: input.title,
    slug: input.slug,
    description: input.description ?? null,
    location: input.location ?? null,
    eventDate: input.eventDate ?? null,
    coverUrl: input.coverUrl ?? null,
    published: input.published,
  });
}

export async function deleteAdminEvent(id: string) {
  const event = await getEventById(id);

  if (!event) {
    notFound();
  }

  await deleteEventById(id);
  await deleteEventAssetsFolder(event.slug).catch(() => undefined);
}
