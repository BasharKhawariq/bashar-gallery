import ImageKit from 'imagekit';

let cached: ImageKit | null = null;

export function getImageKit() {
  if (cached) return cached;

  const publicKey = process.env.IMAGEKIT_PUBLIC_KEY;
  const privateKey = process.env.IMAGEKIT_PRIVATE_KEY;
  const urlEndpoint = process.env.IMAGEKIT_URL_ENDPOINT;

  if (!publicKey || !privateKey || !urlEndpoint) {
    throw new Error('Missing ImageKit credentials');
  }

  cached = new ImageKit({
    publicKey,
    privateKey,
    urlEndpoint,
  });

  return cached;
}
