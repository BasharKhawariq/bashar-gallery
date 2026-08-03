'use client';

import { useMemo, useState } from 'react';
import dynamic from 'next/dynamic';
import useMeasure from '@/hooks/useMeasure';

import type { Photo } from '../types/photo';

import PhotoCard from './PhotoCard';
import PreviewModal from './PreviewModal';
import SearchBar from './SearchBar';

type Props = {
  eventSlug: string;
  photos: string[];
};

const VIRTUALIZE_THRESHOLD = 500;

const FixedSizeGrid = dynamic(() => import('react-window').then((m) => m.FixedSizeGrid), {
  ssr: false,
});

export default function GalleryGrid({ eventSlug, photos }: Props) {
  const [index, setIndex] = useState<number | null>(null);

  const [search, setSearch] = useState('');
  const [visibleCount, setVisibleCount] = useState(24);

  const [open, setOpen] = useState(false);

  const matchedPhotos = useMemo(
    () => photos.filter((photo) => photo.toLowerCase().includes(search.toLowerCase())),
    [photos, search]
  );

  const photoObjects: Photo[] = useMemo(
    () =>
      matchedPhotos.map((photo) => {
        const id = photo.replace(/\.[^/.]+$/, '');
        const previewFilename = photo.replace(/\.(jpg|jpeg|png)$/i, '.webp');
        const imageUrl = `/events/previews/${eventSlug}/${previewFilename}`;
        return { id, image: imageUrl };
      }),
    [matchedPhotos, eventSlug]
  );

  const filteredPhotos = photoObjects.slice(0, visibleCount);

  const openAt = (i: number) => {
    setIndex(i);
    setOpen(true);
  };

  const total = matchedPhotos.length;

  const { ref, rect } = useMeasure<HTMLDivElement>();

  // Determine responsive column count and column width based on container width
  const IDEAL_COLUMN = 320; // ideal content width per column in px
  const GUTTER = 24; // horizontal gap between items (px)

  // estimate number of columns that fit (accounting for gutters)
  const estimated = Math.max(1, Math.floor((rect.width + GUTTER) / (IDEAL_COLUMN + GUTTER)));
  const columns = Math.min(6, estimated);

  // compute exact column width by distributing available space minus total gutters
  const totalGutters = columns > 1 ? (columns - 1) * GUTTER : 0;
  const columnWidth =
    columns > 0
      ? Math.floor(Math.max(IDEAL_COLUMN, (rect.width - totalGutters) / columns))
      : IDEAL_COLUMN;

  const rowHeight = Math.floor(columnWidth * 0.75) + 40;

  return (
    <>
      <SearchBar
        value={search}
        onChange={setSearch}
        showing={filteredPhotos.length}
        total={total}
      />

      <div ref={ref as any} className="w-full">
        {photoObjects.length > VIRTUALIZE_THRESHOLD && rect.width > 0 ? (
          <FixedSizeGrid
            columnCount={columns}
            columnWidth={columnWidth}
            height={Math.max(600, Math.min(1200, rect.height || 800))}
            rowCount={Math.ceil(photoObjects.length / columns)}
            rowHeight={rowHeight}
            width={rect.width}
            itemKey={({ columnIndex, rowIndex }: { columnIndex: number; rowIndex: number }) => {
              const idx = rowIndex * columns + columnIndex;
              return photoObjects[idx]?.id ?? `empty-${idx}`;
            }}
          >
            {({
              columnIndex,
              rowIndex,
              style,
            }: {
              columnIndex: number;
              rowIndex: number;
              style: React.CSSProperties;
            }) => {
              const idx = rowIndex * columns + columnIndex;
              const photo = photoObjects[idx];
              if (!photo) return null;

              return (
                <div style={style} className="p-3">
                  <PhotoCard
                    id={photo.id}
                    image={photo.image}
                    eventSlug={eventSlug}
                    onClick={() => openAt(idx)}
                  />
                </div>
              );
            }}
          </FixedSizeGrid>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredPhotos.map((photo, i) => (
              <PhotoCard
                key={photo.id}
                id={photo.id}
                image={photo.image}
                eventSlug={eventSlug}
                onClick={() => openAt(i)}
              />
            ))}
          </div>
        )}
      </div>

      {visibleCount < matchedPhotos.length && (
        <div className="mt-12 flex justify-center">
          <button
            onClick={() => setVisibleCount((prev) => prev + 24)}
            className="rounded-2xl border border-border bg-card px-8 py-4 font-semibold transition hover:bg-accent"
          >
            Load More
          </button>
        </div>
      )}

      <PreviewModal
        open={open}
        onOpenChange={(v) => setOpen(v)}
        photos={photoObjects}
        index={index}
        onIndexChange={(i) => setIndex(i)}
      />
    </>
  );
}
