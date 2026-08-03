import Link from 'next/link';

import Container from '@/components/Layout/Container';
import { Button } from '@/components/ui/button';

import AdminActionPanel from '@/features/admin/components/AdminActionPanel';
import { createAdminEventAction } from '@/server/actions/adminEvents';
import AdminStatCard from '@/features/admin/components/AdminStatCard';
import { getAdminDashboardStats, requireAdminOrRedirect } from '@/server/services/adminService';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export default async function AdminDashboardPage() {
  await requireAdminOrRedirect();
  const stats = await getAdminDashboardStats();

  return (
    <section className="min-h-screen bg-background px-4 py-24">
      <Container className="space-y-10">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="space-y-3">
            <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground">
              Admin Dashboard
            </p>
            <h1 className="text-4xl font-black tracking-tight md:text-6xl">
              Production Control Room
            </h1>
            <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
              Fondasi admin untuk event management, upload flow, dan kontrol publikasi.
            </p>
          </div>

          <Button asChild variant="outline" className="rounded-2xl">
            <Link href="/">Back to Site</Link>
          </Button>
        </div>

        <AdminActionPanel createAction={createAdminEventAction} />

        <div className="grid gap-6 md:grid-cols-3">
          <AdminStatCard label="Total Events" value={String(stats.totalEvents)} />
          <AdminStatCard label="Total Photos" value={String(stats.totalPhotos)} />
          <AdminStatCard
            label="Total Storage"
            value={stats.totalStorageLabel}
            description="Placeholder until storage telemetry is wired."
          />
        </div>
      </Container>
    </section>
  );
}
