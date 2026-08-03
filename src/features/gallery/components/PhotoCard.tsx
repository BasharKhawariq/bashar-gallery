import { cn } from '@/lib/utils';

import type { PhotoOrientation } from '../types/photo';

type Props = {
  id: string;
  image: string;
  orientation?: PhotoOrientation;
  onClick: () => void;
  eventSlug?: string;
};

const WHATSAPP_NUMBER = '6280000000000';

export default function PhotoCard({
  id,
  image,
  orientation = 'landscape',
  onClick,
  eventSlug,
}: Props) {
  const mediaClassName =
    orientation === 'portrait' ? 'h-[480px] sm:h-[520px] lg:h-[560px]' : 'h-[320px] sm:h-[360px]';

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          onClick();
        }
      }}
      aria-label={`Preview photo ${id}`}
      className="group relative select-none overflow-hidden rounded-3xl border border-border/70 bg-card/70 shadow-lg transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:ring-2 hover:ring-ring/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
    >
      <div className={cn('overflow-hidden', mediaClassName)}>
        <img
          src={image}
          alt={id}
          loading="lazy"
          decoding="async"
          draggable={false}
          onContextMenu={(e) => e.preventDefault()}
          className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
        />
      </div>

      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition duration-300 group-hover:opacity-100" />

      <div className="absolute inset-0 pointer-events-none opacity-0 transition duration-300 group-hover:opacity-100">
        <div className="absolute inset-0 ring-0 animate-fade bg-white/0 shadow-[0_6px_30px_rgba(0,0,0,0.18)] blur-sm mix-blend-screen" />
      </div>

      <div className="absolute bottom-0 left-0 w-full p-4 flex items-center justify-between gap-4">
        <div className="inline-flex items-center gap-3 rounded-xl bg-black/70 px-4 py-2 text-sm font-semibold text-white backdrop-blur">
          <span>{id}</span>
          {/* <span className="hidden sm:inline-block text-xs text-muted-foreground">Request ready</span> */}
        </div>

        {eventSlug ? (
          <button
            onClick={(e) => {
              e.stopPropagation();
              const message = encodeURIComponent(
                `Halo kak, saya ingin request foto:\n\nEvent: ${eventSlug}\nPhoto: ${id}`
              );

              window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${message}`, '_blank');
            }}
            className="rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white opacity-0 transition duration-200 hover:bg-white/20 group-hover:opacity-100"
            aria-label={`Request photo ${id}`}
          >
            Request
          </button>
        ) : null}
      </div>
    </div>
  );
}
