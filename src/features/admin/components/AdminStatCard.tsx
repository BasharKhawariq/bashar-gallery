import { Card, CardContent } from '@/components/ui/card';

import { cn } from '@/lib/utils';

type Props = {
  label: string;
  value: string;
  description?: string;
  className?: string;
};

export default function AdminStatCard({ label, value, description, className }: Props) {
  return (
    <Card className={cn('rounded-3xl border-border/60 bg-card/70 backdrop-blur-xl', className)}>
      <CardContent className="p-6">
        <p className="text-sm uppercase tracking-[0.28em] text-muted-foreground">{label}</p>
        <div className="mt-4 text-4xl font-black tracking-tight">{value}</div>
        {description ? <p className="mt-3 text-sm text-muted-foreground">{description}</p> : null}
      </CardContent>
    </Card>
  );
}
