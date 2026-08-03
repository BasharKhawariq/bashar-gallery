import { prisma } from '@/lib/prisma/client';

import type { Role, User } from '@prisma/client';

export async function findUserById(id: string) {
  return prisma.user.findUnique({ where: { id } });
}

export async function upsertUserFromSupabaseUser(data: { id: string; email: string; role?: Role }) {
  return prisma.user.upsert({
    where: { id: data.id },
    create: {
      id: data.id,
      email: data.email,
      role: data.role ?? 'USER',
    },
    update: {
      email: data.email,
      role: data.role ?? undefined,
    },
  });
}

export async function listUsers() {
  return prisma.user.findMany({ orderBy: { createdAt: 'desc' } });
}

export type AppUser = User;
