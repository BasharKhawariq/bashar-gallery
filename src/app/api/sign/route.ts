import { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { sign } from '@/lib/signature';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const event = String(body.event || '');
    const file = String(body.file || '');

    if (!event || !file) {
      return NextResponse.json({ error: 'missing' }, { status: 400 });
    }

    const session = crypto.randomUUID();
    const expires = Date.now() + 5 * 60 * 1000; // 5 minutes
    const payload = `${event}/${file}/${session}`;
    const sig = sign(payload, expires);

    const origin = req.headers.get('origin') || '';
    const base = origin || '';
    const url = `${base}/api/image?event=${encodeURIComponent(event)}&file=${encodeURIComponent(
      file
    )}&session=${encodeURIComponent(session)}&expires=${expires}&sig=${sig}`;

    return NextResponse.json({ url });
  } catch (err) {
    return NextResponse.json({ error: 'invalid' }, { status: 400 });
  }
}
