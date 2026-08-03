'use client';

import { useState } from 'react';

import { Button } from '@/components/ui/button';

import AdminSubmitButton from '@/features/admin/components/AdminSubmitButton';

type Props = {
  eventId: string;
  eventTitle: string;
  action: (formData: FormData) => void;
};

export default function AdminDeleteEventButton({ eventId, eventTitle, action }: Props) {
  const [confirmed, setConfirmed] = useState(false);

  if (!confirmed) {
    return (
      <Button
        type="button"
        variant="destructive"
        className="rounded-2xl"
        onClick={() => setConfirmed(true)}
      >
        Delete Event
      </Button>
    );
  }

  return (
    <form action={action} className="flex flex-wrap items-center gap-3">
      <input type="hidden" name="id" value={eventId} />
      <p className="text-sm text-muted-foreground">
        Hapus permanen event &quot;{eventTitle}&quot;?
      </p>
      <AdminSubmitButton pendingLabel="Deleting..." variant="destructive" className="rounded-2xl">
        Confirm Delete
      </AdminSubmitButton>
      <Button
        type="button"
        variant="outline"
        className="rounded-2xl"
        onClick={() => setConfirmed(false)}
      >
        Cancel
      </Button>
    </form>
  );
}
