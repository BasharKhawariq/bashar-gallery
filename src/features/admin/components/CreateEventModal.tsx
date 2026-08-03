'use client';

import { Dialog, DialogContent } from '@/components/ui/dialog';
import AdminEventForm from './AdminEventForm';

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  action: (formData: FormData) => void;
};

export default function CreateEventModal({ open, onOpenChange, action }: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <AdminEventForm
          action={action}
          defaultValues={{
            title: '',
            slug: '',
            description: '',
            location: '',
            eventDate: '',
            coverUrl: '',
            published: false,
          }}
          submitLabel="Create Event"
          pendingLabel="Creating..."
        />
      </DialogContent>
    </Dialog>
  );
}
