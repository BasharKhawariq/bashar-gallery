require('dotenv').config();

const fs = require('fs');
const path = require('path');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({ log: ['warn', 'error'] });

const ORIGINALS_PATH = path.join(process.cwd(), 'public', 'events', 'originals');
const PREVIEWS_PATH = path.join(process.cwd(), 'public', 'events', 'previews');

function isImageFile(filename) {
  return /\.(jpg|jpeg|png|webp)$/i.test(filename);
}

function formatTitleFromSlug(slug) {
  return slug
    .replace(/[-_]+/g, ' ')
    .trim()
    .replace(/\b\w/g, (character) => character.toUpperCase());
}

function parseEventDate(value) {
  if (!value) return null;
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function readMetadata(filePath) {
  if (!fs.existsSync(filePath)) return null;

  try {
    const raw = fs.readFileSync(filePath, 'utf8');
    const data = JSON.parse(raw);

    return {
      title: typeof data.title === 'string' ? data.title : null,
      date: typeof data.date === 'string' ? data.date : null,
      location: typeof data.location === 'string' ? data.location : null,
      description: typeof data.description === 'string' ? data.description : null,
      cover: typeof data.cover === 'string' ? data.cover : null,
    };
  } catch {
    return null;
  }
}

function resolvePreviewUrl(slug, filename) {
  return `/events/previews/${slug}/${filename.replace(/\.(jpg|jpeg|png)$/i, '.webp')}`;
}

function resolveOriginalUrl(slug, filename) {
  return `/events/originals/${slug}/${filename}`;
}

async function main() {
  if (!fs.existsSync(ORIGINALS_PATH)) {
    console.error(`Originals folder not found: ${ORIGINALS_PATH}`);
    process.exitCode = 1;
    return;
  }

  const eventDirs = fs
    .readdirSync(ORIGINALS_PATH, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory() && !dirent.name.startsWith('.'))
    .map((dirent) => dirent.name)
    .sort((a, b) => a.localeCompare(b));

  for (const slug of eventDirs) {
    const originalsDir = path.join(ORIGINALS_PATH, slug);
    const previewsDir = path.join(PREVIEWS_PATH, slug);
    const metadata = readMetadata(path.join(originalsDir, 'event.json'));

    const previewFiles = fs.existsSync(previewsDir)
      ? fs
          .readdirSync(previewsDir)
          .filter((file) => isImageFile(file) && !file.startsWith('.'))
          .sort((a, b) => a.localeCompare(b))
      : [];

    const originalFiles = fs
      .readdirSync(originalsDir)
      .filter((file) => isImageFile(file) && !file.startsWith('.'))
      .sort((a, b) => a.localeCompare(b));

    const event = await prisma.event.upsert({
      where: { slug },
      create: {
        slug,
        title: metadata?.title ?? formatTitleFromSlug(slug),
        description: metadata?.description ?? '',
        location: metadata?.location ?? '',
        eventDate: parseEventDate(metadata?.date),
        coverUrl: metadata?.cover ? resolvePreviewUrl(slug, metadata.cover) : null,
        published: true,
      },
      update: {
        title: metadata?.title ?? formatTitleFromSlug(slug),
        description: metadata?.description ?? '',
        location: metadata?.location ?? '',
        eventDate: parseEventDate(metadata?.date),
        coverUrl: metadata?.cover ? resolvePreviewUrl(slug, metadata.cover) : null,
        published: true,
      },
    });

    const photoFiles = previewFiles.length > 0 ? previewFiles : originalFiles;

    for (const file of photoFiles) {
      const base = path.parse(file).name;
      const originalMatch = originalFiles.find((item) => path.parse(item).name === base) ?? file;

      await prisma.photo.upsert({
        where: {
          eventId_filename: {
            eventId: event.id,
            filename: file,
          },
        },
        create: {
          eventId: event.id,
          filename: file,
          previewUrl: resolvePreviewUrl(slug, file),
          originalUrl: resolveOriginalUrl(slug, originalMatch),
        },
        update: {
          previewUrl: resolvePreviewUrl(slug, file),
          originalUrl: resolveOriginalUrl(slug, originalMatch),
        },
      });
    }

    console.log(`Synced event: ${slug} (${photoFiles.length} photos)`);
  }

  console.log('Local event sync complete.');
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
