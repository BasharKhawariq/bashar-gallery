import type { Event } from '../types/event';

export const events: Event[] = [
  {
    slug: 'sunmori-batu',
    title: 'Sunmori Batu',
    date: '12 May 2026',
    location: 'Batu, Malang',

    cover:
      'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=1200&auto=format&fit=crop',

    photos: [
      {
        id: 'IMG_1024',
        image:
          'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=1200&auto=format&fit=crop',
      },
      {
        id: 'IMG_1025',
        image:
          'https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=1200&auto=format&fit=crop',
      },
      {
        id: 'IMG_1026',
        image:
          'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?q=80&w=1200&auto=format&fit=crop',
      },
    ],
  },

  {
    slug: 'midnight-ride',
    title: 'Midnight Ride',
    date: '28 April 2026',
    location: 'Malang City',

    cover:
      'https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?q=80&w=1200&auto=format&fit=crop',

    photos: [
      {
        id: 'IMG_2031',
        image:
          'https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?q=80&w=1200&auto=format&fit=crop',
      },
      {
        id: 'IMG_2032',
        image:
          'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?q=80&w=1200&auto=format&fit=crop',
      },
    ],
  },

  {
    slug: 'portrait-preview',
    title: 'Portrait Preview',
    date: '02 June 2026',
    location: 'Malang',

    cover:
      'https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?q=80&w=1200&auto=format&fit=crop',

    photos: [
      {
        id: 'PORTRAIT_0001',
        image:
          'https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=900&h=1200&auto=format&fit=crop',
        orientation: 'portrait',
      },
      {
        id: 'PORTRAIT_0002',
        image:
          'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=900&h=1200&auto=format&fit=crop',
        orientation: 'portrait',
      },
      {
        id: 'PORTRAIT_0003',
        image:
          'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?q=80&w=900&h=1200&auto=format&fit=crop',
        orientation: 'portrait',
      },
    ],
  },
];
