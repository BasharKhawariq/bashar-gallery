import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';

import { upsertUserFromSupabaseUser } from '@/server/repositories/userRepository';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const next = requestUrl.searchParams.get('next') || '/admin';

  if (!code) {
    return NextResponse.redirect(new URL('/admin/login?error=missing_code', request.url));
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    return NextResponse.redirect(new URL('/admin/login?error=missing_env', request.url));
  }

  const safeNext = next.startsWith('/') ? next : '/admin';
  const response = NextResponse.redirect(new URL(safeNext, request.url));

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => {
          response.cookies.set({ name, value, ...options });
        });
      },
    },
  });

  const { data, error } = await supabase.auth.exchangeCodeForSession(code);

  if (error || !data.user?.id || !data.user.email) {
    return NextResponse.redirect(new URL('/admin/login?error=auth_failed', request.url));
  }

  await upsertUserFromSupabaseUser({
    id: data.user.id,
    email: data.user.email,
  });

  return response;
}
