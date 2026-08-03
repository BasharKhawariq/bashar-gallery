import crypto from 'crypto';

const SECRET = process.env.SIGN_SECRET ?? 'dev-secret-change-me';

export function sign(payload: string, expires: number) {
  const h = crypto.createHmac('sha256', SECRET).update(`${payload}:${expires}`).digest('hex');
  return h;
}

export function verify(payload: string, expires: number, sig: string) {
  if (Number(expires) < Date.now()) return false;

  const expected = sign(payload, Number(expires));
  try {
    const a = Buffer.from(expected, 'hex');
    const b = Buffer.from(sig, 'hex');
    if (a.length !== b.length) return false;
    return crypto.timingSafeEqual(a, b);
  } catch {
    return false;
  }
}
