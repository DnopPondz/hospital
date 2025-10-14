import { NextResponse } from 'next/server';

import { addNews, getNews } from '@/lib/news';
import { verifySessionToken } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  const token = request.cookies.get('admin_token')?.value;
  const includeHidden = verifySessionToken(token);
  const news = await getNews({ includeHidden });
  return NextResponse.json(news);
}

export async function POST(request) {
  const token = request.cookies.get('admin_token')?.value;

  if (!verifySessionToken(token)) {
    return NextResponse.json({ message: 'ไม่ได้รับอนุญาต' }, { status: 401 });
  }

  const { title, summary, content, date, displayFrom, displayUntil } = await request.json();

  try {
    const newsItem = await addNews({ title, summary, content, date, displayFrom, displayUntil });
    return NextResponse.json(newsItem, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 400 });
  }
}
