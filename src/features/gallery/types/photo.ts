export type PhotoOrientation = 'landscape' | 'portrait';

export type Photo = {
  id: string;
  image: string;
  orientation?: PhotoOrientation;
};
