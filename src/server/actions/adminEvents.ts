'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import { slugify } from '@/lib/utils';
import { requireAdminOrRedirect } from '@/server/services/adminService';
import { getEventById } from '@/server/repositories/eventRepository';
import {
  createAdminEvent,
  deleteAdminEvent,
  updateAdminEvent,
} from '@/server/services/adminEventService';
import { uploadEventCover } from '@/server/services/uploadService';
import { eventCreateSchema } from '@/server/validators/event';

function getString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === 'string' ? value.trim() : '';
}

function getPublished(formData: FormData) {
  return formData.get('published') === 'on';
}

function getFile(formData: FormData, key: string) {
  const value = formData.get(key);

  if (!(value instanceof File) || value.size === 0) {
    return null;
  }

  return value;
}

async function resolveCoverUrl(formData: FormData, slug: string, fallbackCoverUrl?: string) {
  const coverFile = getFile(formData, 'coverFile');

  if (!coverFile) {
    return fallbackCoverUrl;
  }

  if (!/^image\/(jpeg|jpg|png|webp)$/i.test(coverFile.type)) {
    throw new Error('Cover image must be JPG, PNG, or WEBP');
  }

  const arrayBuffer = await coverFile.arrayBuffer();
  const uploadedCover = await uploadEventCover({
    slug,
    fileBuffer: Buffer.from(arrayBuffer),
    fileName: coverFile.name,
  });

  return uploadedCover.previewUrl;
}

async function buildEventPayload(
  formData: FormData,
  options?: { existingCoverUrl?: string | null }
) {
  const rawSlug = getString(formData, 'slug');
  const normalizedSlug = slugify(rawSlug || getString(formData, 'title'));
  const eventDate = getString(formData, 'eventDate');
  const manualCoverUrl = getString(formData, 'coverUrl');
  const fallbackCoverUrl = manualCoverUrl || options?.existingCoverUrl || undefined;
  const coverUrl = await resolveCoverUrl(formData, normalizedSlug, fallbackCoverUrl);

  return eventCreateSchema.parse({
    title: getString(formData, 'title'),
    slug: normalizedSlug,
    description: getString(formData, 'description') || undefined,
    location: getString(formData, 'location') || undefined,
    eventDate: eventDate || undefined,
    coverUrl,
    published: getPublished(formData),
  });
}

export async function createAdminEventAction(formData: FormData) {
  await requireAdminOrRedirect();

  const data = await buildEventPayload(formData);
  const event = await createAdminEvent(data);

  revalidatePath('/admin');
  revalidatePath('/admin/events');
  revalidatePath('/admin/upload');
  revalidatePath('/event');
  redirect(`/admin/events/${event.id}/edit?status=created`);
}

export async function updateAdminEventAction(formData: FormData) {
  await requireAdminOrRedirect();

  const id = getString(formData, 'id');
  if (!id) {
    redirect('/admin/events?error=missing_id');
  }

  const existing = await getEventById(id);
  if (!existing) {
    redirect('/admin/events?error=not_found');
  }

  const data = await buildEventPayload(formData, {
    existingCoverUrl: existing.coverUrl,
  });
  await updateAdminEvent(id, data);

  revalidatePath('/admin');
  revalidatePath('/admin/events');
  revalidatePath(`/admin/events/${id}/edit`);
  revalidatePath('/admin/upload');
  revalidatePath('/event');
  redirect(`/admin/events/${id}/edit?status=updated`);
}

export async function deleteAdminEventAction(formData: FormData) {
  await requireAdminOrRedirect();

  const id = getString(formData, 'id');
  if (!id) {
    redirect('/admin/events?error=missing_id');
  }

  await deleteAdminEvent(id);

  revalidatePath('/admin');
  revalidatePath('/admin/events');
  revalidatePath('/admin/upload');
  revalidatePath('/event');
  redirect('/admin/events?status=deleted');
}
