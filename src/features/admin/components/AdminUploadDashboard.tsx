'use client';

import { useMemo, useRef, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

type UploadEventOption = {
  id: string;
  title: string;
  slug: string;
  photoCount: number;
};

type Props = {
  events: UploadEventOption[];
  initialEventId?: string;
};

function formatFileSize(bytes: number) {
  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }

  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export default function AdminUploadDashboard({ events, initialEventId }: Props) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [selectedEventId, setSelectedEventId] = useState(initialEventId ?? events[0]?.id ?? '');
  const [files, setFiles] = useState<File[]>([]);
  const [dragging, setDragging] = useState(false);
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const selectedEvent = useMemo(
    () => events.find((event) => event.id === selectedEventId) ?? null,
    [events, selectedEventId]
  );

  function addFiles(nextFiles: FileList | File[]) {
    const uniqueFiles = Array.from(nextFiles).filter((file) =>
      /image\/(jpeg|jpg|png|webp)/i.test(file.type)
    );

    setFiles((current) => {
      const map = new Map<string, File>();

      for (const file of [...current, ...uniqueFiles]) {
        map.set(`${file.name}-${file.size}-${file.lastModified}`, file);
      }

      return Array.from(map.values());
    });
  }

  function resetFeedback() {
    setMessage(null);
    setError(null);
  }

  async function handleUpload() {
    if (!selectedEvent) {
      setError('Pilih event terlebih dahulu.');
      return;
    }

    if (files.length === 0) {
      setError('Tambahkan minimal satu file gambar.');
      return;
    }

    resetFeedback();
    setUploading(true);
    setProgress(0);

    const formData = new FormData();
    formData.append('slug', selectedEvent.slug);
    formData.append('title', selectedEvent.title);

    for (const file of files) {
      formData.append('files', file);
    }

    const result = await new Promise<{ ok: boolean; message: string }>((resolve) => {
      const xhr = new XMLHttpRequest();
      xhr.open('POST', '/api/admin/upload');

      xhr.upload.onprogress = (event) => {
        if (!event.lengthComputable) {
          return;
        }

        setProgress(Math.round((event.loaded / event.total) * 100));
      };

      xhr.onload = () => {
        try {
          const response = JSON.parse(xhr.responseText) as {
            error?: string;
            uploaded?: number;
            event?: { title: string };
          };

          if (xhr.status >= 200 && xhr.status < 300) {
            resolve({
              ok: true,
              message: `Upload selesai. ${response.uploaded ?? files.length} file masuk ke ${selectedEvent.title}.`,
            });
            return;
          }

          resolve({
            ok: false,
            message: response.error ?? 'Upload gagal.',
          });
        } catch {
          resolve({
            ok: false,
            message: 'Upload gagal diproses.',
          });
        }
      };

      xhr.onerror = () => {
        resolve({
          ok: false,
          message: 'Terjadi error jaringan saat upload.',
        });
      };

      xhr.send(formData);
    });

    if (result.ok) {
      setMessage(result.message);
      setFiles([]);
      setProgress(100);
    } else {
      setError(result.message);
    }

    setUploading(false);
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
      <Card className="rounded-[2rem] border-border/60 bg-card/70 backdrop-blur-xl">
        <CardContent className="space-y-6 p-6 md:p-8">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">Target Event</p>
            <select
              value={selectedEventId}
              onChange={(event) => {
                resetFeedback();
                setSelectedEventId(event.target.value);
              }}
              className="w-full rounded-2xl border border-border/60 bg-background/60 px-4 py-3 text-sm outline-none transition focus:border-primary"
            >
              {events.length === 0 ? <option value="">No events available</option> : null}
              {events.map((event) => (
                <option key={event.id} value={event.id}>
                  {event.title} ({event.photoCount} photos)
                </option>
              ))}
            </select>
          </div>

          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            onDragOver={(event) => {
              event.preventDefault();
              setDragging(true);
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={(event) => {
              event.preventDefault();
              setDragging(false);
              addFiles(event.dataTransfer.files);
            }}
            className={
              dragging
                ? 'flex min-h-72 w-full flex-col items-center justify-center rounded-[2rem] border-2 border-dashed border-primary bg-primary/5 px-6 py-10 text-center transition'
                : 'flex min-h-72 w-full flex-col items-center justify-center rounded-[2rem] border-2 border-dashed border-border/60 bg-background/40 px-6 py-10 text-center transition hover:border-primary/40'
            }
          >
            <span className="text-lg font-semibold">Drag & drop photos here</span>
            <span className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">
              Upload banyak file sekaligus ke ImageKit. Preview `.webp` akan digenerate otomatis
              dari file original.
            </span>
            <span className="mt-4 rounded-full bg-muted px-4 py-2 text-xs font-medium text-muted-foreground">
              JPEG, PNG, atau WEBP
            </span>
          </button>

          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            multiple
            className="hidden"
            onChange={(event) => {
              if (event.target.files) {
                addFiles(event.target.files);
              }
            }}
          />

          {files.length > 0 ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">Queued Files</p>
                <Button
                  type="button"
                  variant="outline"
                  className="rounded-2xl"
                  onClick={() => setFiles([])}
                  disabled={uploading}
                >
                  Clear Queue
                </Button>
              </div>

              <div className="max-h-72 space-y-2 overflow-y-auto rounded-2xl border border-border/60 bg-background/40 p-3">
                {files.map((file) => (
                  <div
                    key={`${file.name}-${file.size}-${file.lastModified}`}
                    className="flex items-center justify-between rounded-xl border border-border/60 bg-background/80 px-4 py-3"
                  >
                    <div className="min-w-0">
                      <p className="truncate font-medium">{file.name}</p>
                      <p className="text-xs text-muted-foreground">{formatFileSize(file.size)}</p>
                    </div>
                    <button
                      type="button"
                      className="text-xs font-medium text-muted-foreground transition hover:text-foreground"
                      onClick={() =>
                        setFiles((current) =>
                          current.filter(
                            (currentFile) =>
                              `${currentFile.name}-${currentFile.size}-${currentFile.lastModified}` !==
                              `${file.name}-${file.size}-${file.lastModified}`
                          )
                        )
                      }
                      disabled={uploading}
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Upload Progress</span>
              <span className="font-medium">{progress}%</span>
            </div>
            <div className="h-3 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-primary transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {message ? (
            <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-600 dark:text-emerald-400">
              {message}
            </div>
          ) : null}

          {error ? (
            <div className="rounded-2xl border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive">
              {error}
            </div>
          ) : null}

          <div className="flex flex-wrap gap-3">
            <Button
              type="button"
              className="rounded-2xl"
              onClick={handleUpload}
              disabled={uploading || files.length === 0 || !selectedEvent}
            >
              {uploading ? 'Uploading...' : 'Upload Photos'}
            </Button>

            <Button
              type="button"
              variant="outline"
              className="rounded-2xl"
              onClick={() => inputRef.current?.click()}
              disabled={uploading}
            >
              Choose Files
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-[2rem] border-border/60 bg-card/70 backdrop-blur-xl">
        <CardContent className="space-y-6 p-6">
          <div className="space-y-2">
            <p className="text-sm uppercase tracking-[0.25em] text-muted-foreground">
              Upload Rules
            </p>
            <h2 className="text-2xl font-black tracking-tight">ImageKit Pipeline</h2>
          </div>

          <div className="space-y-4 text-sm leading-6 text-muted-foreground">
            <p>File original di-upload ke folder `/events/[slug]/originals` pada ImageKit.</p>
            <p>
              Preview URL `.webp` dibuat otomatis dengan transformasi width dan quality dari env.
            </p>
            <p>Bulk upload aman untuk satu event aktif dalam satu sesi dashboard.</p>
            <p>Event sebaiknya dibuat dulu di admin events agar metadata tetap rapi.</p>
          </div>

          {selectedEvent ? (
            <div className="rounded-2xl border border-border/60 bg-background/40 p-4 text-sm">
              <p className="font-semibold">{selectedEvent.title}</p>
              <p className="mt-1 font-mono text-xs text-muted-foreground">{selectedEvent.slug}</p>
              <p className="mt-2 text-muted-foreground">
                Existing photos:{' '}
                <span className="font-medium text-foreground">{selectedEvent.photoCount}</span>
              </p>
            </div>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
}
