type Props = {
  id: string;
  image: string;
  onClick: () => void;
};

export default function PhotoCard({ id, image, onClick }: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`Preview photo ${id}`}
      className="group relative overflow-hidden rounded-3xl border border-border/70 bg-card/70 shadow-lg transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:ring-2 hover:ring-ring/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
    >
      <div className="overflow-hidden">
        <img
          src={image}
          alt={id}
          loading="lazy"
          decoding="async"
          className="h-[320px] w-full object-cover transition duration-700 group-hover:scale-110"
        />
      </div>

      <div className="absolute inset-0 bg-black/0 transition duration-300 group-hover:bg-black/40" />

      <div className="absolute bottom-0 left-0 w-full p-4">
        <div className="inline-flex rounded-xl bg-black/70 px-4 py-2 text-sm font-semibold text-white backdrop-blur">
          {id}
        </div>
      </div>
    </button>
  );
}
