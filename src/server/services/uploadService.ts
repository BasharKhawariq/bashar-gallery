import { getImageKit } from '@/lib/imagekit/client';

export type UploadResult = {
  fileId: string;
  name: string;
  filePath?: string;
  url: string;
  thumbnailUrl?: string;
  size?: number;
  width?: number;
  height?: number;
};

const PREVIEW_MAX_WIDTH = Number(process.env.IMAGEKIT_PREVIEW_MAX_WIDTH ?? 1600);
const PREVIEW_QUALITY = Number(process.env.IMAGEKIT_PREVIEW_QUALITY ?? 75);

export async function uploadOriginal(params: {
  fileBuffer: Buffer;
  fileName: string;
  folder: string;
  tags?: string[];
}): Promise<UploadResult> {
  const imagekit = getImageKit();

  const result = await imagekit.upload({
    file: params.fileBuffer,
    fileName: params.fileName,
    folder: params.folder,
    useUniqueFileName: true,
    tags: params.tags ?? ['original'],
  });

  return {
    fileId: result.fileId,
    name: result.name,
    filePath: result.filePath,
    url: result.url,
    thumbnailUrl: result.thumbnailUrl,
    size: result.size,
    width: result.width,
    height: result.height,
  };
}

export async function uploadEventCover(params: {
  slug: string;
  fileBuffer: Buffer;
  fileName: string;
}) {
  const uploaded = await uploadOriginal({
    fileBuffer: params.fileBuffer,
    fileName: params.fileName,
    folder: `/events/${params.slug}/cover`,
    tags: ['cover', params.slug],
  });

  if (!uploaded.filePath) {
    throw new Error('ImageKit did not return filePath for cover upload');
  }

  return {
    originalUrl: uploaded.url,
    previewUrl: buildPreviewUrl(uploaded.filePath),
    filePath: uploaded.filePath,
  };
}

export function buildPreviewUrl(filePath: string) {
  const imagekit = getImageKit();

  return imagekit.url({
    path: filePath,
    transformation: [
      {
        width: PREVIEW_MAX_WIDTH,
        quality: PREVIEW_QUALITY,
        format: 'webp',
      },
    ],
  });
}

export async function deleteEventAssetsFolder(slug: string) {
  const imagekit = getImageKit();

  try {
    await imagekit.deleteFolder(`/events/${slug}`);
  } catch (error) {
    if (error instanceof Error && /not found/i.test(error.message)) {
      return;
    }

    throw error;
  }
}
