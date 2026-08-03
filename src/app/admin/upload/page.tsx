import AdminPageHeader from '@/features/admin/components/AdminPageHeader';
import AdminShell from '@/features/admin/components/AdminShell';
import AdminUploadDashboard from '@/features/admin/components/AdminUploadDashboard';
import { requireAdminOrRedirect } from '@/server/services/adminService';
import { getAdminEvents } from '@/server/services/adminEventService';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type Props = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function AdminUploadPage({ searchParams }: Props) {
  await requireAdminOrRedirect();

  const [events, params] = await Promise.all([
    getAdminEvents(),
    searchParams ?? Promise.resolve({} as Record<string, string | string[] | undefined>),
  ]);
  const initialEventId = typeof params.event === 'string' ? params.event : undefined;

  return (
    <AdminShell>
      <AdminPageHeader
        eyebrow="Upload Dashboard"
        title="ImageKit Bulk Upload"
        description="Drag and drop file ke event yang sudah dibuat. Semua upload masuk ke ImageKit dan preview webp dibentuk otomatis dari original."
        primaryAction={{ href: '/admin/events/new', label: 'Create Event' }}
        secondaryAction={{ href: '/admin/events', label: 'Manage Events' }}
      />

      <AdminUploadDashboard
        events={events.map((event) => ({
          id: event.id,
          title: event.title,
          slug: event.slug,
          photoCount: event.photoCount,
        }))}
        initialEventId={initialEventId}
      />
    </AdminShell>
  );
}
