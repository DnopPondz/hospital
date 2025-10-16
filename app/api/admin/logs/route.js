import { NextResponse } from 'next/server';

import { verifySessionToken } from '@/lib/auth';
import { getReadStatistics } from '@/lib/logs';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  const token = request.cookies.get('admin_token')?.value;

  if (!verifySessionToken(token)) {
    return NextResponse.json({ message: 'ไม่ได้รับอนุญาต' }, { status: 401 });
  }

  const limitParam = request.nextUrl.searchParams.get('limit');
  const limit = Number.isInteger(Number(limitParam)) ? Math.max(10, Math.min(Number(limitParam), 200)) : 50;

  try {
    const stats = await getReadStatistics({ limit });
    return NextResponse.json(stats);
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
