import AdminEventTable from '@/features/admin/components/AdminEventTable';
import AdminPageHeader from '@/features/admin/components/AdminPageHeader';
import AdminShell from '@/features/admin/components/AdminShell';
import { requireAdminOrRedirect } from '@/server/services/adminService';
import { getAdminEvents } from '@/server/services/adminEventService';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type Props = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

function getBannerMessage(params: Record<string, string | string[] | undefined>) {
  const status = typeof params.status === 'string' ? params.status : undefined;
  const error = typeof params.error === 'string' ? params.error : undefined;

  if (status === 'deleted') {
    return {
      tone: 'success' as const,
      text: 'Event berhasil dihapus dari database admin.',
    };
  }

  if (error === 'missing_id') {
    return {
      tone: 'error' as const,
      text: 'Event tidak ditemukan untuk aksi yang diminta.',
    };
  }

  return null;
}

export default async function AdminEventsPage({ searchParams }: Props) {
  await requireAdminOrRedirect();

  const [events, params] = await Promise.all([
    getAdminEvents(),
    searchParams ?? Promise.resolve({}),
  ]);
  const banner = getBannerMessage(params);

  return (
    <AdminShell>
      <AdminPageHeader
        eyebrow="Admin Events"
        title="Manage Event Catalog"
        description="Buat, edit, dan hapus event gallery dari area admin. Setiap event menjadi target utama untuk upload batch ke ImageKit."
        primaryAction={{ href: '/admin/events/new', label: 'Create Event' }}
        secondaryAction={{ href: '/admin', label: 'Back to Dashboard' }}
      />

      {banner ? (
        <div
          className={
            banner.tone === 'success'
              ? 'rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-600 dark:text-emerald-400'
              : 'rounded-2xl border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive'
          }
        >
          {banner.text}
        </div>
      ) : null}

      <AdminEventTable events={events} />
    </AdminShell>
  );
}
