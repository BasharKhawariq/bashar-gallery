import { prisma } from '@/lib/prisma/client';

import type { Prisma } from '@prisma/client';

export async function createEvent(data: Prisma.EventCreateInput) {
  return prisma.event.create({ data });
}

export async function listEventsWithPhotos() {
  return prisma.event.findMany({
    include: {
      photos: {
        select: { filename: true },
      },
    },
    orderBy: [{ eventDate: 'desc' }, { createdAt: 'desc' }],
  });
}

export async function listAdminEvents() {
  return prisma.event.findMany({
    include: {
      _count: {
        select: {
          photos: true,
        },
      },
    },
    orderBy: [{ eventDate: 'desc' }, { createdAt: 'desc' }],
  });
}

export async function getEventBySlugWithPhotos(slug: string) {
  return prisma.event.findUnique({
    where: { slug },
    include: {
      photos: {
        select: { filename: true },
      },
    },
  });
}

export async function getEventById(id: string) {
  return prisma.event.findUnique({
    where: { id },
    include: {
      _count: {
        select: {
          photos: true,
        },
      },
    },
  });
}

export async function upsertEventBySlug(data: {
  slug: string;
  title: string;
  description?: string | null;
  location?: string | null;
  eventDate?: Date | null;
  coverUrl?: string | null;
  published?: boolean;
}) {
  return prisma.event.upsert({
    where: { slug: data.slug },
    create: {
      slug: data.slug,
      title: data.title,
      description: data.description ?? null,
      location: data.location ?? null,
      eventDate: data.eventDate ?? null,
      coverUrl: data.coverUrl ?? null,
      published: data.published ?? false,
    },
    update: {
      title: data.title,
      description: data.description ?? undefined,
      location: data.location ?? undefined,
      eventDate: data.eventDate ?? undefined,
      coverUrl: data.coverUrl ?? undefined,
      published: data.published ?? undefined,
    },
  });
}

export async function updateEventById(
  id: string,
  data: {
    slug: string;
    title: string;
    description?: string | null;
    location?: string | null;
    eventDate?: Date | null;
    coverUrl?: string | null;
    published?: boolean;
  }
) {
  return prisma.event.update({
    where: { id },
    data: {
      slug: data.slug,
      title: data.title,
      description: data.description ?? null,
      location: data.location ?? null,
      eventDate: data.eventDate ?? null,
      coverUrl: data.coverUrl ?? null,
      published: data.published ?? false,
    },
  });
}

export async function deleteEventById(id: string) {
  return prisma.event.delete({
    where: { id },
  });
}
