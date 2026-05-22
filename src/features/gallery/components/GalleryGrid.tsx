'use client';

import { useState } from 'react';

import type { Photo } from '../types/photo';

import PhotoCard from './PhotoCard';
import PreviewModal from './PreviewModal';

type Props = {
  photos: Photo[];
};

export default function GalleryGrid({ photos }: Props) {
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);

  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {photos.map((photo) => (
          <PhotoCard
            key={photo.id}
            id={photo.id}
            image={photo.image}
            orientation={photo.orientation}
            onClick={() => {
              setSelectedPhoto(photo);
              setOpen(true);
            }}
          />
        ))}
      </div>

      <PreviewModal open={open} onOpenChange={setOpen} photo={selectedPhoto} />
    </>
  );
}
