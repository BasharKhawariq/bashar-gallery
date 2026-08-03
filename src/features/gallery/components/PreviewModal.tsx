'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

import { useEffect, useRef, useState } from 'react';

import type { Photo } from '../types/photo';

const WHATSAPP_NUMBER = '6280000000000';

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;

  photos: Photo[];
  index: number | null;
  onIndexChange: (i: number | null) => void;
};

export default function PreviewModal({ open, onOpenChange, photos, index, onIndexChange }: Props) {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const touchStartX = useRef<number | null>(null);
  const [touchDelta, setTouchDelta] = useState(0);
  const [isTouching, setIsTouching] = useState(false);

  const current = index != null && photos[index] ? photos[index] : null;

  useEffect(() => {
    setImageSrc(null);
    if (!current || !open) return;

    // sign URL for current image
    try {
      const parts = current.image.split('/').filter(Boolean);
      const idx = parts.indexOf('previews');
      if (idx >= 0 && parts.length > idx + 2) {
        const event = parts[idx + 1];
        const file = parts.slice(idx + 2).join('/');

        fetch('/api/sign', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ event, file }),
        })
          .then((r) => r.json())
          .then((data) => {
            if (data?.url) setImageSrc(data.url);
            else setImageSrc(current.image);
          })
          .catch(() => setImageSrc(current.image));
      } else {
        setImageSrc(current.image);
      }
    } catch {
      setImageSrc(current.image);
    }
  }, [current, open, index]);

  useEffect(() => {
    if (!open) return;

    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onOpenChange(false);
      if (e.key === 'ArrowRight') {
        const next = index == null ? null : Math.min(photos.length - 1, index + 1);
        onIndexChange(next);
      }
      if (e.key === 'ArrowLeft') {
        const prev = index == null ? null : Math.max(0, index - 1);
        onIndexChange(prev);
      }
    }

    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, photos.length, onOpenChange, onIndexChange, index]);

  if (!current) return null;

  const message = `Halo kak, saya ingin request foto:\n\nEvent: ${location.pathname.split('/').pop()}\nPhoto: ${current.id}`;
  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

  const goNext = () => {
    const next = index == null ? null : Math.min(photos.length - 1, index + 1);
    onIndexChange(next);
  };

  const goPrev = () => {
    const prev = index == null ? null : Math.max(0, index - 1);
    onIndexChange(prev);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[calc(100vh-2rem)] overflow-hidden bg-background p-0 sm:max-w-5xl md:max-w-6xl">
        <DialogHeader className="sr-only">
          <DialogTitle>Photo preview</DialogTitle>
          <DialogDescription>
            Browse photos using the previous and next controls, or press escape to close.
          </DialogDescription>
        </DialogHeader>

        <div className="relative">
          {/* Top bar: controls */}
          <div className="absolute left-1/2 z-20 flex -translate-x-1/2 items-center gap-6 rounded-full bg-black/40 px-4 py-2 text-sm text-white backdrop-blur">
            {/* <button onClick={goPrev} aria-label="Previous" className="px-3 py-1">
              ←
            </button> */}
            <div>{index != null ? `${index + 1} / ${photos.length}` : `— / ${photos.length}`}</div>
            {/* <button onClick={goNext} aria-label="Next" className="px-3 py-1">
              →
            </button> */}
          </div>

          {/* Image container with arrows */}
          <div
            onTouchStart={(e) => {
              touchStartX.current = e.touches[0].clientX;
              setIsTouching(true);
              setTouchDelta(0);
            }}
            onTouchMove={(e) => {
              if (touchStartX.current == null) return;
              const dx = e.touches[0].clientX - touchStartX.current;
              setTouchDelta(dx);
            }}
            onTouchEnd={(e) => {
              if (touchStartX.current == null) return;
              const dx = e.changedTouches[0].clientX - touchStartX.current;
              const threshold = Math.max(50, (window.innerWidth || 320) * 0.12);
              setIsTouching(false);
              setTouchDelta(0);
              if (Math.abs(dx) > threshold) {
                if (dx < 0) goNext();
                else goPrev();
              }
              touchStartX.current = null;
            }}
            className="flex items-center justify-center bg-black/90 p-6"
          >
            <button
              onClick={goPrev}
              aria-hidden
              className="absolute left-3 top-1/2 z-30 -translate-y-1/2 rounded-full bg-black/40 p-3 text-white hover:scale-105"
            >
              ‹
            </button>

            <div
              style={{
                transform: `translateX(${isTouching ? touchDelta : 0}px)`,
                transition: isTouching ? 'none' : 'transform 220ms ease',
                width: '100%',
              }}
            >
              <img
                src={imageSrc ?? current.image}
                alt={current.id}
                decoding="async"
                draggable={false}
                onContextMenu={(e) => e.preventDefault()}
                className="max-h-[80vh] w-full max-w-5xl rounded-2xl bg-muted/20 object-contain"
              />
            </div>

            <button
              onClick={goNext}
              aria-hidden
              className="absolute right-3 top-1/2 z-30 -translate-y-1/2 rounded-full bg-black/40 p-3 text-white hover:scale-105"
            >
              ›
            </button>
          </div>

          {/* Bottom bar: info and request */}
          <div className="flex items-center justify-between gap-4 border-t border-border/60 bg-background p-4">
            <div>
              <p className="text-sm text-muted-foreground">Photo Number</p>
              <h2 className="text-2xl font-bold">{current.id}</h2>
            </div>

            <div className="flex items-center gap-4">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center rounded-full bg-primary px-6 py-3 font-semibold text-primary-foreground transition duration-300 hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
              >
                Request This Photo
              </a>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
