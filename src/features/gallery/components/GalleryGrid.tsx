'use client';

import { useState } from 'react';

import type { Photo } from '../types/photo';

import PhotoCard from './PhotoCard';
import PreviewModal from './PreviewModal';
import SearchBar from './SearchBar';

type Props = {
  eventSlug: string;
  photos: string[];
};

export default function GalleryGrid({ eventSlug, photos }: Props) {
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);

  const [search, setSearch] = useState('');

  const [open, setOpen] = useState(false);

  const filteredPhotos = photos.filter((photo) =>
    photo.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <SearchBar value={search} onChange={setSearch} />

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredPhotos.map((photo) => {
          const id = photo.replace(/\.[^/.]+$/, '');
          const previewFilename = photo.replace(/\.(jpg|jpeg|png)$/i, '.webp');
          const imageUrl = `/events/previews/${eventSlug}/${previewFilename}`;

          return (
            <PhotoCard
              key={id}
              id={id}
              image={imageUrl}
              onClick={() => {
                setSelectedPhoto({ id, image: imageUrl });
                setOpen(true);
              }}
            />
          );
        })}
      </div>

      <PreviewModal open={open} onOpenChange={setOpen} photo={selectedPhoto} />
    </>
  );
}
