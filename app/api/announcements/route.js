import { NextResponse } from 'next/server';

import { addAnnouncement, getAnnouncements } from '@/lib/announcements';
import { verifySessionToken } from '@/lib/auth';
import { deleteUploadedFile, saveUploadedImage } from '@/lib/uploads';

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

  const formData = await request.formData();

  const title = formData.get('title');
  const summary = formData.get('summary');
  const content = formData.get('content');
  const date = formData.get('date');
  const displayFrom = formData.get('displayFrom');
  const displayUntil = formData.get('displayUntil');
  const image = formData.get('image');

  let imageUrl = null;

  try {
    if (image && typeof image === 'object' && typeof image.arrayBuffer === 'function' && image.size > 0) {
      imageUrl = await saveUploadedImage(image);
    }

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
    if (imageUrl) {
      try {
        await deleteUploadedFile(imageUrl);
      } catch (cleanupError) {
        console.warn('Failed to clean up uploaded announcement image', cleanupError);
      }
    }
    return NextResponse.json({ message: error.message }, { status: 400 });
  }
}
