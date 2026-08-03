'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import CreateEventModal from './CreateEventModal';

type Props = {
  createAction: (formData: FormData) => void;
};

export default function AdminActionPanel({ createAction }: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="grid gap-3 sm:grid-cols-2">
        <Button type="button" size="lg" className="rounded-2xl" onClick={() => setOpen(true)}>
          Create Event
        </Button>
        <Button
          type="button"
          variant="outline"
          size="lg"
          className="rounded-2xl border-border/60"
          onClick={() => router.push('/admin/upload')}
        >
          Upload Photos
        </Button>
      </div>

      <CreateEventModal open={open} onOpenChange={setOpen} action={createAction} />
    </>
  );
}
