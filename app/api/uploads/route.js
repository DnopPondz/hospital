import { NextResponse } from 'next/server';

import { verifySessionToken } from '@/lib/auth';
import { getCloudinary, isCloudinaryConfigured } from '@/lib/cloudinary';

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
  const baseName = originalName ? originalName.replace(/\.[^.]+$/, '') : 'upload';
  const safeBase = baseName.replace(/[^a-zA-Z0-9-_]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
  return safeBase || 'file';
}

async function uploadToCloudinary(buffer, { scope, originalName }) {
  if (!isCloudinaryConfigured) {
    throw new Error('ยังไม่ได้ตั้งค่า Cloudinary กรุณาตรวจสอบตัวแปรสภาพแวดล้อม');
  }

  const cloudinary = getCloudinary();
  const folder = `lpn/${scope}`;
  const filename = `${Date.now()}-${sanitizeFilename(originalName)}`;

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        public_id: filename,
        overwrite: false,
        resource_type: 'image'
      },
      (error, result) => {
        if (error) {
          reject(error);
          return;
        }
        resolve(result);
      }
    );

    uploadStream.end(buffer);
  });
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
  const extension = originalName.includes('.') ? `.${originalName.split('.').pop().toLowerCase()}` : '';

  if (!ALLOWED_EXTENSIONS.has(extension)) {
    return NextResponse.json({ message: 'รองรับเฉพาะไฟล์ภาพ (JPG, PNG, GIF, WEBP, SVG)' }, { status: 400 });
  }

  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    const result = await uploadToCloudinary(buffer, { scope, originalName });

    return NextResponse.json(
      {
        message: 'อัปโหลดไฟล์สำเร็จ',
        url: result.secure_url,
        publicId: result.public_id
      },
      { status: 201 }
    );
  } catch (error) {
    const message = error?.message ?? 'ไม่สามารถอัปโหลดไฟล์ได้';
    return NextResponse.json({ message }, { status: 500 });
  }
}
