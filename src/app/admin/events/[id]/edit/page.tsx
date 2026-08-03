import { Card, CardContent } from '@/components/ui/card';
import AdminDeleteEventButton from '@/features/admin/components/AdminDeleteEventButton';
import AdminEventForm from '@/features/admin/components/AdminEventForm';
import AdminPageHeader from '@/features/admin/components/AdminPageHeader';
import AdminShell from '@/features/admin/components/AdminShell';
import { deleteAdminEventAction, updateAdminEventAction } from '@/server/actions/adminEvents';
import { requireAdminOrRedirect } from '@/server/services/adminService';
import { getAdminEventByIdOrThrow } from '@/server/services/adminEventService';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type Props = {
  params: Promise<{ id: string }>;
};

export default async function AdminEditEventPage({ params }: Props) {
  await requireAdminOrRedirect();

  const { id } = await params;
  const event = await getAdminEventByIdOrThrow(id);

  return (
    <AdminShell>
      <AdminPageHeader
        eyebrow="Edit Event"
        title={event.title}
        description="Update metadata event, ubah status publish, atau hapus event jika sudah tidak dipakai."
        primaryAction={{ href: `/admin/upload?event=${event.id}`, label: 'Upload Photos' }}
        secondaryAction={{ href: '/admin/events', label: 'Back to Events' }}
      />

      <AdminEventForm
        action={updateAdminEventAction}
        defaultValues={event}
        submitLabel="Save Changes"
        pendingLabel="Saving..."
      />

      <Card className="rounded-[2rem] border-destructive/20 bg-destructive/5 backdrop-blur-xl">
        <CardContent className="space-y-4 p-6">
          <div className="space-y-2">
            <h2 className="text-xl font-bold">Danger Zone</h2>
            <p className="text-sm leading-6 text-muted-foreground">
              Menghapus event akan menghapus record event dan foto dari database. Folder `/events/
              {event.slug}` di ImageKit juga akan dicoba untuk dihapus.
            </p>
          </div>

          <AdminDeleteEventButton
            eventId={event.id ?? id}
            eventTitle={event.title}
            action={deleteAdminEventAction}
          />
        </CardContent>
      </Card>
    </AdminShell>
  );
}
