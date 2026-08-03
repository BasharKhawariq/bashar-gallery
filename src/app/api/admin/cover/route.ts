import { NextRequest, NextResponse } from 'next/server';

import { assertAdminApiUser } from '@/server/services/adminService';
import { uploadEventCover } from '@/server/services/uploadService';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function getString(formData: FormData, key: string) {
  const value = formData.get(key);
  if (typeof value === 'string') return value.trim();
  return '';
}

function getCoverFile(formData: FormData) {
  const value = formData.get('coverFile');

  if (!(value instanceof File) || value.size === 0) {
    return null;
  }

  return value;
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

    if (!slug) {
      return NextResponse.json({ error: 'Slug is required' }, { status: 400 });
    }

    const coverFile = getCoverFile(formData);

    if (!coverFile) {
      return NextResponse.json({ error: 'No cover file provided' }, { status: 400 });
    }

    if (!/^image\/(jpeg|jpg|png|webp)$/i.test(coverFile.type)) {
      return NextResponse.json({ error: 'Cover image must be JPG, PNG, or WEBP' }, { status: 400 });
    }

    const arrayBuffer = await coverFile.arrayBuffer();
    const uploaded = await uploadEventCover({
      slug,
      fileBuffer: Buffer.from(arrayBuffer),
      fileName: coverFile.name,
    });

    return NextResponse.json({
      coverUrl: uploaded.previewUrl,
      originalUrl: uploaded.originalUrl,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Cover upload failed';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
