'use client';

import Link from 'next/link';
import { useMemo, useState, useTransition } from 'react';
import { useSearchParams } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { slugify } from '@/lib/utils';
import type { AdminEventFormValues } from '@/server/services/adminEventService';

import AdminSubmitButton from '@/features/admin/components/AdminSubmitButton';

type Props = {
  action: (formData: FormData) => void;
  defaultValues: AdminEventFormValues;
  submitLabel: string;
  pendingLabel: string;
};

function getStatusMessage(status: string | null) {
  if (status === 'created') {
    return 'Event berhasil dibuat.';
  }

  if (status === 'updated') {
    return 'Perubahan event berhasil disimpan.';
  }

  return null;
}

function getFormString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === 'string' ? value.trim() : '';
}

export default function AdminEventForm({
  action,
  defaultValues,
  submitLabel,
  pendingLabel,
}: Props) {
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [title, setTitle] = useState(defaultValues.title);
  const [slug, setSlug] = useState(defaultValues.slug);
  const [slugEdited, setSlugEdited] = useState(Boolean(defaultValues.slug));
  const [coverUrl, setCoverUrl] = useState(defaultValues.coverUrl);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [coverUploading, setCoverUploading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const helperSlug = useMemo(() => slugify(title), [title]);
  const statusMessage = getStatusMessage(searchParams.get('status'));
  const displayCover = coverPreview ?? coverUrl;

  async function uploadCoverToImageKit(file: File, eventSlug: string) {
    const uploadData = new FormData();
    uploadData.append('slug', eventSlug);
    uploadData.append('coverFile', file);

    const response = await fetch('/api/admin/cover', {
      method: 'POST',
      body: uploadData,
    });

    const payload = (await response.json()) as { coverUrl?: string; error?: string };

    if (!response.ok || !payload.coverUrl) {
      throw new Error(payload.error ?? 'Gagal meng-upload cover ke ImageKit.');
    }

    return payload.coverUrl;
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError(null);

    const form = event.currentTarget;
    const formData = new FormData(form);
    const eventSlug = slugify(getFormString(formData, 'slug') || title);

    const coverFile = formData.get('coverFile');
    const hasCoverFile = coverFile instanceof File && coverFile.size > 0;

    try {
      if (hasCoverFile) {
        setCoverUploading(true);
        const uploadedCoverUrl = await uploadCoverToImageKit(coverFile, eventSlug);
        formData.set('coverUrl', uploadedCoverUrl);
        setCoverUrl(uploadedCoverUrl);
        formData.delete('coverFile');
      }

      startTransition(() => {
        action(formData);
      });
    } catch (error) {
      setFormError(error instanceof Error ? error.message : 'Gagal menyimpan event.');
    } finally {
      setCoverUploading(false);
    }
  }

  return (
    <Card className="rounded-[2rem] border-border/60 bg-card/70 backdrop-blur-xl">
      <CardContent className="p-6 md:p-8">
        <form onSubmit={handleSubmit} encType="multipart/form-data" className="space-y-6">
          {defaultValues.id ? <input type="hidden" name="id" value={defaultValues.id} /> : null}

          {statusMessage ? (
            <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-600 dark:text-emerald-400">
              {statusMessage}
            </div>
          ) : null}

          {formError ? (
            <div className="rounded-2xl border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive">
              {formError}
            </div>
          ) : null}

          <div className="grid gap-6 md:grid-cols-2">
            <label className="space-y-2">
              <span className="text-sm font-medium text-muted-foreground">Title</span>
              <input
                name="title"
                required
                value={title}
                onChange={(event) => {
                  const nextTitle = event.target.value;
                  setTitle(nextTitle);

                  if (!slugEdited) {
                    setSlug(slugify(nextTitle));
                  }
                }}
                placeholder="Bashar Live in Surabaya"
                className="w-full rounded-2xl border border-border/60 bg-background/60 px-4 py-3 text-sm outline-none transition focus:border-primary"
              />
            </label>

            <label className="space-y-2">
              <span className="text-sm font-medium text-muted-foreground">Slug</span>
              <input
                name="slug"
                required
                value={slug}
                onChange={(event) => {
                  setSlugEdited(true);
                  setSlug(slugify(event.target.value));
                }}
                placeholder="bashar-live-in-surabaya"
                className="w-full rounded-2xl border border-border/60 bg-background/60 px-4 py-3 text-sm outline-none transition focus:border-primary"
              />
              <p className="text-xs text-muted-foreground">
                Rekomendasi slug: <span className="font-mono">{helperSlug || 'event-slug'}</span>
              </p>
            </label>

            <label className="space-y-2">
              <span className="text-sm font-medium text-muted-foreground">Event Date</span>
              <input
                type="date"
                name="eventDate"
                defaultValue={defaultValues.eventDate}
                className="w-full rounded-2xl border border-border/60 bg-background/60 px-4 py-3 text-sm outline-none transition focus:border-primary"
              />
            </label>

            <label className="space-y-2">
              <span className="text-sm font-medium text-muted-foreground">Location</span>
              <input
                name="location"
                defaultValue={defaultValues.location}
                placeholder="Surabaya"
                className="w-full rounded-2xl border border-border/60 bg-background/60 px-4 py-3 text-sm outline-none transition focus:border-primary"
              />
            </label>
          </div>

          <label className="space-y-2">
            <span className="text-sm font-medium text-muted-foreground">Description</span>
            <textarea
              name="description"
              defaultValue={defaultValues.description}
              rows={5}
              placeholder="Deskripsi singkat event untuk halaman publik."
              className="w-full rounded-2xl border border-border/60 bg-background/60 px-4 py-3 text-sm outline-none transition focus:border-primary"
            />
          </label>

          <label className="space-y-2">
            <span className="text-sm font-medium text-muted-foreground">Cover URL</span>
            <input
              type="text"
              name="coverUrl"
              value={coverUrl}
              onChange={(event) => setCoverUrl(event.target.value)}
              placeholder="https://ik.imagekit.io/... atau /events/previews/..."
              className="w-full rounded-2xl border border-border/60 bg-background/60 px-4 py-3 text-sm outline-none transition focus:border-primary"
            />
            <p className="text-xs text-muted-foreground">
              Bisa diisi manual, atau akan otomatis diganti jika kamu upload cover baru di bawah.
            </p>
          </label>

          <div className="grid gap-6 md:grid-cols-[1fr_0.9fr]">
            <label className="space-y-2">
              <span className="text-sm font-medium text-muted-foreground">Upload Cover</span>
              <input
                type="file"
                name="coverFile"
                accept="image/jpeg,image/png,image/webp"
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  if (!file) {
                    setCoverPreview(null);
                    return;
                  }

                  setCoverPreview(URL.createObjectURL(file));
                }}
                className="w-full rounded-2xl border border-border/60 bg-background/60 px-4 py-3 text-sm outline-none transition file:mr-4 file:rounded-xl file:border-0 file:bg-primary file:px-3 file:py-2 file:text-sm file:font-medium file:text-primary-foreground hover:file:brightness-95 focus:border-primary"
              />
              <p className="text-xs text-muted-foreground">
                File cover baru di-upload ke ImageKit (`/events/[slug]/cover`) lalu disimpan sebagai
                `coverUrl`.
              </p>
            </label>

            <div className="space-y-2">
              <span className="text-sm font-medium text-muted-foreground">Current Cover</span>
              <div className="overflow-hidden rounded-2xl border border-border/60 bg-background/40">
                {displayCover ? (
                  <>
                    {}
                    <img
                      src={displayCover}
                      alt={title || defaultValues.title}
                      className="h-48 w-full object-cover"
                    />
                    <div className="border-t border-border/60 px-4 py-3 text-xs text-muted-foreground">
                      {coverPreview
                        ? 'Preview cover baru (belum disimpan).'
                        : 'Preview cover saat ini.'}
                    </div>
                  </>
                ) : (
                  <div className="flex h-48 items-center justify-center px-4 text-sm text-muted-foreground">
                    Belum ada cover untuk event ini.
                  </div>
                )}
              </div>
            </div>
          </div>

          <label className="flex items-center gap-3 rounded-2xl border border-border/60 bg-background/60 px-4 py-3 text-sm">
            <input
              type="checkbox"
              name="published"
              defaultChecked={defaultValues.published}
              className="h-4 w-4 rounded border-border"
            />
            <span>Publish event ke halaman gallery</span>
          </label>

          <div className="flex flex-wrap gap-3">
            <AdminSubmitButton
              pendingLabel={coverUploading ? 'Uploading cover...' : pendingLabel}
              className="rounded-2xl"
              forcePending={coverUploading || isPending}
            >
              {submitLabel}
            </AdminSubmitButton>

            <Button asChild variant="outline" className="rounded-2xl">
              <Link href="/admin/events">Back to Events</Link>
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
