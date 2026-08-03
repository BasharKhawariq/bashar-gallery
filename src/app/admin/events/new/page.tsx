import AdminEventForm from '@/features/admin/components/AdminEventForm';
import AdminPageHeader from '@/features/admin/components/AdminPageHeader';
import AdminShell from '@/features/admin/components/AdminShell';
import { createAdminEventAction } from '@/server/actions/adminEvents';
import { requireAdminOrRedirect } from '@/server/services/adminService';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export default async function AdminCreateEventPage() {
  await requireAdminOrRedirect();

  return (
    <AdminShell>
      <AdminPageHeader
        eyebrow="Create Event"
        title="Add New Event"
        description="Siapkan metadata event lebih dulu agar upload photo batch bisa langsung diarahkan ke event yang tepat."
        secondaryAction={{ href: '/admin/events', label: 'Back to Events' }}
      />

      <AdminEventForm
        action={createAdminEventAction}
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
    </AdminShell>
  );
}
