import { NextResponse } from 'next/server';

import { deleteNews, updateNews } from '@/lib/news';
import { verifySessionToken } from '@/lib/auth';
import { deleteUploadedFile, saveUploadedImage } from '@/lib/uploads';

export const dynamic = 'force-dynamic';

function requireAuth(request) {
  const token = request.cookies.get('admin_token')?.value;

  if (!verifySessionToken(token)) {
    return NextResponse.json({ message: 'ไม่ได้รับอนุญาต' }, { status: 401 });
  }

  return null;
}

export async function PATCH(request, context) {
  const { slug } = await context.params;
  const authResponse = requireAuth(request);
  if (authResponse) {
    return authResponse;
  }

  const body = await request.json();
  const payload = {};

  if (Object.prototype.hasOwnProperty.call(body, 'published')) {
    payload.published = body.published;
  }

  if (Object.prototype.hasOwnProperty.call(body, 'displayFrom')) {
    payload.displayFrom = body.displayFrom;
  }

  if (Object.prototype.hasOwnProperty.call(body, 'displayUntil')) {
    payload.displayUntil = body.displayUntil;
  }

  if (Object.keys(payload).length === 0) {
    return NextResponse.json({ message: 'ไม่พบข้อมูลที่ต้องการอัปเดต' }, { status: 400 });
  }

  try {
    const updated = await updateNews(slug, payload);
    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 400 });
  }
}

export async function PUT(request, context) {
  const { slug } = await context.params;
  const authResponse = requireAuth(request);
  if (authResponse) {
    return authResponse;
  }

  const formData = await request.formData();

  const title = formData.get('title');
  const summary = formData.get('summary');
  const content = formData.get('content');
  const date = formData.get('date');
  const displayFrom = formData.get('displayFrom');
  const displayUntil = formData.get('displayUntil');
  const removeImage = formData.get('removeImage') === 'true';
  const image = formData.get('image');

  let uploadedImageUrl = null;

  try {
    if (image && typeof image === 'object' && typeof image.arrayBuffer === 'function' && image.size > 0) {
      uploadedImageUrl = await saveUploadedImage(image);
    }

    const updates = {
      title,
      summary,
      content,
      date,
      displayFrom,
      displayUntil
    };

    if (removeImage) {
      updates.removeImage = true;
    }

    if (uploadedImageUrl) {
      updates.imageUrl = uploadedImageUrl;
    }

    const updated = await updateNews(slug, updates);
    return NextResponse.json(updated);
  } catch (error) {
    if (uploadedImageUrl) {
      try {
        await deleteUploadedFile(uploadedImageUrl);
      } catch (cleanupError) {
        console.warn('Failed to clean up uploaded news image', cleanupError);
      }
    }
    return NextResponse.json({ message: error.message }, { status: 400 });
  }
}

export async function DELETE(request, context) {
  const { slug } = await context.params;
  const authResponse = requireAuth(request);
  if (authResponse) {
    return authResponse;
  }

  try {
    await deleteNews(slug);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 400 });
  }
}
