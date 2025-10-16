import { NextResponse } from 'next/server';

import { addAnnouncement, getAnnouncements } from '@/lib/announcements';
import { verifySessionToken } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  const token = request.cookies.get('admin_token')?.value;
  const includeHidden = verifySessionToken(token);
  const announcements = await getAnnouncements({ includeHidden });
  return NextResponse.json(announcements);
}

export async function POST(request) {
  const token = request.cookies.get('admin_token')?.value;

  if (!verifySessionToken(token)) {
    return NextResponse.json({ message: 'ไม่ได้รับอนุญาต' }, { status: 401 });
  }

  const { title, summary, content, date, displayFrom, displayUntil, imageUrl } = await request.json();

  try {
    const announcement = await addAnnouncement({
      title,
      summary,
      content,
      date,
      displayFrom,
      displayUntil,
      imageUrl
    });
    return NextResponse.json(announcement, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 400 });
  }
}
