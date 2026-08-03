'use client';

import { type FormEvent, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Mail } from 'lucide-react';

import { createSupabaseBrowserClient } from '@/lib/supabase/client';

export default function AdminLoginForm() {
  const searchParams = useSearchParams();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const next = searchParams.get('next');
  const callbackError = searchParams.get('error');

  const safeNext = next?.startsWith('/admin') ? next : '/admin';

  function getCallbackErrorMessage() {
    if (callbackError === 'missing_code') {
      return 'Link login tidak valid atau sudah kedaluwarsa.';
    }

    if (callbackError === 'auth_failed') {
      return 'Autentikasi gagal. Silakan minta magic link baru.';
    }

    if (callbackError === 'missing_env') {
      return 'Konfigurasi Supabase belum lengkap di environment variable.';
    }

    return null;
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setMessage(null);
    setError(null);

    try {
      const supabase = createSupabaseBrowserClient();
      const redirectTo = `${window.location.origin}/auth/callback?next=${encodeURIComponent(safeNext)}`;

      const { error: signInError } = await supabase.auth.signInWithOtp({
        email,
        options: { emailRedirectTo: redirectTo },
      });

      if (signInError) {
        setError(signInError.message);
        return;
      }

      setMessage('Magic link terkirim. Cek email untuk masuk ke dashboard admin.');
    } catch {
      setError('Gagal mengirim magic link. Coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <label className="block space-y-2">
        <span className="text-sm font-medium text-muted-foreground">Email</span>
        <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/10 px-4 py-3 backdrop-blur-md dark:border-white/10 dark:bg-white/5">
          <Mail className="h-4 w-4 text-muted-foreground" />
          <input
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@company.com"
            className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
        </div>
      </label>

      <button
        type="submit"
        disabled={loading}
        className="inline-flex w-full items-center justify-center rounded-2xl bg-primary px-5 py-3 font-semibold text-primary-foreground transition hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? 'Sending link...' : 'Send Magic Link'}
      </button>

      {message ? <p className="text-sm text-emerald-500">{message}</p> : null}
      {getCallbackErrorMessage() ? (
        <p className="text-sm text-red-500">{getCallbackErrorMessage()}</p>
      ) : null}
      {error ? <p className="text-sm text-red-500">{error}</p> : null}
    </form>
  );
}
