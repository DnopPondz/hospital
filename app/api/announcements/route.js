import { NextResponse } from 'next/server';

import { addAnnouncement, getAnnouncements } from '@/lib/announcements';
import { verifySessionToken } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET() {
  const announcements = await getAnnouncements();
  return NextResponse.json(announcements);
}

export async function POST(request) {
  const token = request.cookies.get('admin_token')?.value;

  if (!verifySessionToken(token)) {
    return NextResponse.json({ message: 'ไม่ได้รับอนุญาต' }, { status: 401 });
  }

  const { title, summary, content, date } = await request.json();

  try {
    const announcement = await addAnnouncement({ title, summary, content, date });
    return NextResponse.json(announcement, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 400 });
  }
}
