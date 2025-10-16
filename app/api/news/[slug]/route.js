import { NextResponse } from 'next/server';

import { deleteNews, updateNews } from '@/lib/news';
import { verifySessionToken } from '@/lib/auth';

export const dynamic = 'force-dynamic';

function requireAuth(request) {
  const token = request.cookies.get('admin_token')?.value;

  if (!verifySessionToken(token)) {
    return NextResponse.json({ message: 'ไม่ได้รับอนุญาต' }, { status: 401 });
  }

  return null;
}

export async function PATCH(request, { params }) {
  const authResponse = requireAuth(request);
  if (authResponse) {
    return authResponse;
  }

  const body = await request.json();
  const payload = {};

  if (Object.prototype.hasOwnProperty.call(body, 'title')) {
    payload.title = body.title;
  }

  if (Object.prototype.hasOwnProperty.call(body, 'summary')) {
    payload.summary = body.summary;
  }

  if (Object.prototype.hasOwnProperty.call(body, 'content')) {
    payload.content = body.content;
  }

  if (Object.prototype.hasOwnProperty.call(body, 'date')) {
    payload.date = body.date;
  }

  if (Object.prototype.hasOwnProperty.call(body, 'published')) {
    payload.published = body.published;
  }

  if (Object.prototype.hasOwnProperty.call(body, 'displayFrom')) {
    payload.displayFrom = body.displayFrom;
  }

  if (Object.prototype.hasOwnProperty.call(body, 'displayUntil')) {
    payload.displayUntil = body.displayUntil;
  }

  if (Object.prototype.hasOwnProperty.call(body, 'imageUrl')) {
    payload.imageUrl = body.imageUrl;
  }

  if (Object.keys(payload).length === 0) {
    return NextResponse.json({ message: 'ไม่พบข้อมูลที่ต้องการอัปเดต' }, { status: 400 });
  }

  try {
    const updated = await updateNews(params.slug, payload);
    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 400 });
  }
}

export async function DELETE(request, { params }) {
  const authResponse = requireAuth(request);
  if (authResponse) {
    return authResponse;
  }

  try {
    await deleteNews(params.slug);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 400 });
  }
}
