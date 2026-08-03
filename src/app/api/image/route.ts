import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { NextRequest } from 'next/server';

import { verify } from '@/lib/signature';

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const event = url.searchParams.get('event') || '';
  const file = url.searchParams.get('file') || '';
  const session = url.searchParams.get('session') || '';
  const expires = url.searchParams.get('expires') || '';
  const sig = url.searchParams.get('sig') || '';

  if (!event || !file || !session || !expires || !sig) {
    return new Response('Bad request', { status: 400 });
  }

  const payload = `${event}/${file}/${session}`;
  if (!verify(payload, Number(expires), sig)) {
    return new Response('Unauthorized', { status: 401 });
  }

  const previewsPath = path.join(process.cwd(), 'public', 'events', 'previews');
  const safeEvent = path.basename(event);
  const safeFile = path.basename(file);
  const imgPath = path.join(previewsPath, safeEvent, safeFile);

  if (!fs.existsSync(imgPath)) {
    return new Response('Not found', { status: 404 });
  }

  try {
    const img = sharp(imgPath);
    const meta = await img.metadata();
    const width = meta.width || 800;

    const svg = `
      <svg width="${width}" height="80" xmlns="http://www.w3.org/2000/svg">
        <style>
          .s { fill: rgba(255,255,255,0.3); font-size:14px; font-family: Arial, sans-serif; }
        </style>
        <text x="98%" y="50%" dominant-baseline="middle" text-anchor="end" class="s">${session}</text>
      </svg>
    `;

    const out = await img
      .composite([
        {
          input: Buffer.from(svg),
          gravity: 'south',
        },
      ])
      .toFormat('webp')
      .toBuffer();

    return new Response(new Uint8Array(out), {
      status: 200,
      headers: { 'Content-Type': 'image/webp', 'Cache-Control': 'public, max-age=60' },
    });
  } catch (err) {
    return new Response('Internal', { status: 500 });
  }
}
