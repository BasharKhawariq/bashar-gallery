export type EventMetadata = {
  title: string;
  date: string;
  location: string;
  description: string;
  cover: string;
};

export type Event = EventMetadata & {
  slug: string;
  photos: string[];
};
