import { NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs/promises';

import { verifySessionToken } from '@/lib/auth';

export const dynamic = 'force-dynamic';

const ALLOWED_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg']);
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

function sanitizeSegment(value, fallback) {
  if (!value) {
    return fallback;
  }

  return (
    String(value)
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '') || fallback
  );
}

function sanitizeFilename(originalName) {
  const baseName = originalName ? path.parse(originalName).name : 'upload';
  const extension = originalName ? path.extname(originalName) : '';
  const safeBase = baseName.replace(/[^a-zA-Z0-9-_]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
  const safeExt = extension.toLowerCase();
  return `${safeBase || 'file'}${safeExt}`;
}

export async function POST(request) {
  const token = request.cookies.get('admin_token')?.value;

  if (!verifySessionToken(token)) {
    return NextResponse.json({ message: 'ไม่ได้รับอนุญาต' }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get('file');
  const scope = sanitizeSegment(formData.get('scope'), 'general');

  if (!file || typeof file === 'string') {
    return NextResponse.json({ message: 'กรุณาเลือกไฟล์ภาพ' }, { status: 400 });
  }

  if (file.size > MAX_FILE_SIZE) {
    return NextResponse.json({ message: 'ไฟล์มีขนาดใหญ่เกินไป (สูงสุด 5MB)' }, { status: 400 });
  }

  const originalName = file.name || 'upload';
  const extension = path.extname(originalName).toLowerCase();

  if (!ALLOWED_EXTENSIONS.has(extension)) {
    return NextResponse.json({ message: 'รองรับเฉพาะไฟล์ภาพ (JPG, PNG, GIF, WEBP, SVG)' }, { status: 400 });
  }

  const filename = `${Date.now()}-${sanitizeFilename(originalName)}`;
  const uploadsDir = path.join(process.cwd(), 'public', 'uploads', scope);
  const filePath = path.join(uploadsDir, filename);

  await fs.mkdir(uploadsDir, { recursive: true });

  const buffer = Buffer.from(await file.arrayBuffer());
  await fs.writeFile(filePath, buffer);

  const publicPath = path.posix.join('/uploads', scope, filename);

  return NextResponse.json(
    {
      message: 'อัปโหลดไฟล์สำเร็จ',
      path: publicPath
    },
    { status: 201 }
  );
}
