import crypto from 'crypto';
import { promises as fs } from 'fs';
import path from 'path';

const UPLOADS_DIR = path.join(process.cwd(), 'public', 'uploads');
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
const ALLOWED_MIME_TYPES = new Map([
  ['image/jpeg', 'jpg'],
  ['image/png', 'png'],
  ['image/webp', 'webp']
]);
const ALLOWED_EXTENSIONS = new Set(['jpg', 'jpeg', 'png', 'webp']);

async function ensureUploadsDirectory() {
  await fs.mkdir(UPLOADS_DIR, { recursive: true });
}

function resolveExtension(file) {
  if (!file) {
    return null;
  }

  const mimeExtension = ALLOWED_MIME_TYPES.get(file.type);
  if (mimeExtension) {
    return mimeExtension;
  }

  const rawExtension = typeof file.name === 'string' ? path.extname(file.name).toLowerCase().replace('.', '') : '';
  if (!rawExtension) {
    return null;
  }

  if (!ALLOWED_EXTENSIONS.has(rawExtension)) {
    return null;
  }

  return rawExtension === 'jpeg' ? 'jpg' : rawExtension;
}

function isValidUpload(file) {
  return file && typeof file === 'object' && typeof file.arrayBuffer === 'function';
}

export async function saveUploadedImage(file) {
  if (!isValidUpload(file) || file.size === 0) {
    return null;
  }

  if (file.size > MAX_FILE_SIZE) {
    throw new Error('ขนาดไฟล์ภาพต้องไม่เกิน 5 MB');
  }

  const extension = resolveExtension(file);

  if (!extension) {
    throw new Error('รองรับเฉพาะไฟล์ภาพ JPG, PNG หรือ WebP');
  }

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  if (buffer.length === 0) {
    throw new Error('ไม่สามารถอ่านไฟล์ภาพได้');
  }

  await ensureUploadsDirectory();

  const filename = `${Date.now()}-${crypto.randomUUID()}.${extension}`;
  const filePath = path.join(UPLOADS_DIR, filename);

  await fs.writeFile(filePath, buffer);

  return `/uploads/${filename}`;
}

export async function deleteUploadedFile(publicPath) {
  if (!publicPath || typeof publicPath !== 'string') {
    return;
  }

  if (!publicPath.startsWith('/uploads/')) {
    return;
  }

  const filename = path.basename(publicPath);
  const filePath = path.join(UPLOADS_DIR, filename);

  try {
    await fs.unlink(filePath);
  } catch (error) {
    if (error.code !== 'ENOENT') {
      throw error;
    }
  }
}
