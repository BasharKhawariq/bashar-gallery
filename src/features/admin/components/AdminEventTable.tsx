import Link from 'next/link';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

type EventRow = {
  id: string;
  title: string;
  slug: string;
  location: string;
  eventDate: string;
  published: boolean;
  photoCount: number;
};

type Props = {
  events: EventRow[];
};

export default function AdminEventTable({ events }: Props) {
  if (events.length === 0) {
    return (
      <Card className="rounded-[2rem] border-border/60 bg-card/70 backdrop-blur-xl">
        <CardContent className="p-6 text-sm text-muted-foreground">
          Belum ada event di database. Buat event pertama untuk mulai upload.
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="rounded-[2rem] border-border/60 bg-card/70 backdrop-blur-xl">
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-muted/40 text-left text-muted-foreground">
              <tr>
                <th className="px-6 py-4 font-medium">Event</th>
                <th className="px-6 py-4 font-medium">Date</th>
                <th className="px-6 py-4 font-medium">Photos</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {events.map((event) => (
                <tr key={event.id} className="border-t border-border/60">
                  <td className="px-6 py-4 align-top">
                    <div className="space-y-1">
                      <div className="font-semibold">{event.title}</div>
                      <div className="font-mono text-xs text-muted-foreground">{event.slug}</div>
                      {event.location ? (
                        <div className="text-xs text-muted-foreground">{event.location}</div>
                      ) : null}
                    </div>
                  </td>
                  <td className="px-6 py-4 align-top text-muted-foreground">
                    {event.eventDate || 'No date'}
                  </td>
                  <td className="px-6 py-4 align-top text-muted-foreground">{event.photoCount}</td>
                  <td className="px-6 py-4 align-top">
                    <span
                      className={
                        event.published
                          ? 'rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-600 dark:text-emerald-400'
                          : 'rounded-full bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-600 dark:text-amber-400'
                      }
                    >
                      {event.published ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td className="px-6 py-4 align-top">
                    <div className="flex justify-end gap-2">
                      <Button asChild variant="outline" className="rounded-xl">
                        <Link href={`/admin/events/${event.id}/edit`}>Edit</Link>
                      </Button>
                      <Button asChild className="rounded-xl">
                        <Link href={`/admin/upload?event=${event.id}`}>Upload</Link>
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
