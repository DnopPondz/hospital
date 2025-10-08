import { NextResponse } from 'next/server';

import { deleteAnnouncement, setAnnouncementVisibility } from '@/lib/announcements';
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

  const { published } = await request.json();

  try {
    const updated = await setAnnouncementVisibility(params.slug, published);
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
    await deleteAnnouncement(params.slug);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 400 });
  }
}
