import 'server-only';

import fs from 'fs';
import path from 'path';

import type { Event, EventMetadata } from '@/types/event';

const EVENTS_PATH = path.join(process.cwd(), 'public', 'events', 'previews');
const ORIGINALS_PATH = path.join(process.cwd(), 'public', 'events', 'originals');

function isImageFile(filename: string) {
  return /\.(jpg|jpeg|png|webp)$/i.test(filename);
}

function formatTitleFromSlug(slug: string) {
  return slug
    .replace(/[-_]+/g, ' ')
    .trim()
    .replace(/\b\w/g, (character) => character.toUpperCase());
}

function toSafeBasename(filename: string) {
  return path.basename(filename).trim();
}

function normalizeToWebpFilename(filename: string) {
  const base = toSafeBasename(filename);
  if (!base) return '';

  if (/\.webp$/i.test(base)) return base;

  if (/\.(jpg|jpeg|png)$/i.test(base)) {
    return base.replace(/\.(jpg|jpeg|png)$/i, '.webp');
  }

  if (!/\.[^./\\]+$/.test(base)) {
    return `${base}.webp`;
  }

  return base;
}

function readEventMetadata(metadataPath: string): EventMetadata | null {
  if (!fs.existsSync(metadataPath)) return null;

  try {
    const raw = fs.readFileSync(metadataPath, 'utf-8');
    const data = JSON.parse(raw) as Partial<EventMetadata>;

    if (
      typeof data.title !== 'string' ||
      typeof data.date !== 'string' ||
      typeof data.location !== 'string' ||
      typeof data.description !== 'string' ||
      typeof data.cover !== 'string'
    ) {
      return null;
    }

    return {
      title: data.title,
      date: data.date,
      location: data.location,
      description: data.description,
      cover: data.cover,
    };
  } catch {
    return null;
  }
}

export function getEvents(): Event[] {
  if (!fs.existsSync(EVENTS_PATH)) return [];

  const eventDirents = fs.readdirSync(EVENTS_PATH, { withFileTypes: true });

  const eventsWithMtime = eventDirents
    .filter((dirent) => dirent.isDirectory() && !dirent.name.startsWith('.'))
    .map((dirent) => {
      const folder = dirent.name;
      const folderPath = path.join(EVENTS_PATH, folder);
      const originalFolderPath = path.join(ORIGINALS_PATH, folder);

      const photos = fs
        .readdirSync(folderPath)
        .filter((file) => isImageFile(file) && !file.startsWith('.'))
        .sort((a, b) => a.localeCompare(b));

      if (photos.length === 0) return null;

      const metadataPath = path.join(originalFolderPath, 'event.json');
      const metadata = readEventMetadata(metadataPath);

      const fallbackTitle = formatTitleFromSlug(folder);
      const fallbackCoverFilename = photos[0];

      const coverFilename = (() => {
        const candidate = normalizeToWebpFilename(metadata?.cover ?? fallbackCoverFilename);
        if (!candidate) return fallbackCoverFilename;
        return photos.includes(candidate) ? candidate : fallbackCoverFilename;
      })();

      const stat = fs.statSync(folderPath);

      return {
        event: {
          slug: folder,
          title: metadata?.title ?? fallbackTitle,
          date: metadata?.date ?? '',
          location: metadata?.location ?? '',
          description: metadata?.description ?? '',
          cover: `/events/previews/${folder}/${coverFilename}`,
          photos,
        } satisfies Event,
        mtimeMs: stat.mtimeMs,
      };
    })
    .filter((item): item is { event: Event; mtimeMs: number } => item !== null)
    .sort((a, b) => b.mtimeMs - a.mtimeMs);

  return eventsWithMtime.map((item) => item.event);
}

export function getEventBySlug(slug: string) {
  return getEvents().find((event) => event.slug === slug);
}
