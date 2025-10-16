import { NextResponse } from 'next/server';
import { mkdir, writeFile } from 'fs/promises';
import path from 'path';

import { verifySessionToken } from '@/lib/auth';

export const dynamic = 'force-dynamic';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_MIME = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

export async function POST(request) {
  const token = request.cookies.get('admin_token')?.value;

  if (!verifySessionToken(token)) {
    return NextResponse.json({ message: 'ไม่ได้รับอนุญาต' }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get('file');

  if (!file || typeof file === 'string') {
    return NextResponse.json({ message: 'ไม่พบไฟล์ที่ต้องการอัปโหลด' }, { status: 400 });
  }

  if (file.size > MAX_FILE_SIZE) {
    return NextResponse.json({ message: 'ไฟล์มีขนาดใหญ่เกินไป (สูงสุด 5MB)' }, { status: 400 });
  }

  if (!ALLOWED_MIME.includes(file.type)) {
    return NextResponse.json({ message: 'รองรับเฉพาะไฟล์รูปภาพเท่านั้น' }, { status: 400 });
  }

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
  await mkdir(uploadsDir, { recursive: true });

  const extension = path.extname(file.name) || '.png';
  const uniqueName = `${Date.now()}-${Math.random().toString(16).slice(2)}${extension}`;
  const filePath = path.join(uploadsDir, uniqueName);

  await writeFile(filePath, buffer);

  return NextResponse.json({ url: `/uploads/${uniqueName}` }, { status: 201 });
}
