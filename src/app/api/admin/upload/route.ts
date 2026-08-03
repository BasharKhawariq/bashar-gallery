import { NextRequest, NextResponse } from 'next/server';

import { uploadEventSchema } from '@/server/validators/upload';
import { uploadEventWithPhotos } from '@/server/services/eventUploadService';
import { assertAdminApiUser } from '@/server/services/adminService';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function getString(formData: FormData, key: string) {
  const value = formData.get(key);
  if (typeof value === 'string') return value.trim();
  return '';
}

export async function POST(req: NextRequest) {
  try {
    const adminCheck = await assertAdminApiUser();
    if (!adminCheck.ok) {
      const message = adminCheck.status === 401 ? 'Unauthorized' : 'Forbidden';
      return NextResponse.json({ error: message }, { status: adminCheck.status });
    }

    const formData = await req.formData();

    const slug = getString(formData, 'slug');
    const title = getString(formData, 'title') || slug;
    const description = getString(formData, 'description') || undefined;
    const location = getString(formData, 'location') || undefined;
    const eventDateRaw = getString(formData, 'eventDate') || undefined;
    const publishedRaw = getString(formData, 'published') || undefined;
    const coverUrl = getString(formData, 'coverUrl') || undefined;

    const eventInput = uploadEventSchema.parse({
      slug,
      title,
      description,
      location,
      eventDate: eventDateRaw || undefined,
      published: publishedRaw || undefined,
    });

    const fileEntries = formData.getAll('files').filter((value) => value instanceof File) as File[];

    if (fileEntries.length === 0) {
      return NextResponse.json({ error: 'No files provided' }, { status: 400 });
    }

    const files = await Promise.all(
      fileEntries.map(async (file) => {
        const arrayBuffer = await file.arrayBuffer();
        return {
          buffer: Buffer.from(arrayBuffer),
          filename: file.name,
          mimeType: file.type,
        };
      })
    );

    const result = await uploadEventWithPhotos({
      slug: eventInput.slug,
      title: eventInput.title,
      description: eventInput.description ?? null,
      location: eventInput.location ?? null,
      eventDate: eventInput.eventDate ?? null,
      published: eventInput.published ?? false,
      coverUrl: coverUrl ?? null,
      files,
    });

    return NextResponse.json({
      event: { id: result.event.id, slug: result.event.slug, title: result.event.title },
      uploaded: result.photos.length,
    });
  } catch (error) {
    return NextResponse.json({ error: 'Upload failed' }, { status: 400 });
  }
}
