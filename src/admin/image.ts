import { AdminError } from './github';

const MAX_SIDE = 1600;

const stamp = () => new Date().toISOString().replace(/[-:T]/g, '').slice(0, 12); // 202610131045

const blobToBase64 = (blob: Blob): Promise<string> =>
  new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(String(r.result).split(',')[1] ?? '');
    r.onerror = () => reject(r.error);
    r.readAsDataURL(blob);
  });

/**
 * Shrinks a photo to at most 1600px on its longest side, so a 10 MB phone photo becomes a few hundred KB.
 * WebP keeps a cut-out bag's transparent background; browsers that cannot write WebP get a JPEG on white.
 * Each upload gets a new file name, so visitors never see an old cached picture.
 */
export async function preparePhoto(file: File, slug: string): Promise<{ sitePath: string; base64: string; previewUrl: string }> {
  if (!/^image\/(jpeg|png|webp)$/.test(file.type)) throw new AdminError('Choose a JPG, PNG or WebP photo.');

  let bitmap: ImageBitmap;
  try {
    bitmap = await createImageBitmap(file);
  } catch {
    throw new AdminError('That photo could not be opened. Try saving it as a JPG first.');
  }
  const scale = Math.min(1, MAX_SIDE / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement('canvas');
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  const ctx = canvas.getContext('2d')!;

  const encode = (type: string) => new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, type, 0.86));
  ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  let blob = await encode('image/webp');
  let ext = 'webp';
  if (!blob || blob.type !== 'image/webp') {
    ctx.globalCompositeOperation = 'destination-over'; // white behind any transparent parts
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    blob = await encode('image/jpeg');
    ext = 'jpg';
  }
  bitmap.close();
  if (!blob) throw new AdminError('That photo could not be prepared. Try a different picture.');

  return {
    sitePath: `products/${slug}-${stamp()}.${ext}`,
    base64: await blobToBase64(blob),
    previewUrl: URL.createObjectURL(blob),
  };
}
