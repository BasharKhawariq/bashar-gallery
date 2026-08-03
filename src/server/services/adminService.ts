import 'server-only';

import { redirect } from 'next/navigation';

import { getSupabaseUser } from '@/lib/supabase/server';
import { prisma } from '@/lib/prisma/client';

import { findUserById, upsertUserFromSupabaseUser } from '@/server/repositories/userRepository';

export async function syncCurrentSupabaseUserToAppUser() {
  const supabaseUser = await getSupabaseUser();

  if (!supabaseUser?.id || !supabaseUser.email) {
    return null;
  }

  return upsertUserFromSupabaseUser({
    id: supabaseUser.id,
    email: supabaseUser.email,
  });
}

export async function getCurrentAppUser() {
  const supabaseUser = await getSupabaseUser();

  if (!supabaseUser?.id || !supabaseUser.email) {
    return null;
  }

  const existing = await findUserById(supabaseUser.id);
  if (existing) {
    if (existing.email !== supabaseUser.email) {
      return upsertUserFromSupabaseUser({
        id: supabaseUser.id,
        email: supabaseUser.email,
        role: existing.role,
      });
    }

    return existing;
  }

  return upsertUserFromSupabaseUser({
    id: supabaseUser.id,
    email: supabaseUser.email,
  });
}

export async function isAdmin() {
  const user = await getCurrentAppUser();
  return user?.role === 'ADMIN';
}

export async function requireAdminOrRedirect() {
  const user = await getCurrentAppUser();

  if (!user) {
    redirect('/admin/login');
  }

  if (user.role !== 'ADMIN') {
    redirect('/');
  }

  return user;
}

export async function assertAdminApiUser() {
  const user = await getCurrentAppUser();

  if (!user) {
    return { ok: false as const, status: 401 as const };
  }

  if (user.role !== 'ADMIN') {
    return { ok: false as const, status: 403 as const };
  }

  return { ok: true as const, user };
}

export async function getAdminDashboardStats() {
  const [totalEvents, totalPhotos] = await Promise.all([
    prisma.event.count(),
    prisma.photo.count(),
  ]);

  return {
    totalEvents,
    totalPhotos,
    totalStorageLabel: 'Pending',
  };
}
