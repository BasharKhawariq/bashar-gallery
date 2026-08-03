import { prisma } from '@/lib/prisma/client';

import type { Prisma } from '@prisma/client';

export async function createPhoto(data: Prisma.PhotoCreateInput) {
  return prisma.photo.create({ data });
}

export async function upsertPhotoByEventAndFilename(data: {
  eventId: string;
  filename: string;
  previewUrl: string;
  originalUrl: string;
  width?: number | null;
  height?: number | null;
}) {
  return prisma.photo.upsert({
    where: {
      eventId_filename: {
        eventId: data.eventId,
        filename: data.filename,
      },
    },
    create: {
      event: { connect: { id: data.eventId } },
      filename: data.filename,
      previewUrl: data.previewUrl,
      originalUrl: data.originalUrl,
      width: data.width ?? null,
      height: data.height ?? null,
    },
    update: {
      previewUrl: data.previewUrl,
      originalUrl: data.originalUrl,
      width: data.width ?? null,
      height: data.height ?? null,
    },
  });
}

export async function listPhotosByEvent(eventId: string) {
  return prisma.photo.findMany({
    where: { eventId },
    orderBy: { createdAt: 'asc' },
  });
}

export async function listPhotosByEventIdWithFilename(eventId: string) {
  return prisma.photo.findMany({
    where: { eventId },
    select: { filename: true },
    orderBy: { createdAt: 'asc' },
  });
}
