import { NextResponse } from 'next/server';

import { ADMIN_PASSWORD, ADMIN_USERNAME, createSessionToken } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function POST(request) {
  const { username, password } = await request.json();

  if (username !== ADMIN_USERNAME || password !== ADMIN_PASSWORD) {
    return NextResponse.json({ message: 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง' }, { status: 401 });
  }

  const token = createSessionToken();
  const response = NextResponse.json({ success: true });

  response.cookies.set({
    name: 'admin_token',
    value: token,
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 8,
    path: '/'
  });

  return response;
}
