type Props = {
  value: string;
  onChange: (value: string) => void;
};

export default function SearchBar({ value, onChange }: Props) {
  return (
    <div className="mb-10">
      <input
        type="text"
        placeholder="Search photo number..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-2xl border border-border bg-card px-5 py-4 text-foreground outline-none transition focus:ring-2 focus:ring-ring"
      />
    </div>
  );
}
