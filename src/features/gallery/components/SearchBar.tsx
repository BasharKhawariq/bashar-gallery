type Props = {
  value: string;
  onChange: (value: string) => void;
  showing?: number;
  total?: number;
};

export default function SearchBar({ value, onChange, showing = 0, total = 0 }: Props) {
  return (
    <div className="sticky top-24 z-30 mb-6">
      <div className="backdrop-blur-sm rounded-3xl border border-border/60 bg-white/30 dark:bg-black/30 p-4 shadow-sm">
        <div className="flex items-center gap-3">
          {/* <span className="text-xl">🔍</span> */}
          <input
            type="text"
            placeholder="Search photo number..."
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full bg-transparent text-foreground outline-none placeholder:text-muted-foreground"
          />
          <div className="text-sm text-muted-foreground text-nowrap">
            Showing {showing} of {total}
          </div>
        </div>
      </div>
    </div>
  );
}
