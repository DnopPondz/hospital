import { NextResponse } from 'next/server';
import { sendContactEmail } from '@/lib/email';

function validateEmail(value) {
  return /.+@.+\..+/.test(value);
}

export async function POST(request) {
  try {
    const body = await request.json();
    const fullname = body.fullname?.trim();
    const email = body.email?.trim();
    const message = body.message?.trim();

    if (!fullname || !email || !message) {
      return NextResponse.json(
        { error: 'กรุณากรอกชื่อ อีเมล และข้อความให้ครบถ้วน' },
        { status: 400 }
      );
    }

    if (!validateEmail(email)) {
      return NextResponse.json(
        { error: 'รูปแบบอีเมลไม่ถูกต้อง' },
        { status: 400 }
      );
    }

    await sendContactEmail({ fullname, email, message });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to send contact email', error);

    return NextResponse.json(
      { error: 'ไม่สามารถส่งอีเมลได้ กรุณาลองใหม่อีกครั้งภายหลัง' },
      { status: 500 }
    );
  }
}
