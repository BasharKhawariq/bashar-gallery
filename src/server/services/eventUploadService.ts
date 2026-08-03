import { buildPreviewUrl, uploadOriginal } from '@/server/services/uploadService';
import { upsertPhotoByEventAndFilename } from '@/server/repositories/photoRepository';
import { upsertEventBySlug } from '@/server/repositories/eventRepository';

export type UploadFileInput = {
  buffer: Buffer;
  filename: string;
  mimeType?: string;
};

export type UploadEventParams = {
  slug: string;
  title: string;
  description?: string | null;
  location?: string | null;
  eventDate?: Date | null;
  published?: boolean;
  coverUrl?: string | null;
  files: UploadFileInput[];
};

export async function uploadEventWithPhotos(params: UploadEventParams) {
  if (params.files.length === 0) {
    throw new Error('No files provided');
  }

  const folder = `/events/${params.slug}/originals`;

  const uploads = [] as Array<{
    filename: string;
    originalUrl: string;
    previewUrl: string;
    width?: number;
    height?: number;
  }>;

  for (const file of params.files) {
    const uploaded = await uploadOriginal({
      fileBuffer: file.buffer,
      fileName: file.filename,
      folder,
      tags: ['original', params.slug],
    });

    if (!uploaded.filePath) {
      throw new Error('ImageKit did not return filePath');
    }

    const previewUrl = buildPreviewUrl(uploaded.filePath);

    uploads.push({
      filename: file.filename,
      originalUrl: uploaded.url,
      previewUrl,
      width: uploaded.width,
      height: uploaded.height,
    });
  }

  const coverUrl = params.coverUrl ?? uploads[0]?.previewUrl ?? null;

  const event = await upsertEventBySlug({
    slug: params.slug,
    title: params.title,
    description: params.description ?? null,
    location: params.location ?? null,
    eventDate: params.eventDate ?? null,
    coverUrl,
    published: params.published ?? false,
  });

  const createdPhotos = [] as Array<{ id: string; filename: string }>;

  for (const upload of uploads) {
    const photo = await upsertPhotoByEventAndFilename({
      eventId: event.id,
      filename: upload.filename,
      previewUrl: upload.previewUrl,
      originalUrl: upload.originalUrl,
      width: upload.width ?? null,
      height: upload.height ?? null,
    });

    createdPhotos.push({ id: photo.id, filename: photo.filename });
  }

  return {
    event,
    photos: createdPhotos,
  };
}
