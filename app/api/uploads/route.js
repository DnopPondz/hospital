import { NextResponse } from 'next/server';

import { verifySessionToken } from '@/lib/auth';
import { saveUploadedImage } from '@/lib/uploads';

export const dynamic = 'force-dynamic';

export async function POST(request) {
  const token = request.cookies.get('admin_token')?.value;

  if (!verifySessionToken(token)) {
    return NextResponse.json({ message: 'ไม่ได้รับอนุญาต' }, { status: 401 });
  }

  const formData = await request.formData();
  const image = formData.get('image');

  if (!image || typeof image !== 'object' || typeof image.arrayBuffer !== 'function' || image.size === 0) {
    return NextResponse.json({ message: 'กรุณาเลือกไฟล์ภาพ' }, { status: 400 });
  }

  try {
    const url = await saveUploadedImage(image);
    return NextResponse.json({ url });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 400 });
  }
}
