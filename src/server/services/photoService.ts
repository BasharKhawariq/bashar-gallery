import 'server-only';

import { listPhotosByEventIdWithFilename } from '@/server/repositories/photoRepository';

export async function getPhotoFilenamesByEventId(eventId: string) {
  const photos = await listPhotosByEventIdWithFilename(eventId);
  return photos.map((photo) => photo.filename);
}
