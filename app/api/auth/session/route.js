import { NextResponse } from 'next/server';

import { verifySessionToken } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  const token = request.cookies.get('admin_token')?.value;
  return NextResponse.json({ authenticated: verifySessionToken(token) });
}
