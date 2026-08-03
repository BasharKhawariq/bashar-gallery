import { redirect } from 'next/navigation';

import Container from '@/components/Layout/Container';

import AdminLoginForm from '@/features/admin/components/AdminLoginForm';
import { getCurrentAppUser } from '@/server/services/adminService';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export default async function AdminLoginPage() {
  const user = await getCurrentAppUser();

  if (user?.role === 'ADMIN') {
    redirect('/admin');
  }

  if (user) {
    redirect('/');
  }

  return (
    <section className="min-h-screen bg-background px-4 py-24">
      <Container className="flex min-h-[calc(100vh-12rem)] items-center justify-center">
        <div className="w-full max-w-lg rounded-[2rem] border border-white/10 bg-white/10 p-8 shadow-2xl backdrop-blur-2xl dark:bg-black/20">
          <div className="mb-8 space-y-3 text-center">
            <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground">Admin Access</p>
            <h1 className="text-3xl font-black tracking-tight md:text-4xl">Login to Dashboard</h1>
            <p className="text-sm leading-6 text-muted-foreground">
              Masuk dengan magic link Supabase untuk mengakses area admin.
            </p>
          </div>

          <AdminLoginForm />
        </div>
      </Container>
    </section>
  );
}
