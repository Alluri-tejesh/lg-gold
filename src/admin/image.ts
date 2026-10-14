import { AdminError } from './api';

const MAX_SIDE = 1600;

/**
 * Shrinks a photo to at most 1600px on its longest side, so a 10 MB phone photo becomes a few hundred KB.
 * WebP keeps a cut-out bag's transparent background; browsers that cannot write WebP get a JPEG on white.
 * The photo is uploaded when the admin presses Save; each upload gets a new address, so nobody sees an old cached picture.
 */
export async function preparePhoto(file: File): Promise<{ blob: Blob; previewUrl: string }> {
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
  if (!blob || blob.type !== 'image/webp') {
    ctx.globalCompositeOperation = 'destination-over'; // white behind any transparent parts
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    blob = await encode('image/jpeg');
  }
  bitmap.close();
  if (!blob) throw new AdminError('That photo could not be prepared. Try a different picture.');

  return { blob, previewUrl: URL.createObjectURL(blob) };
}
