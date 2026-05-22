import type { Photo } from '@/features/gallery/types/photo';

export type Event = {
  slug: string;
  title: string;
  date: string;
  location: string;
  cover: string;
  photos: Photo[];
};
