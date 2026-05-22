'use client';

import { Dialog, DialogContent } from '@/components/ui/dialog';

import type { Photo } from '../types/photo';

const WHATSAPP_NUMBER = '6280000000000';

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;

  photo: Photo | null;
};

export default function PreviewModal({ open, onOpenChange, photo }: Props) {
  if (!photo) return null;

  const message = `Halo kak, saya mau request foto ${photo.id}`;
  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-background p-6 sm:max-w-5xl">
        <div className="grid gap-6">
          <img
            src={photo.image}
            alt={photo.id}
            decoding="async"
            className="max-h-[75vh] w-full rounded-2xl object-cover"
          />

          <div className="flex flex-col items-start justify-between gap-4 border-t border-border/60 pt-4 md:flex-row md:items-center">
            <div>
              <p className="text-sm text-muted-foreground">Photo Number</p>

              <h2 className="text-2xl font-bold">{photo.id}</h2>
            </div>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex w-full items-center justify-center rounded-full bg-primary px-6 py-3 font-semibold text-primary-foreground transition duration-300 hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 md:w-auto"
            >
              Request This Photo
            </a>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
